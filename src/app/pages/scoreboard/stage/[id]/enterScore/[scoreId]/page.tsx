"use client";

//TODO: THIS PAGE AND PaperTargetScoringRow SHOULD BE REFACTOR ASAP!!!! this code is so freaking dumb

import { GetAllShooterDTO, ShooterDTO } from "@/app/dtos/shooter.dto";
import { StageDTO, StageScoreDTO } from "@/app/dtos/stage.dto";
import useSWR from "swr";
import styles from "./page.module.css";
import React, { ReactNode } from "react";
import PaperTargetScoringRow from "@/app/component/paperTargetScoringRow/paperTargetScoringRow";
import Dialog from "@/app/component/dialog/dialog";
import {
    ProceduralError,
    ProceduralErrorList,
    ProceduralErrorObjectList,
    ProceduralErrorTypes,
} from "@/types";
import TimerPage from "@/app/pages/timer/page";
import { useRouter } from "next/navigation";

interface PaperTargetData {
    a: number;
    c: number;
    d: number;
    m: number;
    ns: number;
    fieldCorrectly: boolean;
}

interface TargetZoneCounterData {
    a: number;
    c: number;
    d: number;
    m: number;
    ns: number;
}


function fitArray(maximum: number, value: number) {
    const arr = [];
    let num = value;

    while (num > 0) {
        if (num <= maximum) arr.push(num);
        else arr.push(maximum);

        num = Math.floor(num - maximum);
    }
    return arr;
}

const getFetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((res) => res.json());

