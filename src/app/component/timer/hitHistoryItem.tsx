import styles from "./hitHistoryItem.module.css";
export interface IHitHistoryItem {
    hitTime: number;
    shotsNumber: number;
    splitTime: number;
}

export default function HitHistoryItem(props: IHitHistoryItem) {
    return (
        <div className={styles.hitText}>
            <p>{props.shotsNumber}</p>
            <p>{props.hitTime.toFixed(2)}</p>
            <p>{props.splitTime.toFixed(2)}</p>
        </div>
    );
}
