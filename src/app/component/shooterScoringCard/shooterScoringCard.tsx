import { ShooterDTO } from "@/app/dtos/shooter.dto";
import styles from "./shooterScoringCard.module.css";
import { StageDTO, StageScoreDTO } from "@/app/dtos/stage.dto";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface IShootingScoringCard {
    shooter: ShooterDTO;
    stage: StageDTO;
    score: StageScoreDTO;
}

export default function ShooterScoringCard(props: IShootingScoringCard) {
    const router = useRouter();

    const enterScoreHandler = () => {
        router.push(
            `pages/scoreboard/stage/${props.stage.id}/enterScore/${props.score.id}`,
        );
    };
    const deleteScoreHandler = () => {
        if (confirm(`Are you sure you want to delete this score?`)) {
            fetch(
                `https://api.constrmrf.tk/api/stage/${props.score.id}/score`,
                {
                    method: "DELETE",
                }
            ).then((response) => {
                if (response.status == 200) {
                    alert("Success to delete score record");
                }
            });
        }
    };

    return (
        <div className={`${styles.shooterScoringCardContainer} card`}>
            <div className={styles.nameContainer}>
                <p>
                    {props.shooter.firstName}, {props.shooter.lastName}
                </p>
            </div>
            <div className={styles.scoreContainer}>
                {props.score.attempted ? (
                    props.score.didNotFinished || props.score.disqualified ? (
                        <p
                            style={{
                                fontSize: "xx-large",
                                fontWeight: "bolder",
                                color: "rgba(var(--caution-color),1)",
                                border: "none",
                                padding: "0",
                            }}
                        >
                            {props.score.didNotFinished ? "DNF" : "DQ"}
                        </p>
                    ) : (
                        <>
                            <p>{props.score.alphaCount}A</p>
                            <p>{props.score.charlieCount}C</p>
                            <p>{props.score.deltaCount}D</p>
                            <p>{props.score.paperMissCount}M</p>
                            <p>{props.score.noShootCount}NS</p>
                            <p>{props.score.plateCount}PP</p>
                            <p>{props.score.plateMissCount}PPM</p>
                            <p>{props.score.procedureErrorCount}PRO</p>
                            <p>Time: {props.score.timeCount}</p>
                            <p>HF: {props.score.hitFactor.toFixed(3)}</p>
                        </>
                    )
                ) : (
                    <p
                        style={{
                            fontSize: "xx-large",
                            fontWeight: "bolder",
                            border: "none",
                            padding: "0",
                        }}
                    >
                        Haven't shoot yet
                    </p>
                )}
            </div>
            <div className={styles.rightButtonGroup}>
                <button onClick={enterScoreHandler}>Scoring</button>
                <button
                    style={{
                        color: "red",
                        fontWeight: "bold",
                    }}
                    onClick={deleteScoreHandler}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
