"use client";
import React from "react";
import styles from "./page.module.css";
import { Stopplate } from "@/app/class/stopplate/stopplate";
import { usePathname, useRouter } from "next/navigation";

export default function TimerPage() {
    const route = useRouter();
    const pathname = usePathname();
    const [displayTime, setDisplayTime] = React.useState<number>(0);
    const [menuState, setMenuState] = React.useState<boolean>(false);
    const stopplateInstance = Stopplate.getInstance();

    async function debugStopplate() {
        await stopplateInstance.connect();
        await stopplateInstance.startStopplateTimmer();
        stopplateInstance.registerHitEvent((event, value) => {
            console.log(event, value);
        });
    }

    function startHandler() {
        countDown(1000, () => {
            console.log("done");
        });
    }

    async function countDown(ms: number, cb: Function) {
        await new Promise<void>((solve) => {
            var intervalID: NodeJS.Timer;
            var startTime = Date.now();
            intervalID = setInterval(() => {
                console.log("countDown");
                setDisplayTime(Math.abs((ms + (startTime - Date.now())) / 1000));
            });
            setTimeout(() => {
                clearInterval(intervalID);
                solve();
            }, ms);
        });
        cb();
    }

    function openMenu() {
        route.push(pathname + "/menu");
    }

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
                        {(displayTime).toFixed(2)}
                    </h1>
                    <button
                        className={styles.timerControllButton}
                        onClick={openMenu}
                    >
                        Menu
                    </button>
                    <button
                        className={styles.timerControllButton}
                        onClick={startHandler}
                    >
                        Start
                    </button>
                    <button className={styles.timerControllButton}>
                        Clear
                    </button>
                    <button className={styles.timerControllButton}>
                        Review
                    </button>
                    <button
                        className={styles.timerControllButton}
                        style={{ gridColumn: "span 2", width: "95%" }}
                        onClick={debugStopplate}
                    >
                        Manual Stop
                    </button>
                </div>
                <div className={styles.timerHistory}>dwadw</div>
            </div>
        );
}
