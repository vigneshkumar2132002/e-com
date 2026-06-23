import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "../components/AppLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bapuji Surgicals | Trusted Medical & Surgical Supplies",
  description: "Bapuji Surgicals is a leading manufacturer of high-quality hospital-grade wound dressings, clinical cotton rolls, sterile surgical apparel, and private label wet wipes since 1980.",
  keywords: ["medical supplies", "wound dressings", "surgical apparel", "clinical cotton rolls", "private label wet wipes", "Bapuji Surgicals"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
