import { JSXElementConstructor } from "react";
import styles from "./dialog.module.css"

export interface IDialogProps extends React.PropsWithChildren {
    onHide: () => void;
    show: boolean;
}

export default function Dialog(props: IDialogProps) {


    return (
        <div className={`${styles.dialogContainer} ${props.show ? styles.show : styles.hide}`}>
            <div onClick={props.onHide} style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
            }} />
            <div className={styles.popupsContainer}>
                {props.children}
            </div>
        </div>
    )
}