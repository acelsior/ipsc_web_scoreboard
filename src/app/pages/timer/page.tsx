"use client";
import React from "react";
import styles from "./page.module.css";
import { Stopplate } from "@/app/class/stopplate/stopplate";

export default function TimerPage() {
    const [displayTime, setDisplayTime] = React.useState<number>(0);
    const [menuState, setMenuState] = React.useState<boolean>(false);

    async function debugStopplate() {
        await Stopplate.getInstance().connect();
        await Stopplate.getInstance().startStopplateTimmer();
        Stopplate.getInstance().registerHitEvent((event, value) => {
            console.log(event, value);
        });
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
                        {displayTime.toFixed(2)}
                    </h1>
                    <button className={styles.timerControllButton}>Menu</button>
                    <button className={styles.timerControllButton}>
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
