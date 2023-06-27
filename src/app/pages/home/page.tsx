export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'edge'
export const preferredRegion = 'auto'

import styles from './page.module.css'

export default function HomePage() {
    return (
        <main>
            <div className={styles.description}>
                HomePage
            </div>
        </main>
    )
}
