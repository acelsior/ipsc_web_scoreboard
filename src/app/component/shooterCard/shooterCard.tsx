"use client"
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
    function deleteShooterHandler() {
        fetch(`https://constrmrf.tk/shooter/${props.id}`, {
            method: "DELETE"
        });
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
                <button
                    style={{
                        color: "red",
                        fontWeight: 900,
                    }}
                    onClick={deleteShooterHandler}
                >
                    DELETE
                </button>
                <button>Setting</button>
            </div>
        </div>
    );
}