export default function ShooterScoringCard(props: {
    params: { id: string; scoreId: string };
}) {
    const router = useRouter();
    const STAGE_ID = parseInt(props.params.id);
    const SCORE_ID = parseInt(props.params.scoreId);

    const [platesHits, setPlatesHits] = React.useState<number>(0);
    const [platesMiss, setPlatesMiss] = React.useState<number>(0);

    // #region paper target stuff
    const [inited, setInited] = React.useState<boolean>(false);
    const [scoreDataInited, setScoreDataInited] =
        React.useState<boolean>(false);

    const [paperTargetsData, setPaperTargetsData] = React.useState<
        PaperTargetData[]
    >([]);
    const [targetZoneCounter, setTargetZoneCounter] =
        React.useState<TargetZoneCounterData>({
            a: 0,
            c: 0,
            d: 0,
            m: 0,
            ns: 0,
        });

    const { data: stageData, error: stageDataError } = useSWR<StageDTO>(
        `https://api.constrmrf.tk/api/stage/${STAGE_ID}`,
        getFetcher,
        {
            onSuccess(data, key, config) {
                if (inited) return;
                console.log("Stage data loaded");
                let newData: PaperTargetData[] = [];
                for (let index = 0; index < data.paperTargets; index++) {
                    newData[index] = {
                        a: 0,
                        c: 0,
                        d: 0,
                        m: 0,
                        ns: 0,
                        fieldCorrectly: false,
                    };
                }
                setPaperTargetsData(newData);
                setInited(true);
                setPlatesHits(data.poppersOrPlates);
            },
        }
    );
    const { data: scoreData, error: scoreDataError } = useSWR<StageScoreDTO>(
        `https://api.constrmrf.tk/api/stage/score/${SCORE_ID}`,
        getFetcher,
        {
            onSuccess: async (data) => {
                if (scoreDataInited) return;
                if (data.attempted == false) return;
                await new Promise<StageDTO>((resolve, reject) => {
                    const interval = setInterval(() => {
                        if (stageData) {
                            resolve(stageData);
                            clearInterval(interval);
                        }
                    }, 1);
                }).then((stageData) => {
                    const newPaperTargetData: PaperTargetData[] = [];
                    for (
                        let index = 0;
                        index < stageData?.paperTargets;
                        index++
                    ) {
                        newPaperTargetData.push({
                            a: 0,
                            c: 0,
                            d: 0,
                            m: 0,
                            ns: 0,
                            fieldCorrectly: false,
                        });
                    }


                    fitArray(2, data.alphaCount).map((ele, index) => {
                        newPaperTargetData[index].a = ele;
                        newPaperTargetData[index].fieldCorrectly = true;
                    });
                    fitArray(1000, data.charlieCount).map((ele, index) => {
                        newPaperTargetData[index].c = ele;
                        newPaperTargetData[index].fieldCorrectly = true;
                        newPaperTargetData.map((v, i) => {
                            if (newPaperTargetData[i].a == 2) {
                                newPaperTargetData[i + 1].c =
                                    newPaperTargetData[i].c;
                                newPaperTargetData[i].c = 0;
                                newPaperTargetData[i].fieldCorrectly = true;
                            } else if (newPaperTargetData[i].a == 1) {
                                let origin = ele;
                                newPaperTargetData[i].c =
                                    origin -
                                    (origin - (2 - newPaperTargetData[i].a));
                                newPaperTargetData[i].fieldCorrectly = true;
                                if (newPaperTargetData[i + 1] == undefined)
                                    return;
                                newPaperTargetData[i + 1].c =
                                    origin - (2 - newPaperTargetData[i].a);
                            } else {
                                const origin = newPaperTargetData[i].c;
                                newPaperTargetData[i].c =
                                    Math.min(origin, 2)
                                newPaperTargetData[i].fieldCorrectly = true;
                                if (newPaperTargetData[i + 1] == undefined)
                                    return;
                                newPaperTargetData[i + 1].c =
                                    origin - Math.min(origin, 2);
                            }
                        });
                    });
                    fitArray(1000, data.deltaCount).map((ele, index) => {
                        newPaperTargetData[index].d = ele;
                        newPaperTargetData[index].fieldCorrectly = true;
                        newPaperTargetData.map((v, i) => {
                            if (newPaperTargetData[i].c + newPaperTargetData[i].a == 2) {
                                newPaperTargetData[i + 1].d =
                                    newPaperTargetData[i].d;
                                newPaperTargetData[i].d = 0;
                                newPaperTargetData[i].fieldCorrectly = true;
                            } else if (newPaperTargetData[i].c + newPaperTargetData[i].a == 1) {
                                let origin = ele;
                                newPaperTargetData[i].d =
                                    origin -
                                    (origin - (2 - newPaperTargetData[i].c));
                                newPaperTargetData[i].fieldCorrectly = true;
                                if (newPaperTargetData[i + 1] == undefined)
                                    return;
                                newPaperTargetData[i + 1].d =
                                    origin - (2 - newPaperTargetData[i].c);
                            } else {
                                const origin = newPaperTargetData[i].d;
                                newPaperTargetData[i].d =
                                    Math.min(origin, 2)
                                newPaperTargetData[i].fieldCorrectly = true;
                                if (newPaperTargetData[i + 1] == undefined)
                                    return;
                                newPaperTargetData[i + 1].d =
                                    origin - Math.min(origin, 2);
                            }
                        });
                    });
                    fitArray(2, data.noShootCount).map((ele, index) => {
                        newPaperTargetData[index].ns = ele;
                        newPaperTargetData[index].fieldCorrectly = true;
                    });
                    fitArray(1000, data.paperMissCount).map((ele, index) => {
                        newPaperTargetData[index].m = ele;
                        newPaperTargetData[index].fieldCorrectly = true;
                        newPaperTargetData.map((v, i) => {
                            if (newPaperTargetData[i].c + newPaperTargetData[i].d + newPaperTargetData[i].a == 2) {
                                newPaperTargetData[i + 1].m =
                                    newPaperTargetData[i].m;
                                newPaperTargetData[i].m = 0;
                                newPaperTargetData[i].fieldCorrectly = true;
                            } else if (newPaperTargetData[i].c + newPaperTargetData[i].d + newPaperTargetData[i].a == 1) {
                                let origin = ele;
                                newPaperTargetData[i].m =
                                    origin -
                                    (origin - (2 - newPaperTargetData[i].d));
                                newPaperTargetData[i].fieldCorrectly = true;
                                if (newPaperTargetData[i + 1] == undefined)
                                    return;
                                newPaperTargetData[i + 1].m =
                                    origin - (2 - newPaperTargetData[i].d);
                            } else {
                                const origin = newPaperTargetData[i].m;
                                newPaperTargetData[i].m =
                                    Math.min(origin, 2)
                                newPaperTargetData[i].fieldCorrectly = true;
                                if (newPaperTargetData[i + 1] == undefined)
                                    return;
                                newPaperTargetData[i + 1].m =
                                    origin - Math.min(origin, 2);
                            }
                        });
                    });

                    setTime(data.timeCount);
                    setPlatesHits(data.plateCount);
                    setPlatesMiss(data.plateMissCount);

                    setPaperTargetsData(newPaperTargetData);
                    setScoreDataInited(true);
                });
            },
        }
    );

    React.useEffect(() => {
        let newCount: TargetZoneCounterData = {
            a: 0,
            c: 0,
            d: 0,
            m: 0,
            ns: 0,
        };

        paperTargetsData.map((target) => {
            newCount.a += target.a;
            newCount.c += target.c;
            newCount.d += target.d;
            newCount.m += target.m;
            newCount.ns += target.ns;
        });
        setTargetZoneCounter(newCount);
    }, [paperTargetsData]);

    const checkIfPaperTargetDataCorrect = (
        targetIndex: number,
        data: PaperTargetData[]
    ) => {
        if (
            data[targetIndex].a +
                data[targetIndex].c +
                data[targetIndex].d +
                data[targetIndex].m ==
                2 &&
            data[targetIndex].ns <= 2
        ) {
            return true;
        } else {
            return false;
        }
    };

    const paperTargetAZoneHandler = (targetIndex: number, value: number) => {
        let newPaperTargetData = [...paperTargetsData];
        newPaperTargetData[targetIndex].a = value;
        newPaperTargetData[targetIndex].fieldCorrectly =
            checkIfPaperTargetDataCorrect(targetIndex, newPaperTargetData);
        setPaperTargetsData(newPaperTargetData);
    };
    const paperTargetCZoneHandler = (targetIndex: number, value: number) => {
        let newPaperTargetData = [...paperTargetsData];
        newPaperTargetData[targetIndex].c = value;
        newPaperTargetData[targetIndex].fieldCorrectly =
            checkIfPaperTargetDataCorrect(targetIndex, newPaperTargetData);
        setPaperTargetsData(newPaperTargetData);
    };
    const paperTargetDZoneHandler = (targetIndex: number, value: number) => {
        let newPaperTargetData = [...paperTargetsData];
        newPaperTargetData[targetIndex].d = value;
        newPaperTargetData[targetIndex].fieldCorrectly =
            checkIfPaperTargetDataCorrect(targetIndex, newPaperTargetData);
        setPaperTargetsData(newPaperTargetData);
    };
    const paperTargetMZoneHandler = (targetIndex: number, value: number) => {
        let newPaperTargetData = [...paperTargetsData];
        newPaperTargetData[targetIndex].m = value;
        newPaperTargetData[targetIndex].fieldCorrectly =
            checkIfPaperTargetDataCorrect(targetIndex, newPaperTargetData);
        setPaperTargetsData(newPaperTargetData);
    };
    const paperTargetNSZoneHandler = (targetIndex: number, value: number) => {
        let newPaperTargetData = [...paperTargetsData];
        newPaperTargetData[targetIndex].ns = value;
        newPaperTargetData[targetIndex].fieldCorrectly =
            checkIfPaperTargetDataCorrect(targetIndex, newPaperTargetData);
        setPaperTargetsData(newPaperTargetData);
    };
    const paperTargetFieldHandler = (targetIndex: number, value: boolean) => {
        let newPaperTargetData = [...paperTargetsData];
        newPaperTargetData[targetIndex].fieldCorrectly = value;
        newPaperTargetData[targetIndex].fieldCorrectly =
            checkIfPaperTargetDataCorrect(targetIndex, newPaperTargetData);
        setPaperTargetsData(newPaperTargetData);
    };
    // #endregion

    const [showProceduralErrorDiaglog, setShowProceduralErrorDiaglog] =
        React.useState<boolean>(false);
    const [proErrors, setProErrors] = React.useState<ProceduralError[]>(
        ProceduralErrorObjectList
    );
    const [proErrorCount, setProCount] = React.useState<number>(0);
    const [showProErrorDescriptionDialog, setShowProErrorDescriptionDialog] =
        React.useState<boolean>(false);
    const [proErrorDescriptionDisplay, setProErrorDescriptionDisplay] =
        React.useState<string>("");

    const proceduralErrorHandler = () => {
        setShowProceduralErrorDiaglog(true);
    };
    const showProceduralErrorDiscripition = (description: string) => {
        setShowProErrorDescriptionDialog(true);
        setProErrorDescriptionDisplay(description);
    };

    const platesHitHandler = () => {
        if (platesHits < (stageData?.poppersOrPlates as number)) {
            setPlatesHits(
                Math.min(
                    Math.max(platesHits + 1, 0),
                    stageData?.paperTargets as number
                )
            );
            setPlatesMiss(
                Math.min(
                    Math.max(platesMiss - 1, 0),
                    stageData?.paperTargets as number
                )
            );
        }
    };
    const platesMissHandler = () => {
        if (platesMiss < (stageData?.poppersOrPlates as number)) {
            setPlatesHits(
                Math.min(
                    Math.max(platesHits - 1, 0),
                    stageData?.paperTargets as number
                )
            );
            setPlatesMiss(
                Math.min(
                    Math.max(platesMiss + 1, 0),
                    stageData?.paperTargets as number
                )
            );
        }
    };

    const updateProErrorCountHandler = () => {
        var count = 0;
        proErrors.map((pro) => {
            count += pro.currentCount;
        });
        setProCount(count);
    };

    const procedualErrorAddHandler = (proErrorIndex: number) => {
        let newProErrorList = [...proErrors]; //deep clone
        if (
            newProErrorList[proErrorIndex].currentCount + 1 <=
                newProErrorList[proErrorIndex].max ||
            newProErrorList[proErrorIndex].max == -1
        ) {
            newProErrorList[proErrorIndex].currentCount += 1;
        }
        setProErrors(newProErrorList);
        updateProErrorCountHandler();
    };
    const procedualErrorMinusHandler = (proErrorIndex: number) => {
        let newProErrorList = [...proErrors]; //deep clone
        if (
            newProErrorList[proErrorIndex].currentCount - 1 >=
            newProErrorList[proErrorIndex].min
        ) {
            newProErrorList[proErrorIndex].currentCount -= 1;
        }
        setProErrors(newProErrorList);
        updateProErrorCountHandler();
    };

    const dqHandler = () => {
        if (confirm("Are you sure you want to DQ shooter?")) {
            fetch(`https://api.constrmrf.tk/api/shooter/${SCORE_ID}/stage`, {
                method: "POST",
                headers: [["Content-Type", "application/json"]],
                body: JSON.stringify({
                    alpha: 0,
                    charlie: 0,
                    delta: 0,
                    paperMiss: 0,
                    plate: 0,
                    plateMiss: 0,
                    noShoot: 0,
                    procedureError: 0,
                    time: 0,
                    disqualified: true,
                    stageID: STAGE_ID,
                    attempted: true,
                }),
            })
                .then((res) => res.json())
                .then((respone) => {
                    if (respone.status != 400) {
                        alert("DQ succeeded");
                        router.back();
                    } else {
                        alert("Failed to DQ");
                    }
                });
        }
    };
    const dnfHandler = () => {
        if (confirm("Are you sure you want to DNF shooter?")) {
            fetch(`https://api.constrmrf.tk/api/shooter/${SCORE_ID}/stage`, {
                method: "POST",
                headers: [["Content-Type", "application/json"]],
                body: JSON.stringify({
                    alpha: 0,
                    charlie: 0,
                    delta: 0,
                    paperMiss: 0,
                    plate: 0,
                    plateMiss: 0,
                    noShoot: 0,
                    procedureError: 0,
                    time: 0,
                    dnf: true,
                    stageID: STAGE_ID,
                    attempted: true,
                }),
            })
                .then((res) => res.json())
                .then((respone) => {
                    if (respone.status != 400) {
                        alert("DNF succeeded");
                        router.back();
                    } else {
                        alert("Failed to DNF");
                    }
                });
        }
    };

    const [time, setTime] = React.useState<number>(10.25);
    const [showTimerDialog, setShowTimerDialog] =
        React.useState<boolean>(false);

    const hitHandler = (v: number) => {
        setTime(v);
    };

    const hideTimerHandler = () => {
        setShowTimerDialog(false);
    };

    const [hitFactor, setHitFactor] = React.useState<number>(0.0);

    const calcHitFactor = React.useCallback(() => {
        if (time == 0) return 0;
        let hf =
            (targetZoneCounter.a * 5 +
                targetZoneCounter.c * 3 +
                targetZoneCounter.d +
                platesHits * 5 -
                (targetZoneCounter.m * 10 +
                    targetZoneCounter.ns * 10 +
                    proErrorCount * 10 +
                    platesMiss * 10)) /
            time;
        if (hf <= 0) return 0;
        return hf;
    }, [targetZoneCounter, proErrorCount, time, platesMiss, platesHits]);

    React.useEffect(() => {
        setHitFactor(calcHitFactor);
    }, [
        platesHits,
        platesMiss,
        paperTargetsData,
        proErrors,
        time,
        platesMiss,
        platesHits,
        calcHitFactor,
    ]);

    React.useEffect(() => {
        let errorObjectList: ProceduralError[] = [];
        ProceduralErrorList.map((obj) => {
            errorObjectList.push(new obj());
        });
        setProErrors(errorObjectList);
    }, [setProErrors]);

    const checkIfAllFieldsAreValid = () => {
        let paperCheck = true;
        paperTargetsData.forEach((data) => {
            if (data.fieldCorrectly == false) {
                paperCheck = false;
            }
        });
        if (!paperCheck) {
            alert("Paper targets did not field correctly");
            return false;
        }
        if (time == 0) {
            alert("The time did not field correctly");
            return false;
        }
        return true;
    };

    const [showReviewDialog, setShowReviewDialog] =
        React.useState<boolean>(false);

    const reviewHandler = () => {
        if (checkIfAllFieldsAreValid()) {
            setShowReviewDialog(true);
        }
    };

    const submitScore = () => {
        if (!checkIfAllFieldsAreValid()) return;
        const proErrorStrList: ProceduralErrorTypes[] = [];
        proErrors.map((err) => {
            if (err.currentCount > 0) {
                for (let i = 0; i < err.currentCount; i++) {
                    proErrorStrList.push(err.title);
                }
            }
        });

        let method = "PUT"
        let apiSite = `https://api.constrmrf.tk/api/stage/${SCORE_ID}/score`
        fetch(
            apiSite,
            {
                method: method,
                headers: [["Content-Type", "application/json"]],
                body: JSON.stringify({
                    alpha: targetZoneCounter.a,
                    charlie: targetZoneCounter.c,
                    delta: targetZoneCounter.d,
                    paperMiss: targetZoneCounter.m,
                    plate: platesHits,
                    plateMiss: platesMiss,
                    noShoot: targetZoneCounter.ns,
                    procedureError: proErrorCount,
                    time: time,
                    disqualified: false,
                    dnf: false,
                    stageID: STAGE_ID,
                    attempted: true,
                    proError: proErrorStrList,
                }),
            }
        )
            .then((res) => res.json())
            .then((respone) => {
                if (respone.status != 400) {
                    alert("Scoring succeeded");
                    router.back();
                } else {
                    alert(
                        "Failed to scoring, please check the field was filled properly"
                    );
                }
            });
    };

    if (stageData == undefined || scoreData == undefined)
        return <h1>Loading...</h1>;

    return (
        <>
            <Dialog
                show={showProceduralErrorDiaglog}
                onHide={() => setShowProceduralErrorDiaglog(false)}
            >
                {proErrors.map((proType, index) => (
                    <div
                        key={index}
                        className={`${styles.procedualErrorListContainer} card`}
                        onClick={() =>
                            showProceduralErrorDiscripition(proType.description)
                        }
                    >
                        <h1
                            className={styles.procedualErrorListTitle}
                            title={proType.description}
                        >
                            {proType.index} {"->"}
                            {proType.title}
                        </h1>
                        <div className={styles.procedualErrorListButtonGroup}>
                            <button
                                onClick={() =>
                                    procedualErrorMinusHandler(index)
                                }
                            >
                                -
                            </button>
                            <h1>{proType.currentCount}</h1>
                            <button
                                onClick={() => procedualErrorAddHandler(index)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </Dialog>
            <Dialog
                show={showProErrorDescriptionDialog}
                onHide={() => setShowProErrorDescriptionDialog(false)}
            >
                {proErrorDescriptionDisplay}
            </Dialog>
            <Dialog show={showTimerDialog} onHide={hideTimerHandler}>
                <TimerPage setTime={hitHandler} />
            </Dialog>
            <Dialog
                show={showReviewDialog}
                onHide={() => setShowReviewDialog(false)}
            >
                {/* 
                    |   |Count|Point
                    |A  |1    |+5
                    |C  |.. .. ..
                    |D  |.. .. ..
                */}
                <div className={styles.reviewDialog}>
                    <p> </p>
                    <p>Count</p>
                    <p>Points</p>
                    <p>A</p>
                    <p>{targetZoneCounter.a}</p>
                    <p>{targetZoneCounter.a * 5}</p>
                    <p>C</p>
                    <p>{targetZoneCounter.c}</p>
                    <p>{targetZoneCounter.c * 3}</p>
                    <p>D</p>
                    <p>{targetZoneCounter.d}</p>
                    <p>{targetZoneCounter.d}</p>
                    <p>Miss</p>
                    <p>{targetZoneCounter.m}</p>
                    <p>{-(targetZoneCounter.m * 10)}</p>
                    <p>No Shoot</p>
                    <p>{targetZoneCounter.ns}</p>
                    <p>{-(targetZoneCounter.ns * 10)}</p>
                    <p>Plates or popper</p>
                    <p>{platesHits}</p>
                    <p>{platesHits * 5}</p>
                    <p>Plates or popper miss</p>
                    <p>{platesMiss}</p>
                    <p>{-(platesMiss * 10)}</p>
                    <p>Rrocedural Error</p>
                    <p>{proErrorCount}</p>
                    <p>{-(proErrorCount * 10)}</p>
                    <p>Score</p>
                    <p style={{ gridColumn: "2 / 4" }}>
                        {targetZoneCounter.a * 5 +
                            targetZoneCounter.c * 3 +
                            targetZoneCounter.d +
                            platesHits * 5 -
                            (targetZoneCounter.m * 10 +
                                targetZoneCounter.ns * 10 +
                                proErrorCount * 10 +
                                platesMiss * 10)}
                    </p>
                    <p>Time</p>
                    <p style={{ gridColumn: "2 / 4" }}>{time}</p>
                    <p>Hit Factor</p>
                    <p style={{ gridColumn: "2 / 4" }}>
                        {hitFactor.toFixed(3)}
                    </p>
                    <div
                        style={{
                            gridColumn: "1 / 4",
                            display: "flex",
                            justifyContent: "space-around",
                        }}
                    >
                        <button
                            style={{ width: "100%" }}
                            className="caution"
                            onClick={() => setShowReviewDialog(false)}
                        >
                            Back
                        </button>
                        <button
                            style={{ width: "100%" }}
                            className="correct"
                            onClick={submitScore}
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </Dialog>
            <div className={styles.pageContainer}>
                <h1 className={styles.title}>
                    You are now scoring {scoreData?.shooter.firstName},{" "}
                    {scoreData?.shooter.lastName} in {stageData?.title}
                </h1>
                <div className={`${styles.scoringContainer} card`}>
                    <div className={styles.scoringRows}>
                        <button
                            style={{
                                fontSize: "xx-large",
                                color: "red",
                                width: "100%",
                            }}
                            onClick={dqHandler}
                        >
                            DQ
                        </button>
                        <button
                            style={{
                                fontSize: "xx-large",
                                color: "red",
                                width: "100%",
                            }}
                            onClick={dnfHandler}
                        >
                            DNF
                        </button>
                    </div>
                    <div className={styles.scoringRows}>
                        <div className={styles.scoringRowsLeft}>Time:</div>
                        <div className={styles.scoringRowsRight}>
                            <button
                                onClick={() => {
                                    setShowTimerDialog(true);
                                }}
                            >
                                {time.toFixed(2)}
                            </button>
                        </div>
                    </div>
                    <div className={styles.scoringRows}>
                        <div className={styles.scoringRowsLeft}>
                            Procedurals errors:
                        </div>
                        <div className={styles.scoringRowsRight}>
                            <button onClick={proceduralErrorHandler}>
                                {proErrorCount}
                            </button>
                        </div>
                    </div>
                    <div className={styles.scoringRows}>
                        <div className={styles.scoringRowsLeft}>
                            Plates or poppers
                        </div>
                        <div className={styles.scoringRowsRight}>
                            <div className={styles.scoringButtonGroup}>
                                <p>Hit</p>
                                <button onClick={platesHitHandler}>
                                    {platesHits}
                                </button>
                            </div>
                            <div className={styles.scoringButtonGroup}>
                                Miss
                                <button onClick={platesMissHandler}>
                                    {platesMiss}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.scoringRows}>Paper targets:</div>
                    <div className={styles.scoringRows}>
                        <div
                            className={`${styles.paperTargetScoringContainer} card`}
                        >
                            <div className={styles.paperTargetScoringRow}>
                                <span>T#</span>
                                <span>A</span>
                                <span>C</span>
                                <span>D</span>
                                <span>M</span>
                                <span>NS</span>
                            </div>
                            {paperTargetsData.map((data, index) => {
                                return (
                                    <PaperTargetScoringRow
                                        key={index}
                                        targetIndex={index}
                                        a={data.a}
                                        c={data.c}
                                        d={data.d}
                                        m={data.m}
                                        ns={data.ns}
                                        fieldCorrectly={data.fieldCorrectly}
                                        setA={paperTargetAZoneHandler}
                                        setC={paperTargetCZoneHandler}
                                        setD={paperTargetDZoneHandler}
                                        setM={paperTargetMZoneHandler}
                                        setNS={paperTargetNSZoneHandler}
                                        setFieldCorrectly={
                                            paperTargetFieldHandler
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.scorePreivew}>
                        <p>{targetZoneCounter.a}A </p>
                        <p>{targetZoneCounter.c}C </p>
                        <p>{targetZoneCounter.d}D </p>
                        <p>{targetZoneCounter.m}M </p>
                        <p>{targetZoneCounter.ns}NS </p>
                        <p>{platesHits}PP</p>
                        <p>{platesMiss}PPM</p>
                        <p>{proErrorCount}PRO</p>
                        <p>{hitFactor.toFixed(3)}HF</p>
                    </div>
                    <button
                        style={{
                            fontSize: "xx-large",
                        }}
                        onClick={reviewHandler}
                    >
                        Review
                    </button>
                </div>
            </div>
        </>
    );
}
