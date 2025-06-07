import {
  HomeIcon,
  BanknotesIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { BriefcaseBusinessIcon, TagIcon } from "lucide-react";

export const sidebarLinks = [
  {
    route: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    route: "/accounts",
    label: "Accounts",
    icon: BriefcaseBusinessIcon,
  },
  {
    route: "/transactions",
    label: "Transactions",
    icon: BanknotesIcon,
  },
  {
    route: "/categories",
    label: "Categories",
    icon: TagIcon,
  },
  {
    route: "/settings",
    label: "Settings",
    icon: Cog6ToothIcon,
  },
];
