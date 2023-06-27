"use client";

import React, { FormEvent } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function CreateShooter() {
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [division, setDivison] = React.useState<string>("");
    const router = useRouter();

    function handleFirstNameChange(event: FormEvent<HTMLInputElement>) {
        setFirstName(event.currentTarget.value);
    }
    function handleLastNameChange(event: FormEvent<HTMLInputElement>) {
        setLastName(event.currentTarget.value);
    }
    function handleDivisionChange(event: FormEvent<HTMLSelectElement>) {
        setDivison(event.currentTarget.value);
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        fetch(`https://constrmrf.tk/api/shooter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                division: division,
            }),
        }).then((res) =>
            res.json().then((json) => {
                if (json.status != 400) {
                    console.log("Success create shooter");
                    alert("Create shooter succeeded");
                    router.replace("/pages/shooter/list");
                } else {
                    alert(
                        "Failed to create a shooter, please check the field was filled properly"
                    );
                }
            })
        );
    }

    return (
        <div className={styles.formBox}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <div className={styles.inputContainer}>
                        <span className={styles.inputText}>First name:</span>{" "}
                        <input
                            onChange={handleFirstNameChange}
                            value={firstName}
                            className={styles.input}
                            type="text"
                            name="firstName"
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <span className={styles.inputText}>Last name:</span>{" "}
                        <input
                            onChange={handleLastNameChange}
                            value={lastName}
                            className={styles.input}
                            type="text"
                            name="lastName"
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.inputContainer}>
                        <span className={styles.inputText}>Division:</span>
                        <select
                            onChange={handleDivisionChange}
                            value={division}
                            className={styles.input}
                            name="division"
                        >
                            <option value=""></option>
                            <option value="Open">Open</option>
                            <option value="Production">Production</option>
                            <option value="Standard">Standard</option>
                            <option value="Classic">Classic</option>
                        </select>
                    </div>
                </div>
                <div className={styles.formRow}>
                    <input
                        className={styles.inputButton}
                        type="submit"
                        value="Submit"
                    />
                </div>
            </form>
        </div>
    );
}
