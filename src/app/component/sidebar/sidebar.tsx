import { Inter } from 'next/font/google'
import styles from './sidebar.module.css'
import Link from 'next/link';


const inter = Inter({ subsets: ['latin'] })

export default function SideBar({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className={styles.contentGrid}>
                    <div className={styles.sideBarBox}>
                        <h1>IPSC Scoreboard</h1>
                        <br/>
                        <Link className={styles.card} href="/pages/home">Home</Link>
                        <Link className={styles.card} href="/pages/stage">Stage</Link>
                        <Link className={styles.card} href="/pages/shooter">Shooter</Link>
                        <Link className={styles.card} href="/pages/scoreboard">Scoreboard</Link>
                        <Link className={styles.card} href="/pages/timer">Timer</Link>
                    </div>
                    <div className={styles.contentBox}>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}