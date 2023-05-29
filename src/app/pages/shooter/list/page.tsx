import ShooterCard from "@/app/component/shooterCard/shooterCard";
import { GetAllShooterDTO } from "@/app/dtos/shooter.dto";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import React, { ReactNode } from "react";

export const getData = async (): Promise<GetAllShooterDTO> => {
    const res = await fetch("http://127.0.0.1:3001/shooter", {
        method: "GET",
    });

    return res.json();
};

export default async function ShooterList() {
    const res = await getData();

    var displayShooterList: ReactNode[] = [];

    res.forEach((shooter) => {
        displayShooterList.push(<ShooterCard />);
    });

    return (
        <div>
            <div>{displayShooterList}</div>
        </div>
    );
}
