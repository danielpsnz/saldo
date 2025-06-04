"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UserButton, useUser } from "@clerk/nextjs";

const MobileNav = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-1 px-4"
          >
            <Image
              src="/icons/logo-full.svg"
              width={125}
              height={50}
              alt="Saldo Finance logo"
            />
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {sidebarLinks.map((item) => {
                const isActive = pathname === item.route;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.route}
                      className={cn(
                        isActive
                          ? "bg-gray-50 text-[#7e4a24]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#7e4a24]",
                        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={cn(
                          isActive
                            ? "text-[#7e4a24]"
                            : "text-gray-400 group-hover:text-[#7e4a24]",
                          "h-6 w-6 shrink-0"
                        )}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li className="-mx-6 mt-auto">
            <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900">
              <UserButton />
              <span aria-hidden="true">{user?.fullName || "Tom Cook"}</span>
            </div>
          </li>
        </ul>
      </nav>
            </SheetClose>
            
            {/* <Footer user={user} type="mobile"/> */}
          </div>
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </VisuallyHidden>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
