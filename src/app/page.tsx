"use client"
import { useRouter } from 'next/navigation';

//redirect to the real home page
export default function IndexHomePage() {
    const router = useRouter();
    router.push("pages/home");
    return (
        <div>
            
        </div>
    )
}