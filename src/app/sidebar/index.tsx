import { Inter } from 'next/font/google'
import styles from './sidebar.module.css'


const inter = Inter({ subsets: ['latin'] })

export default function SideBar({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en">
            <div>

            </div>
            <body className={inter.className}>{children}</body>
        </html>
    )
}