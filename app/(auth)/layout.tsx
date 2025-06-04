import { GradientBackground } from "@/components/ui/gradient";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="min-h-screen grid grid-cols-1">
        <div className="h-full lg:flex flex-col items-center justify-center px-4">
          <div className="relative text-center">
            <GradientBackground />
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
}
