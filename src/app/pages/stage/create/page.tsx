"use client";
import { Condition, StageType } from "@/types";
import styles from "./page.module.css";
import React, { FormEvent } from "react";
import { ImagesDTO } from "@/app/dtos/image.dto";
import { useRouter } from "next/navigation";


export default function CreateStage() {
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [photos, setPhotos] = React.useState<FormData>(); //base64 encoded
    const [papers, setPapers] = React.useState<number>(0);
    const [noShoots, setNoShoots] = React.useState<number>(0);
    const [plates, setPlates] = React.useState<number>(0);
    const [condition, setCondition] = React.useState<Condition>(1);

    const [minRounds, setMinRounds] = React.useState<number>(0);
    const [maxScores, setMaxScores] = React.useState<number>(0);
    const [stageType, setStageType] = React.useState<StageType>("Short");

    const router = useRouter();

    const titleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const descriptionChangeHandler = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };
    const photosChangeHandler = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const FILES_LENGTH = e.target.files?.length || 0;
        const FILES = (e.target?.files as FileList)
        var formdata = new FormData();
        for (let i = 0; i < FILES_LENGTH; i++) {
            formdata.append("", FILES[i] , FILES[i].name);
        }
        setPhotos(formdata);
    };
    const papersChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPapers(parseInt(e.target.value) || 0);
    };
    const noShootsChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoShoots(parseInt(e.target.value) || 0);
    };
    const platesChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlates(parseInt(e.target.value) || 0);
    };
    const conditionChangeHandler = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setCondition((parseInt(e.target.value) || 1) as Condition);
    };
    React.useEffect(() => {
        setMinRounds((papers * 2) + (plates));
        setMaxScores((papers * 2 * 5) + (plates * 5));
        if (minRounds <= 12) {
            setStageType("Short")
        } else if (minRounds <= 24) {
            setStageType("Medium")
        } else if (minRounds <= 32){
            setStageType("Long")
        } else {
            setStageType("Special")
        }
    }, [papers, plates, minRounds])
    const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const imageCb: ImagesDTO = await (await fetch("https://constrmrf.tk/api/image", {
            method: "POST", 
            body: photos,
        })).json()
        let imageIDList: number[] = []
        imageCb.forEach(image => {
            imageIDList.push(image.id)
        })

        fetch("https://constrmrf.tk/api/stage/", {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({
                title: title,
                description: description,
                stageType: stageType, // TODO
                maxScores: maxScores,
                paperTargets: papers,
                poppersOrPlates: plates,
                noShoots: noShoots,
                minRounds: minRounds,
                condition: condition,
                photo: imageIDList,
            }),
        }).then(res => res.json()).then(res => {
            if ((res.response?.statusCode || 0) == 400) {
                alert("Please check if all fields are filled in correctly")
            } else {
                alert("Created successfully")
                router.replace("/pages/stage/list");
            }
        });
    };

    return (
        <div>
            <form className={styles.formContainer} onSubmit={submitHandler} >
                <label className={styles.inputContainer}>
                    Title:
                    <input
                        type="text"
                        name="title"
                        onChange={titleChangeHandler}
                        value={title}
                    />
                </label>
                <label className={styles.inputContainer}>
                    Description:
                    <textarea
                        name="description"
                        rows={3}
                        style={{
                            resize: "none",
                        }}
                        onChange={descriptionChangeHandler}
                        value={description}
                    />
                </label>
                <label className={styles.inputContainer}>
                    Picture:
                    <input
                        type="file"
                        accept="image/*"
                        multiple={true}
                        onChange={photosChangeHandler}
                    />
                </label>
                <label className={styles.inputContainer}>
                    Paper targets:
                    <input
                        type="number"
                        name="papers"
                        onChange={papersChangeHandler}
                        value={papers}
                    />
                </label>
                <label className={styles.inputContainer}>
                    No shoot:
                    <input
                        type="number"
                        name="noShoots"
                        onChange={noShootsChangeHandler}
                        value={noShoots}
                    />
                </label>
                <label className={styles.inputContainer}>
                    Plate targets:
                    <input
                        type="number"
                        name="plates"
                        onChange={platesChangeHandler}
                        value={plates}
                    />
                </label>
                <label className={styles.inputContainer}>
                    Condition:
                    <select
                        className={styles.input}
                        name="condition"
                        onChange={conditionChangeHandler}
                        value={condition}
                    >
                        <option value={1}>
                            Condition 1, Gun empty, Chamber empty
                        </option>
                        <option value={2}>
                            Condition 2, Gun load, Chamber empty
                        </option>
                        <option value={3}>
                            Condition 3, Gun load, Chamber load
                        </option>
                    </select>
                </label>
                <div className={styles.stageInfoContainer}>
                    <p>Stage type: {stageType}</p>
                    <p>Minimum Rounds: {minRounds}+1</p>
                    <p>Maximum Scores: {maxScores}</p>
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
