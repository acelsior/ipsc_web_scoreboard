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
                <Link href="pages/shooter/list" className={styles.card}>Shooter List</Link>
                <Link href="pages/shooter/create" className={styles.card}>New Shooter</Link>
            </nav>
            <div className={styles.contentBox}>
                {children}
            </div>
        </section>
    );
}