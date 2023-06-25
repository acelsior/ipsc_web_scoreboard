import styles from "./page.module.css";

export default function CreateStage() {
    return (
        <div>
            <form className={styles.formContainer}>
                <label className={styles.inputContainer}>
                    Title:
                    <input type="text" name="title" />
                </label>
                <label className={styles.inputContainer}>
                    Description:
                    <textarea
                        name="description"
                        rows={3}
                        style={{
                            resize: "none",
                        }}
                    />
                </label>
                <label className={styles.inputContainer}>
                    Paper targets:
                    <input type="number" name="papers" />
                </label>
                <label className={styles.inputContainer}>
                    No shoot:
                    <input type="number" name="noShoots" />
                </label>
                <label className={styles.inputContainer}>
                    Plate targets:
                    <input type="number" name="plates" />
                </label>
                <label className={styles.inputContainer}>
                    Condition:
                    <select className={styles.input} name="condition">
                        <option value="1">Condition 1, Gun empty, Chamber empty</option>
                        <option value="2">Condition 2, Gun load, Chamber empty</option>
                        <option value="3">Condition 3, Gun load, Chamber load</option>
                    </select>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
