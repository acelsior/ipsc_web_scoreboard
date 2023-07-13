import React from "react";
import { BuzzerWaveformType } from "../buzzer";

const STOPPLATE_SERVICE_UUID = "7a0247e7-8e88-409b-a959-ab5092ddb03e";
const START_SIGNAL_CHARACTERISTIC_UUID = "3c224d84-566d-4f13-8b1c-2117021ff1a2";
const STOPPLATE_SIGNAL_CHARACTERISTIC_UUID =
    "57b92756-3df4-4038-b825-fc8e1c2fdb5b";
const TIME_CORRECTION_CHARACTERISTIC_UUID =
    "840a0941-55e9-44e4-bfff-1c3c27bf6af0";
const SETTING_STORE_CHARACTERISTIC_UUID =
    "798f2478-4c44-417f-bb6e-ee2a826cc17c";
//@ts-nocheck

export interface StopplateHitTimeDTO {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
export interface SettingStoreDTO {
    flashDuration: number;
    minRandomTime: number;
    maxRandomTime: number;
    buzzerHertz: number;
    buzzerWaveform: BuzzerWaveformType;
}

export class Stopplate {
    static instance: Stopplate;

    private constructor() {}

    public static getInstance(): Stopplate {
        if (!Stopplate.instance) {
            Stopplate.instance = new Stopplate();
        }
        return Stopplate.instance;
    }

    public isConnected: boolean = false;
    public bluetoothDevice?: BluetoothDevice;
    public bluetoothGATTServer?: BluetoothRemoteGATTServer;
    public bluetoothService?: BluetoothRemoteGATTService;
    public startSignalChar?: BluetoothRemoteGATTCharacteristic;
    public timeCorrectionChar?: BluetoothRemoteGATTCharacteristic;
    public stopplateSignalChar?: BluetoothRemoteGATTCharacteristic;
    public settingStoreChar?: BluetoothRemoteGATTCharacteristic;

    private onHitListener: Function[] = [];

    async connect() {
        console.log("Connecting");
        this.bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [STOPPLATE_SERVICE_UUID],
        });

        if (!this.bluetoothDevice?.gatt) return;
        console.log("Connecting to GATT Server...");
        this.bluetoothDevice.addEventListener(
            "gattserverdisconnected",
            this.onDisconnected
        );
        this.isConnected = true;

        this.bluetoothGATTServer = await this.bluetoothDevice.gatt.connect();
        if (!this.bluetoothGATTServer) return;

        await this.retriveBLEChar();
    }
    private async retriveBLEChar() {
        console.log("Getting Service...");
        this.bluetoothService =
            await this.bluetoothGATTServer.getPrimaryService(
                STOPPLATE_SERVICE_UUID
            );

        if (!this.bluetoothService) return;
        console.log("Getting Characteristic...");
        this.stopplateSignalChar =
            await this.bluetoothService.getCharacteristic(
                STOPPLATE_SIGNAL_CHARACTERISTIC_UUID
            );
        await this.stopplateSignalChar.startNotifications();
        this.stopplateSignalChar.addEventListener(
            "characteristicvaluechanged",
            (event: Event) => {
                this.onHitListener.forEach((cb) => {
                    cb(
                        event,
                        JSON.parse(
                            new TextDecoder().decode(
                                (
                                    event as unknown as {
                                        target: { value: BufferSource };
                                    }
                                ).target.value as BufferSource
                            )
                        )
                    );
                });
            }
        );
        this.startSignalChar = await this.bluetoothService.getCharacteristic(
            START_SIGNAL_CHARACTERISTIC_UUID
        );
        this.timeCorrectionChar = await this.bluetoothService.getCharacteristic(
            TIME_CORRECTION_CHARACTERISTIC_UUID
        );
        this.settingStoreChar = await this.bluetoothService.getCharacteristic(
            SETTING_STORE_CHARACTERISTIC_UUID
        );
        //init stopplate time
        await this.timeCorrectionChar.writeValueWithoutResponse(
            new TextEncoder().encode(Date.now().toString())
        );
    }

    disconnect() {
        this.normalDisconnect();
    }
    async startStopplateTimmer() {
        try {
            return await this.startSignalChar?.readValue();
        } catch (e) {
            this.reconnect().then(() => {
                this.startStopplateTimmer();
            });
        }
    }
    registerHitEvent(cb: (event: Event, value: StopplateHitTimeDTO) => void) {
        this.onHitListener.push(cb);
    }
    async getSettingFromStopplate(): Promise<SettingStoreDTO | undefined> {
        let settingChar: DataView | undefined;
        settingChar = await new Promise(async (resolve, reject) => {
            try {
                settingChar = await this.settingStoreChar?.readValue();
                resolve(settingChar);
            } catch (e) {
                this.reconnect().then(async () => {
                    settingChar = await this.settingStoreChar?.readValue();
                    resolve(settingChar);
                });
            }
        });
        return JSON.parse(new TextDecoder().decode(settingChar));
    }
    async writeSettingFromStopplate(newConfig: SettingStoreDTO) {
        try {
            return await this.settingStoreChar?.writeValueWithoutResponse(
                new TextEncoder().encode(JSON.stringify(newConfig))
            );
        } catch (e) {
            this.reconnect().then(() => {
                this.writeSettingFromStopplate(newConfig);
            });
        }
    }
    removeAllEventListener() {
        this.onHitListener = [];
    }

    reconnect() {
        return new Promise<void>((resolve, reject) => {
            exponentialBackoff(
                10 /* max retries */,
                3 /* seconds delay */,
                () => {
                    time("Connecting to Bluetooth Device... ");
                    return this.bluetoothDevice?.gatt?.connect();
                },
                async () => {
                    console.log(
                        "> Bluetooth Device connected. Try disconnect it now."
                    );
                    await this.retriveBLEChar();
                    resolve();
                },
                function fail() {
                    time("Failed to reconnect.");
                    reject();
                }
            );
        });
    }

    private onDisconnected() {
        if (this.isConnected) {
            this.reconnect();
        }
    }

    private normalDisconnect() {
        console.log("Disconnected");
        this.isConnected = false;
        this.bluetoothGATTServer?.disconnect();
        delete this.bluetoothDevice;
        delete this.bluetoothGATTServer;
        delete this.bluetoothService;
        delete this.startSignalChar;
        delete this.timeCorrectionChar;
        delete this.stopplateSignalChar;
        delete this.settingStoreChar;
    }
}

function exponentialBackoff(
    max: number,
    delay: number,
    toTry: () => any,
    success: (event: any) => void,
    fail: () => void
) {
    toTry()
        .then((result: any) => success(result))
        .catch((_: any) => {
            if (max === 0) {
                return fail();
            }
            time("Retrying in " + delay + "s... (" + max + " tries left)");
            setTimeout(function () {
                exponentialBackoff(--max, delay * 2, toTry, success, fail);
            }, delay * 1000);
        });
}

function time(text: string) {
    console.log("[" + new Date().toJSON().substr(11, 8) + "] " + text);
}
