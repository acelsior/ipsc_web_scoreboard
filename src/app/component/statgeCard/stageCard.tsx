"use client";
import { StageDTO } from "@/app/dtos/stage.dto";
import styles from "./stageCard.module.css";

export interface IStageCardProps extends StageDTO {
    hideDeleteButton?: boolean;
    hideDetailsButton?: boolean;
    children?: React.ReactNode;
}

export default function StageCard(props: IStageCardProps) {
    const deleteStageHandler = () => {
        const confirmRes = confirm(`Confirm delete stage "${props.title}"`);
        if (confirmRes) {
            fetch(`https://api.constrmrf.tk/api/stage/${props.id}`, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.affected >= 1) {
                        alert("Deleted successfully");
                    } else {
                        alert("Deletion failed!!!!");
                    }
                });
        }
    };

    const detailStageHandler = () => {};

    return (
        <div className={styles.stageCardContainer}>
            <img
                className={styles.stageImg}
                alt={props.title}
                src={`https://api.constrmrf.tk/api/image/${props.images[0].id}`}
            />
            <div className={styles.rightButtonGroup}>
                {props.hideDetailsButton ? (
                    <></>
                ) : (
                    <button onClick={detailStageHandler}>Details</button>
                )}
                {props.hideDeleteButton ? (
                    <></>
                ) : (
                    <button
                        style={{
                            color: "red",
                            fontWeight: "bold",
                        }}
                        onClick={deleteStageHandler}
                    >
                        Delete
                    </button>
                )}
                {props.children}
            </div>
            <div className={styles.stageCardTextContainer}>
                <div
                    className={styles.stageCardTextRow}
                    style={{
                        gridRow: 1,
                        fontSize: "large",
                    }}
                >
                    <h1>{props.title}</h1>
                </div>
                <div
                    className={styles.stageCardTextRow}
                    style={{
                        gridRow: 2,
                    }}
                >
                    <p>{props.description}</p>
                </div>
                <div
                    className={styles.stageCardTextRow}
                    style={{
                        gridRow: 3,
                    }}
                >
                    <p>
                        {props.stageType} Stage, Min rounds: {props.minRounds}
                        +1, Max scores: {props.maxScores}
                    </p>
                </div>
            </div>
        </div>
    );
}
