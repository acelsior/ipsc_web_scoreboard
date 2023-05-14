"use client"
import { useRouter } from 'next/navigation';

export default function ShooterPage() {
    const router = useRouter();
    router.push("pages/shooter/list");
    return (
        <div>
            
        </div>
    )
}