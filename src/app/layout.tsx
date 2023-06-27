export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'edge'
export const preferredRegion = 'auto'

import "./globals.css";
import SideBar from "./component/sidebar/sidebar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SideBar>{children}</SideBar>
            </body>
        </html>
    );
}
