"use client";
import { Division } from "@/types";
import styles from "./shooterCard.module.css";
import { useRouter } from "next/navigation";

export interface IShooterCardProps {
    firstName: string;
    lastName: string;
    division: Division;
    id: number;
}

export default function ShooterCard(props: IShooterCardProps) {
    const router = useRouter();

    function deleteShooterHandler() {
        if (
            confirm(
                `Comfirm delete shooter ${props.firstName} ${props.lastName} ?`
            )
        ) {
            fetch(`https://constrmrf.tk/api/shooter/${props.id}`, {
                method: "DELETE",
            });
        }
    }
    function statisHandler() {
        router.push(`/pages/shooter/statis/${props.id}`);
    }
    function settingHandler() {
        router.push(`/pages/shooter/setting/${props.id}`)
    }

    return (
        <div className={styles.shooterCardContainer}>
            <div className={styles.leftContianer}>
                <div>
                    <h1>
                        {props.firstName} ,{props.lastName}
                    </h1>
                </div>
                <div>
                    <p>{props.division}</p>
                </div>
            </div>
            <div className={styles.rightContianer}>
                <button onClick={settingHandler}>Setting</button>
                <button onClick={statisHandler}>Statistics</button>
                <button
                    style={{
                        color: "red",
                        fontWeight: 900,
                    }}
                    onClick={deleteShooterHandler}
                >
                    DELETE
                </button>
            </div>
        </div>
    );
}
