import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import { Navbar } from "@/app/components/shared/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MamaConnect | Human-Centered, AI-Assisted Maternal Health Platform",
  description:
    "MamaConnect connects pregnant and postpartum women with Community Health Extension Workers and healthcare facilities for timely maternal care.",
  keywords: [
    "maternal health",
    "pregnancy",
    "postpartum",
    "Nigeria",
    "CHEW",
    "community health",
    "MamaConnect",
    "HelpMum",
  ],
  openGraph: {
    title: "MamaConnect | Human-Centered Maternal Health Platform",
    description:
      "Connecting mothers to life-saving care through community health workers and technology.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster richColors closeButton position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
