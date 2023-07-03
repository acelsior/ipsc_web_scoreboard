// export const dynamic = 'auto'
// export const dynamicParams = true
// export const revalidate = false
// export const fetchCache = 'auto'
// export const runtime = 'edge'
// export const preferredRegion = 'auto'
"use client";

import StageCard from "@/app/component/statgeCard/stageCard";
import { StageDTO } from "@/app/dtos/stage.dto";
import { useRouter } from "next/navigation";
import useSWR from "swr";


const getFetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((res) => res.json());

export default function ScoreboardPage() {
    const { data: stageListData, error } = useSWR<StageDTO[]>(
        `https://api.constrmrf.tk/api/stage/`,
        getFetcher
    );
    const router = useRouter();

    const socreStageHandler = (stageId: number) => {
        router.push(`pages/scoreboard/stage/${stageId}`)
    };

    return (
        <div>
            {stageListData?.map((stage, index) => (
                <div key={index}>
                    <StageCard
                        {...stage}
                        hideDeleteButton={true}
                        hideDetailsButton={true}
                    >
                        <button
                            style={{ height: "100%", fontSize: "large" }}
                            onClick={() => socreStageHandler(stage.id)}
                        >
                            Score
                        </button>
                    </StageCard>
                </div>
            ))}
        </div>
    );
}
