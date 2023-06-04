import { Division } from "@/types";

export type GetAllShooterDTO = ShooterDTO[]
export interface ShooterDTO {
    id:        number;
    firstName: string;
    lastName:  string;
    division:  Division;
    createAt:  Date;
    profile:   ProfileDTO;
    history:   HistoryDTO[];
}

export interface ProfileDTO {
    id:               number;
    firstName:        string;
    lastName:         string;
    stageHaveFinish:  number;
    averageHitFactor: number;
}

export interface HistoryDTO {
    id:                  number;
    firstName:           string;
    lastName:            string;
    alphaCount:          number;
    charlieCount:        number;
    deltaCount:          number;
    plateCount:          number;
    missCount:           number;
    noShootCount:        number;
    procedureErrorCount: number;
    scoreCount:          number;
    timeCount:           number;
    hitFactor:           number;
    disqualified:        boolean;
}