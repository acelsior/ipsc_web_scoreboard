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
