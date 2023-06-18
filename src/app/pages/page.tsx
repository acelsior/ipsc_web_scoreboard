"use client"
import { useRouter } from 'next/navigation';
import React from "react";

//redirect to the real home page
export default function HomePage() {
    const router = useRouter();
    React.useEffect(() => router.push("pages/home"));

    return (
        <div>
            
        </div>
    )
}