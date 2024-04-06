import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

// Load the Work Sans font with specific subsets and weights
const workSans = Work_Sans({
    subsets: ["latin"],
    variable: "--font-work-sans",
    weight: ["400", "600", "700"],
});

// Define metadata for the application
export const metadata: Metadata = {
    title: "Figma Clone",
    description: "A minimalist Figma clone using Fabric.js, Shadcn UI, and Liveblocks for real-time collaboration",
};

// Root layout component for the application
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${workSans.className} bg-primary-grey-200`}>
                <Room>
                    {children}
                </Room>
            </body>
        </html>
    );
}
