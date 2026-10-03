import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Karnataka Hackathon Community & Discovery Portal",
  description:
    "Discover Hackathons, Communities, Colleges, Universities and Technology Opportunities Across Karnataka. The state digital middle layer connecting students, organizers, and technology companies.",
  keywords: [
    "Karnataka Hackathons",
    "Bangalore Hackathons",
    "Bengaluru Tech Events",
    "Mysuru Hackathon",
    "NITK Surathkal HackVerse",
    "RVCE 8th Mile",
    "VTU Belagavi Innovation",
    "Karnataka Digital Economy Mission",
    "Student Developer Communities",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased text-neutral-900 dark:text-neutral-100 bg-neutral-50/50 dark:bg-neutral-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
