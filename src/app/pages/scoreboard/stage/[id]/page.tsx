// export const dynamic = "auto";
// export const dynamicParams = true;
// export const revalidate = false;
// export const fetchCache = "auto";
// export const runtime = "edge";
// export const preferredRegion = "auto";
"use client";

import StageCard from "@/app/component/statgeCard/stageCard";
import styles from "./page.module.css";
import { StageDTO, StageScoreDTO } from "@/app/dtos/stage.dto";
import useSWR from "swr";
import ShooterScoringCard from "@/app/component/shooterScoringCard/shooterScoringCard";
import Dialog from "@/app/component/dialog/dialog";
import React from "react";
import { GetAllShooterDTO, ShooterDTO } from "@/app/dtos/shooter.dto";

const getFetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((res) => res.json());

export default function StageScoringPage(props: { params: { id: string } }) {
    const stageID = parseInt(props.params.id);

    const [stageDataInited, setStageDataInited] = React.useState(false);
    const [scoreDataInited, setScoreDataInited] = React.useState(false);

    const [dialogShown, setDialogShown] = React.useState<boolean>(false);
    const [selectPreAddShooterID, setSelectPreAddShooterID] =
        React.useState<number>(0);

    const { data: stageData, error: stageDataError } = useSWR<StageDTO>(
        `https://api.constrmrf.tk/api/stage/${stageID}`,
        getFetcher,
        {
            onSuccess: (data, key) => {
                if (stageDataInited) return;
                let shooterList = [];

                setStageDataInited(true);
            },
        }
    );

    const { data: stageScoreData, error: stageScoreDataError } = useSWR<
        StageScoreDTO[]
    >(`https://api.constrmrf.tk/api/stage/${stageID}/score`, getFetcher, {
        onSuccess: (data, key) => {
            let shooterList: ShooterDTO[] = [];
            data.map((score) => {
                shooterList.push(score.shooter);
            });
            setScoreDataInited(true);
        },
        refreshInterval: 1000,
    });

    const { data: shooterList, error: shooterListDataError } =
        useSWR<GetAllShooterDTO>(
            `https://api.constrmrf.tk/api/shooter?id&firstName&lastName`,
            getFetcher
        );

    const addShooterIdChangeHandler = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectPreAddShooterID(parseInt(event.target.value));
    };

    const addShooterHandler = () => {
        setDialogShown(true);
    };
    const hideDialog = () => {
        setDialogShown(false);
    };

    const addShooterComfirmButtonHandler = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (selectPreAddShooterID == 0) return;

        fetch(`https://api.constrmrf.tk/api/shooter/${selectPreAddShooterID}`, {
            method: "GET",
            redirect: "follow",
        })
            .then((response) => response.json())
            .then((result: ShooterDTO) => {
                fetch(
                    `https://api.constrmrf.tk/api/shooter/${selectPreAddShooterID}/stage`,
                    {
                        method: "POST",
                        headers: [
                            ["Content-Type", "application/json"]
                        ],
                        body: JSON.stringify({
                            alpha: 0,
                            charlie: 0,
                            delta: 0,
                            plate: 0,
                            paperMiss: 0,
                            plateMiss: 0,
                            noShoot: 0,
                            procedureError: 0,
                            time: 0,
                            disqualified: false,
                            dnf: true,
                            stageID: props.params.id,
                            attempted: false,
                        }),
                    }
                );
            });
    };

    if (stageScoreData == undefined) return;

    return (
        <div className={styles.scoreboardPageContainer}>
            {stageData ? (
                <StageCard
                    hideDeleteButton={true}
                    hideDetailsButton={true}
                    {...stageData}
                />
            ) : (
                <h1>Loading...</h1>
            )}

            <div className={styles.scoreboardShooterListContianer}>
                Shooters list:
                {stageScoreData.map((score, index) =>
                    stageData ? (
                        <ShooterScoringCard
                            stage={stageData}
                            shooter={score.shooter}
                            key={index}
                            score={score}
                        />
                    ) : (
                        <h1 key={index}>Loading...</h1>
                    )
                )}
                <button onClick={addShooterHandler}>Add Shooter</button>
            </div>
            <Dialog onHide={hideDialog} show={dialogShown}>
                {shooterList ? (
                    <>
                        <select
                            value={selectPreAddShooterID}
                            onChange={addShooterIdChangeHandler}
                        >
                            <option value={0}></option>
                            {shooterList.map((shooter) => (
                                <option key={shooter.id} value={shooter.id}>
                                    {shooter.firstName}, {shooter.lastName}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <h1>Loading</h1>
                )}
                <button onClick={addShooterComfirmButtonHandler}>
                    Comfirm
                </button>
            </Dialog>
        </div>
    );
}
