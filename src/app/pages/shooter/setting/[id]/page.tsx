"use client";

import React, { FormEvent } from "react";
import styles from "./page.module.css";
import { ShooterDTO } from "@/app/dtos/shooter.dto";
import { useRouter } from "next/navigation";

export default function ShooterSetttingPage(props: { params: { id: any } }) {
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [division, setDivison] = React.useState<string>("");
    const [hasInited, setHasInited] = React.useState<boolean>(false);
    const router = useRouter();

    React.useEffect(() => {
        if (hasInited) return;
        fetch(`https://constrmrf.tk/api/shooter/${props.params.id}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((response: ShooterDTO) => {
                setFirstName(response.firstName);
                setLastName(response.lastName);
                setDivison(response.division);
                setHasInited(true);
            });
    });

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
        console.log(
            JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                division: division,
            })
        );
        fetch(`https://constrmrf.tk/api/shooter/${props.params.id}`, {
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                division: division,
            }),
        }).then((response) => {
            if (response.status === 200) {
                alert("Change susses");
                router.back();
            } else {
                alert("Error");
            }
        });
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
