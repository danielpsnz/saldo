import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { Toaster } from "sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Saldo Finance",
    default: "Saldo Finance",
  },
  description: "Personal finance wealth management platform.",
  icons: {
    icon: "/icons/logo.svg",
  },
  metadataBase: new URL("https://saldo-beta.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-white">
        <body
          className={`${inter.variable} ${ibmPlexSerif.variable} antialiased h-full`}
        >
          <QueryProvider>
            <SheetProvider />
            <Suspense>
              <Toaster />
              {children}
            </Suspense>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
