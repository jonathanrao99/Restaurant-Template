"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingCart, Utensils, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const links = [
  {
    label: "Dashboard",
    href: "/nimda/dashboard",
    icon: <LayoutDashboard className="text-desi-black dark:text-desi-orange h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Orders",
    href: "/nimda/orders",
    icon: <ShoppingCart className="text-desi-black dark:text-desi-orange h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Menu",
    href: "/nimda/menu",
    icon: <Utensils className="text-desi-black dark:text-desi-orange h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Users",
    href: "/nimda/users",
    icon: <Users className="text-desi-black dark:text-desi-orange h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Settings",
    href: "/nimda/settings",
    icon: <Settings className="text-desi-black dark:text-desi-orange h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: "/",
    icon: <LogOut className="text-desi-black dark:text-desi-orange h-5 w-5 flex-shrink-0" />,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-desi-cream dark:bg-neutral-900 w-full flex-1 min-h-screen max-w-full mx-auto overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 py-8 px-4 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 min-h-screen">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/nimda/dashboard" className="flex items-center gap-3 mb-8">
              <Image src="/logo.png" alt="Desi Flavors Katy" width={36} height={36} className="rounded-lg" />
              {open && <span className="font-butler text-lg font-bold text-desi-black dark:text-desi-orange">Desi Flavors Katy</span>}
            </Link>
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 p-4 md:p-10 bg-desi-cream dark:bg-neutral-900 min-h-screen">
        {children}
      </main>
    </div>
  );
} 