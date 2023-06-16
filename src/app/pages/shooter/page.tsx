"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ShooterPage() {
    const router = useRouter();
    React.useEffect(() => router.push("pages/shooter/list"))
    return (
        <div>
            
        </div>
    )
}