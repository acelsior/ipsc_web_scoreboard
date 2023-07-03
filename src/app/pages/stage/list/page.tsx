"use client";

import useSWR from "swr";
import styles from "./page.module.css";
import { StageDTO } from "@/app/dtos/stage.dto";
import StageCard from "@/app/component/statgeCard/stageCard";

const getFetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((res) => res.json());

export default function StageList() {
    const { data, error } = useSWR<StageDTO[]>(
        "https://api.constrmrf.tk/api/stage",
        getFetcher
    );
    return (
        <main className={styles.main}>
            {data ? (
                <div className={styles.contentBox}>
                    {data?.map((stage) => (
                        <StageCard {...stage} key={stage.id} />
                    ))}
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </main>
    );
}
