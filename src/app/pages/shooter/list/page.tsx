import ShooterCard from "@/app/component/shooterCard/shooterCard";
import { GetAllShooterDTO } from "@/app/dtos/shooter.dto";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

export const getServerSideProps = async (): Promise<GetAllShooterDTO> => {
    const res = await fetch(`https://constrmrf.tk/api/shooter`, {
        method: "GET",
        next: {
            revalidate: 1,
        },
    });

    return res.json();
};

export default async function ShooterList() {
    const res = await getServerSideProps();


    var displayShooterList: ReactNode[] = [];

    res.forEach((shooter) => {
        displayShooterList.push(
            <ShooterCard
                firstName={shooter.firstName}
                lastName={shooter.lastName}
                division={shooter.division}
                id={shooter.id}
                key={shooter.id}
            />
        );
    });

    return (
        <div>
            <div>{displayShooterList}</div>
        </div>
    );
}
