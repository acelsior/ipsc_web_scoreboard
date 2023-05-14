"use client"
import { useRouter } from 'next/navigation';
import styles from "./layout.module.css"
import Link from 'next/link';
//redirect to list 
export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
    return (
        <section>
            {/* Include shared UI here e.g. a header or sidebar */}
            <nav className={styles.navBar}>
                <Link href="pages/stage/list" className={styles.card}>Stage List</Link>
                <Link href="pages/stage/create" className={styles.card}>Create Stage</Link>
            </nav>
            <div className={styles.contentBox}>
                {children}
            </div>
        </section>
    );
}