"use client";

import styles from "./paperTargetScoringRow.module.css";
import useLongPress from "@/app/hooks/useLongPress";

export interface IPaperTargetScoringRowProps {
    targetIndex: number;
    a: number;
    c: number;
    d: number;
    m: number;
    ns: number;
    fieldCorrectly: boolean;
    setA: (targetIndex: number, value: number) => void;
    setC: (targetIndex: number, value: number) => void;
    setD: (targetIndex: number, value: number) => void;
    setM: (targetIndex: number, value: number) => void;
    setNS: (targetIndex: number, value: number) => void;
    setFieldCorrectly: (targetIndex: number, value: boolean) => void;
}

export default function PaperTargetScoringRow(
    props: IPaperTargetScoringRowProps
) {
    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };

    return (
        <div className={`${styles.paperTargetScoringRow} ${props.fieldCorrectly ? "" : styles.errorField}`}>
            <span>{props.targetIndex + 1}</span>
            <span
                {...useLongPress(
                    () => {
                        props.setA(props.targetIndex, 0);
                    },
                    () => {
                        props.setA(props.targetIndex, props.a + 1);
                    },
                    defaultOptions
                )}
            >
                {props.a}
            </span>
            <span
                {...useLongPress(
                    () => {
                        props.setC(props.targetIndex, 0);
                    },
                    () => {
                        props.setC(props.targetIndex, props.c + 1);
                    },
                    defaultOptions
                )}
            >
                {props.c}
            </span>
            <span
                {...useLongPress(
                    () => {
                        props.setD(props.targetIndex, 0);
                    },
                    () => {
                        props.setD(props.targetIndex, props.d + 1);
                    },
                    defaultOptions
                )}
            >
                {props.d}
            </span>
            <span
                {...useLongPress(
                    () => {
                        props.setM(props.targetIndex, 0);
                    },
                    () => {
                        props.setM(props.targetIndex, props.m + 1);
                    },
                    defaultOptions
                )}
            >
                {props.m}
            </span>
            <span
                {...useLongPress(
                    () => {
                        props.setNS(props.targetIndex, 0);
                    },
                    () => {
                        props.setNS(props.targetIndex, props.ns + 1);
                    },
                    defaultOptions
                )}
            >
                {props.ns}
            </span>
        </div>
    );
}
