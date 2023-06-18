"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

export default function StagePage() {
    const router = useRouter();
    React.useEffect(() => router.push("pages/stage/list"));
    return (
        <div>
            
        </div>
    )
}