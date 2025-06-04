"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="sidebar">
      <Link href="/" className="flex h-16 shrink-0 items-center">
        <Image
          src="/icons/logo-full.svg"
          width={250}
          height={100}
          alt="Saldo Finance logo"
          className="h-8 w-auto"
        />
      </Link>

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
    </div>
  );
};

export default Sidebar;
