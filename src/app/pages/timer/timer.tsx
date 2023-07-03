"use client";
import React, { ReactNode } from "react";
import styles from "./page.module.css";
import {
    Stopplate,
    StopplateHitTimeDTO,
} from "@/app/class/stopplate/stopplate";
import { usePathname, useRouter } from "next/navigation";
import { BuzzerWaveformObject, beep } from "@/app/class/buzzer";
import HitHistoryItem from "@/app/component/timer/hitHistoryItem";
function getRandomNumberInRange(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min) + min; // The maximum is exclusive and the minimum is inclusive
}

export interface IHitHistory {
    time: number;
    splitTime: number;
    shots: number;
}

export interface TimerProp {
    setTime?: (time: number) => void; //if this is not null then this is a page, otherwise it is a compomnent
}

export default function Timer(props: TimerProp) {
    const route = useRouter();
    const pathname = usePathname();
    const [displayTime, setDisplayTime] = React.useState<number>(0);
    const [menuState, setMenuState] = React.useState<boolean>(false);
    const stopplateInstance = Stopplate.getInstance();
    const [intervalID, setIntervalID] = React.useState<NodeJS.Timer | null>();
    const [hitHistoryComponent, setHitHistoryComponent] = React.useState<
        ReactNode[]
    >([]);
    const [hitHistory, setHitHistory] = React.useState<IHitHistory[]>([]);
    const [currentViewIndex, setCurrentViewIndex] = React.useState<number>(0);
    const [buttonDisableState, setButtonDisableState] = React.useState({
        menu: false,
        start: false,
        clear: false,
        review: false,
        stop: true,
    });

    async function startHandler() {
        if (!stopplateInstance.isConnected) { 
            alert("Please connect to the stoppplate !")
            return;
        }
        clearHandler();
        var setting = await stopplateInstance.getSettingFromStopplate();
        setButtonDisableState({
            menu: true,
            start: true,
            clear: false,
            review: false,
            stop: false,
        });
        var randomTime =
            getRandomNumberInRange(
                setting.minRandomTime,
                setting.maxRandomTime
            ) * 1000;
        console.log(setting);
        setCurrentViewIndex(0);
        countDown(randomTime, () => {
            console.log("done");
            beep(
                setting.buzzerHertz,
                BuzzerWaveformObject[setting.buzzerWaveform],
                1000
            );
            stopplateInstance.startStopplateTimmer();
            stopplateInstance.registerHitEvent(hitHandler);
            setButtonDisableState({
                menu: true,
                start: true,
                clear: true,
                review: false,
                stop: false,
            });
        });
    }

    async function countDown(ms: number, cb: Function) {
        const startCountDownTime = Date.now();
        var __intervalID: NodeJS.Timer;
        __intervalID = await new Promise<NodeJS.Timer>((resolve, reject) => {
            var i__intervalID = setInterval(function () {
                setIntervalID(__intervalID);
                const diffTime = Date.now() - startCountDownTime;
                setDisplayTime(Math.abs((ms - diffTime) / 1000));
                if (diffTime >= ms) {
                    setDisplayTime(0);
                    resolve(i__intervalID);
                }
            }, 1);
        });
        clearInterval(__intervalID);
        setIntervalID(null);
        cb();
    }
    function stopCountDown() {
        clearInterval(intervalID as NodeJS.Timer);
        setIntervalID(null);
    }

    function clearHandler() {
        stopCountDown();
        stopplateInstance.removeAllEventListener();
        setDisplayTime(0);
        setHitHistory([]);
        setHitHistoryComponent([]);
        setButtonDisableState({
            menu: false,
            start: false,
            clear: false,
            review: true,
            stop: true,
        });
    }

    function openMenu() {
        route.push("pages/timer/menu");
    }

    function hitHandler(event: Event, value: StopplateHitTimeDTO) {
        console.log(value);
        var intDigits = 0;
        intDigits += value.seconds;
        intDigits += value.minutes * 60;
        var decimalDigits = parseFloat("0." + value.milliseconds.toString());
        var resualt = intDigits + decimalDigits;
        setDisplayTime(resualt);
        var splittime = 0;
        if (hitHistoryComponent.length !== 0) {
            splittime = Math.abs(resualt - hitHistory[0].time);
        }
        var newHitHistory = hitHistory;
        newHitHistory.unshift({
            shots: hitHistory.length + 1,
            time: resualt,
            splitTime: splittime,
        });
        setHitHistory(newHitHistory);
        var newHitHistoryComponent = hitHistoryComponent;
        newHitHistoryComponent.unshift(
            <HitHistoryItem
                key={hitHistoryComponent.length + 1}
                hitTime={resualt}
                shotsNumber={hitHistoryComponent.length + 1}
                splitTime={splittime}
            />
        );
        setHitHistoryComponent(newHitHistoryComponent);
        if (props?.setTime)
            props.setTime(resualt)
    }

    const reviewHandler = () => {
        stopplateInstance.removeAllEventListener();
        setButtonDisableState({
            stop: true,
            menu: false,
            start: false,
            clear: false,
            review: false
        })
        if (hitHistory.length == 0)
            return;
        setDisplayTime(hitHistory[currentViewIndex].time);
        if (currentViewIndex + 1 == hitHistory.length)
            setCurrentViewIndex(0);
        else setCurrentViewIndex(currentViewIndex + 1);
    };

    if (menuState)
        return (
            <div>
                <h1>wda</h1>
            </div>
        );
    else
        return (
            <div className={styles.timerContainer}>
                <div className={styles.timerControll}>
                    <h1 className={styles.timerTimeDisplay}>
                        {displayTime.toFixed(2)}
                    </h1>
                    <button
                        className={styles.timerControllButton}
                        onClick={openMenu}
                        disabled={buttonDisableState.menu}
                    >
                        Menu
                    </button>
                    <button
                        className={styles.timerControllButton}
                        onClick={startHandler}
                        disabled={buttonDisableState.start}
                    >
                        Start
                    </button>
                    <button
                        className={styles.timerControllButton}
                        onClick={clearHandler}
                        disabled={buttonDisableState.clear}
                    >
                        Clear
                    </button>
                    <button
                        className={styles.timerControllButton}
                        onClick={reviewHandler}
                        disabled={buttonDisableState.review}
                    >
                        Review
                    </button>
                </div>
                <p>Hit History</p>
                <div className={styles.timerHistory}>
                    <div>{hitHistoryComponent}</div>
                </div>
            </div>
        );
}
