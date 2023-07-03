import { Division } from "@/types";

export type GetAllShooterDTO = ShooterDTO[];
export interface ShooterDTO {
    id: number;
    firstName: string;
    lastName: string;
    division: Division;
    createAt: Date;
    profile: ProfileDTO;
    history: HistoryDTO[];
}

export interface ProfileDTO {
    id: number;
    firstName: string;
    lastName: string;
    stageHaveFinish: number;
    averageHitFactor: number;
}
export interface HistoryDTO {
    id: number;
    alphaCount: number;
    charlieCount: number;
    deltaCount: number;
    paperMissCount: number;
    plateCount: number;
    plateMissCount: number;
    noShootCount: number;
    procedureErrorCount: number;
    scoreCount: number;
    timeCount: number;
    hitFactor: number;
    disqualified: boolean;
    didNotFinished: boolean;
}
