"use client"
import { useRouter } from 'next/navigation';

export default function StagePage() {
    const router = useRouter();
    router.push("pages/stage/list");
    return (
        <div>
            
        </div>
    )
}