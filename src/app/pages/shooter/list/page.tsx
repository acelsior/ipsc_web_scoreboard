"use client";
import ShooterCard from "@/app/component/shooterCard/shooterCard";
import { GetAllShooterDTO } from "@/app/dtos/shooter.dto";
import React from "react";
import useSWR from "swr";

const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((res) => res.json());

export default function ShooterList() {
    const { data, error } = useSWR<GetAllShooterDTO>(
        "https://api.constrmrf.tk/api/shooter",
        fetcher
    );


    return (
        <div>
            <div>
                {data?.map((shooter) => (
                    <ShooterCard
                        division={shooter.division}
                        firstName={shooter.firstName}
                        id={shooter.id}
                        lastName={shooter.lastName}
                        key={shooter.id}
                    />
                ))}
            </div>
        </div>
    );
}
