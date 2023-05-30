"use client";
import React, { ChangeEvent } from "react";
import style from "./page.module.css";
import { BuzzerWaveformType } from "@/app/class/buzzer";
import { SettingStoreDTO, Stopplate } from "@/app/class/stopplate/stopplate";

function clampInt(
    value: number,
    min: number,
    max: number,
    defaultValue: number = 1
) {
    if (value > max) value = max;
    else if (value < min) value = min;
    if (isNaN(value)) value = defaultValue;
    return value;
}
function clampFloat(
    value: number,
    min: number,
    max: number,
    defaultValue: number = 1
) {
    if (value > max) value = max;
    else if (value < min) value = min;
    if (isNaN(value)) value = defaultValue;
    return value;
}

export default function MenuPage() {
    const [inited, setInited] = React.useState<boolean>(false);
    const [flashDuration, setFlashDuration] = React.useState<number>(0);
    const [minRandomTime, setMinRandomTime] = React.useState<number>(0);
    const [maxRandomTime, setMaxRandomTime] = React.useState<number>(30);
    const [buzzerHertz, setBuzzerHertz] = React.useState<number>(0);
    const [buzzerWaveform, setBuzzerWaveform] =
        React.useState<BuzzerWaveformType>(BuzzerWaveformType.Sine);
    const stopplate = Stopplate.getInstance();
    const [isConnected, setIsConnected] = React.useState<boolean>(
        stopplate.isConnected
    );
    const timeOutRef = React.useRef(null);
    function throttle(fn: Function, delay: number) {
        if (!timeOutRef.current) {
            timeOutRef.current = setTimeout(() => {
                timeOutRef.current = null;
                fn();
            }, delay);
        }
    }

    React.useLayoutEffect(() => {
        if (inited) return;
        let flashDurationStore = sessionStorage.getItem("flashDuration");
        if (flashDurationStore) {
            setFlashDuration(parseInt(flashDurationStore));
        }
        let minRandomTimeStore = sessionStorage.getItem("minRandomTime");
        if (minRandomTimeStore) {
            setMinRandomTime(parseFloat(minRandomTimeStore));
        }
        let maxRandomTimeStore = sessionStorage.getItem("maxRandomTime");
        if (maxRandomTimeStore) {
            setMaxRandomTime(parseFloat(maxRandomTimeStore));
        }
        let buzzerHertzStore = sessionStorage.getItem("buzzerHertz");
        if (buzzerHertzStore) {
            setBuzzerHertz(parseInt(buzzerHertzStore));
        }
        let buzzerWaveformStore = sessionStorage.getItem("buzzerWaveform");
        if (buzzerWaveformStore) {
            setBuzzerWaveform(parseInt(buzzerWaveformStore));
        }
        setInited(true);
    }, [
        flashDuration,
        minRandomTime,
        maxRandomTime,
        buzzerHertz,
        buzzerWaveform,
        inited,
    ]);
    React.useEffect(() => {
        if (!inited) return;
        throttle(() => {
            console.log(
                flashDuration,
                minRandomTime,
                maxRandomTime,
                buzzerHertz,
                buzzerWaveform
            );
            stopplate.writeSettingFromStopplate({
                flashDuration: flashDuration,
                minRandomTime: minRandomTime,
                maxRandomTime: maxRandomTime,
                buzzerHertz: buzzerHertz,
                buzzerWaveform: buzzerWaveform,
            });
            sessionStorage.setItem("flashDuration", flashDuration.toString());
            sessionStorage.setItem("minRandomTime", minRandomTime.toString());
            sessionStorage.setItem("maxRandomTime", maxRandomTime.toString());
            sessionStorage.setItem("buzzerHertz", buzzerHertz.toString());
            sessionStorage.setItem("buzzerWaveform", buzzerWaveform.toString());
        }, 500);
    }, [
        flashDuration,
        minRandomTime,
        maxRandomTime,
        buzzerHertz,
        buzzerWaveform,
        stopplate,
        inited
    ]);

    const flashDurationChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = (event: ChangeEvent<HTMLInputElement>) => {
        setFlashDuration(clampInt(parseFloat(event.target.value), 0, 30, 0));
    };

    const minRandomTimeChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = (event: ChangeEvent<HTMLInputElement>) => {
        setMinRandomTime(
            clampFloat(parseFloat(event.target.value), 0, maxRandomTime, 0)
        );
    };
    const maxRandomTimeChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = (event: ChangeEvent<HTMLInputElement>) => {
        setMaxRandomTime(
            clampFloat(parseFloat(event.target.value), minRandomTime, 30, 30)
        );
    };
    const buzzerHertzChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = (event: ChangeEvent<HTMLInputElement>) => {
        setBuzzerHertz(
            clampFloat(parseInt(event.target.value), minRandomTime, 5000, 2500)
        );
    };
    const buzzerWaveformChangeHandler: React.ChangeEventHandler<
        HTMLSelectElement
    > = (event: ChangeEvent<HTMLSelectElement>) => {
        setBuzzerWaveform(parseInt(event.target.value) as BuzzerWaveformType);
    };

    const connectHandler = async () => {
        stopplate.disconnect();
        await stopplate.connect();
        const setting = await stopplate.getSettingFromStopplate();
        setFlashDuration(setting.flashDuration);
        setBuzzerHertz(setting.buzzerHertz);
        setBuzzerWaveform(setting.buzzerWaveform);
        setMaxRandomTime(setting.maxRandomTime);
        setMinRandomTime(setting.minRandomTime);
        console.log(stopplate.isConnected);
        setIsConnected(true);
    };
    const disconnectHandler = async () => {
        stopplate.disconnect();
        setTimeout(() => {
            console.log(stopplate.isConnected);
            setIsConnected(false);
        }, 100);
    };

    return (
        <div className={style.menuContainer}>
            <h1>Stopplate: </h1>
            <div className={style.stopplateRow}>
                <button className={style.button} onClick={connectHandler}>
                    Connect
                </button>
                <button className={style.button} onClick={disconnectHandler}>
                    Disconnect
                </button>
            </div>
            {isConnected ? (
                <>
                    <p>Stopplate indicator flash duration: </p>
                    <div className={style.stopplateRow}>
                        <input
                            className={style.rangeInput}
                            type="range"
                            onChange={flashDurationChangeHandler}
                            min={0}
                            max={30}
                            value={flashDuration}
                        />
                        <input
                            className={style.rangeInputDisplay}
                            value={flashDuration}
                            onChange={flashDurationChangeHandler}
                        />
                    </div>
                    <p>Countdown random time range: </p>
                    <div className={style.stopplateRow}>
                        <p>min:</p>
                        <input
                            className={style.rangeInputDisplay}
                            onChange={minRandomTimeChangeHandler}
                            value={minRandomTime}
                            min={0}
                            max={maxRandomTime}
                            type="number"
                        />
                        <input
                            className={style.rangeInput}
                            type="range"
                            min={0}
                            max={maxRandomTime}
                            onChange={minRandomTimeChangeHandler}
                            value={minRandomTime}
                        />
                        <input
                            className={style.rangeInput}
                            type="range"
                            value={maxRandomTime}
                            min={minRandomTime}
                            max={30}
                            onChange={maxRandomTimeChangeHandler}
                        />
                        <input
                            className={style.rangeInputDisplay}
                            onChange={maxRandomTimeChangeHandler}
                            value={maxRandomTime}
                            min={minRandomTime}
                            max={30}
                            type="number"
                        />
                        <p>:max</p>
                    </div>
                    <p>Buzzer hertz: </p>
                    <div className={style.stopplateRow}>
                        <input
                            className={style.rangeInput}
                            type="range"
                            onChange={buzzerHertzChangeHandler}
                            value={buzzerHertz}
                            min={0}
                            max={5000}
                        />
                        <input
                            className={style.rangeInputDisplay}
                            type="number"
                            onChange={buzzerHertzChangeHandler}
                            value={buzzerHertz}
                            max={5000}
                        />
                        <p>Hz</p>
                    </div>
                    <p>Buzzer Waveform: </p>
                    <div className={style.stopplateRow}>
                        <select
                            className={style.dropDown}
                            value={buzzerWaveform}
                            onChange={buzzerWaveformChangeHandler}
                        >
                            <option value={BuzzerWaveformType.Sine}>
                                Sine
                            </option>
                            <option value={BuzzerWaveformType.Square}>
                                Square
                            </option>
                            <option value={BuzzerWaveformType.Sawtooth}>
                                Sawtooth
                            </option>
                            <option value={BuzzerWaveformType.Triangle}>
                                Triangle
                            </option>
                        </select>
                    </div>
                </>
            ) : (
                <h1>Connect to config more settings</h1>
            )}
        </div>
    );
}
