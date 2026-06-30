import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YUNN | Skin Analysis",
  description: "Personalized K-Beauty skin routine in 3 minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full bg-white">
        {children}
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
