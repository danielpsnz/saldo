import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex min-h-full">
        <div className="relative hidden flex-[2] lg:block">
          <img
            alt="Saldo Finance logo"
            src="/icons/logo-full.svg"
            className="absolute top-6 left-10 z-10 size-16 w-auto"
          />
          <img
            alt="Authentication image"
            src="/auth-image.jpeg"
            className="absolute inset-0 size-full object-cover z-0"
          />
        </div>
        <div className="flex flex-[3] flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 relative">

          <div className="mb-6 flex justify-center lg:hidden">
            <img
              alt="Saldo Finance logo"
              src="/icons/logo-full.svg"
              className="size-16 w-auto"
            />
          </div>

          <div className="w-full max-w-sm lg:w-96 mx-auto">{children}</div>
        </div>
      </div>
    </ClerkProvider>
  );
}
