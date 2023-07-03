import { Condition } from "@/types";
import { HistoryDTO, ShooterDTO } from "./shooter.dto";

export interface GetImageDTO {
    id: number;
    filename: string;
    path: string;
    mimetype: string;
}
export type GetImagesDTO = GetImageDTO[]

export interface StageDTO {
    id: number;
    title: string;
    description: string;
    images: GetImagesDTO;
    condition: Condition;
    stageType: string;
    maxScores: number;
    paperTargets: number;
    poppersOrPlates: number;
    noShoots: number;
    minRounds: number;
    history: HistoryDTO[];
}

export interface StageScoreDTO {
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
    shooter: ShooterDTO;
    attempted: boolean;
}
