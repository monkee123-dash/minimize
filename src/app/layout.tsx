import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minimize — AI Interior Redesign",
  description: "Transform cluttered home photos into minimalist, Instagram-ready interiors using AI. Upload a photo, get a stunning redesign in seconds.",
  keywords: "AI interior design, room redesign, minimalist home, virtual staging, home decor AI",
  openGraph: {
    title: "Minimize — AI Interior Redesign",
    description: "Transform cluttered rooms into minimalist masterpieces with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-mono bg-light text-dark overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
