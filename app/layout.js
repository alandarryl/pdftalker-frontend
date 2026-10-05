// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "PDF Talker - Discutez avec vos documents",
  description: "Analysez et posez vos questions à vos fichiers PDF via IA local ou Cloud.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-blue-500 selection:text-white">
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}