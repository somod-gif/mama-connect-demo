import type { Metadata } from "next";
import { Archivo, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import { Navbar } from "@/app/components/shared/Navbar";
import { ErrorBoundary } from "@/app/components/shared/ErrorBoundary";

const ArchivoFont = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const InstrumentSerifFont = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const PlexMonoFont = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MamaConnect | Human-Centered, AI-Assisted Maternal Health Platform",
  description:
    "MamaConnect connects pregnant and postpartum women with Community Health Extension Workers and healthcare facilities for timely maternal care.",
  keywords: [
    "maternal health", "pregnancy", "postpartum", "Nigeria",
    "CHEW", "community health", "MamaConnect", "HelpMum",
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${ArchivoFont.variable} ${InstrumentSerifFont.variable} ${PlexMonoFont.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <QueryProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Navbar />
              {children}
            </ErrorBoundary>
            <Toaster richColors closeButton position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
