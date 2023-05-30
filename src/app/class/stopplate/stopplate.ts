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


        console.log("Getting Service...");
        this.bluetoothService = await this.bluetoothGATTServer.getPrimaryService(
            STOPPLATE_SERVICE_UUID
        );


        if (!this.bluetoothService) return;
        console.log("Getting Characteristic...");
        this.stopplateSignalChar = await this.bluetoothService
            .getCharacteristic(STOPPLATE_SIGNAL_CHARACTERISTIC_UUID)
        await this.stopplateSignalChar.startNotifications();
        this.stopplateSignalChar.addEventListener(
            "characteristicvaluechanged",
            (event) => {
                this.onHitListener.forEach((cb) => {
                    cb(event, JSON.parse(new TextDecoder().decode(event.target?.value)))
                })
            }
        );
        this.startSignalChar = await this.bluetoothService
            .getCharacteristic(START_SIGNAL_CHARACTERISTIC_UUID)
        this.timeCorrectionChar = await this.bluetoothService
            .getCharacteristic(TIME_CORRECTION_CHARACTERISTIC_UUID)
        this.settingStoreChar = await this.bluetoothService
            .getCharacteristic(SETTING_STORE_CHARACTERISTIC_UUID)
        //init stopplate time
        await this.timeCorrectionChar.writeValueWithoutResponse(
            new TextEncoder().encode(Date.now().toString())
        );
    }
    disconnect() {
        this.bluetoothGATTServer?.disconnect();
    }
    async startStopplateTimmer() {
        return await this.startSignalChar?.readValue();
    }
    registerHitEvent(cb: (event: Event, value: String) => void) {
        this.onHitListener.push(cb);
    }
    async getSettingFromStopplate(): Promise<SettingStoreDTO> {
        return JSON.parse(new TextDecoder().decode(await this.settingStoreChar?.readValue()));
    }
    async writeSettingFromStopplate(newConfig: SettingStoreDTO) {
        return await this.settingStoreChar?.writeValueWithoutResponse(new TextEncoder().encode(JSON.stringify(newConfig)));
    }

    

    private onDisconnected() {
        console.log("Disconnected");
        this.isConnected = false;
        delete this.bluetoothDevice;
        delete this.bluetoothGATTServer;
        delete this.bluetoothService;
        delete this.startSignalChar;
        delete this.timeCorrectionChar;
        delete this.stopplateSignalChar;
        delete this.settingStoreChar;
    }
}
