"use client";
import { GetStageDTO } from "@/app/dtos/stage.dto";
import styles from "./stageCard.module.css";

export default function StageCard(props: GetStageDTO) {

    const deleteStageHandler = () => {
        const confirmRes = confirm(`Confirm delete stage "${props.title}"`)
        if (confirmRes) {
            fetch(`https://constrmrf.tk/api/stage/${props.id}`, {
                method: 'DELETE'
            }).then(res => res.json()).then(res => {
                if (res.affected >= 1) {
                    alert('Deleted successfully');
                } else {
                    alert('Deletion failed!!!!');
                }
            })
        }
    }

    const detailStageHandler = () => {
    }

    return (
        <div className={styles.stageCardContainer}>
            <img
                className={styles.stageImg}
                alt={props.title}
                src={props.photo}
            />
            <div className={styles.rightButtonGroup}>
                <button
                    onClick={detailStageHandler}
                >
                    Details
                </button>
                <button
                    style={{
                        color: "red",
                        fontWeight: "bold",
                    }}
                    onClick={deleteStageHandler}
                >
                    Delete
                </button>
            </div>
            <div className={styles.stageCardTextContainer}>
                <div
                    className={styles.stageCardTextRow}
                    style={{
                        gridRow: 1,
                        fontSize: "large"
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
                        {props.stageType} Stage, Min rounds: {props.minRounds},
                        Max rounds: {props.maxScores}
                    </p>
                </div>
            </div>
        </div>
    );
}
