import { ScoringMethod } from "@/types";

export interface GetStageDTO {
    id: number;
    title: string;
    description: string;
    photo: string;
    scoringMethod: ScoringMethod;
    stageType: string;
    maxScores: number;
    paperTargets: number;
    poppersOrPlates: number;
    noShoots: number;
    minRounds: number;
}
