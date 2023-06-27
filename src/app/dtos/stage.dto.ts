import { Condition } from "@/types";

export interface GetImageDTO {
    id: number;
    filename: string;
    path: string;
    mimetype: string;
}
export type GetImagesDTO = GetImageDTO[]

export interface GetStageDTO {
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
}
