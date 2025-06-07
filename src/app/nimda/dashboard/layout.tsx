"use client";
import React, { ReactNode, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function NimdaDashboardLayout({ children }: { children: ReactNode }) {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard className="h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <UserCog className="h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogOut className="h-6 w-6 flex-shrink-0" />,
    },
  ];
  const [open, setOpen] = useState(false);
  const mainLinks = links.filter(link => link.label !== "Logout");
  const logoutLink = links.find(link => link.label === "Logout");
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full flex-1 bg-desi-cream overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between items-start gap-4 rounded-tl-2xl rounded-tr-2xl overflow-hidden">
          <div>
            {open ? <Logo /> : <LogoIcon />}
          </div>
          <div className="flex flex-col items-start space-y-4">
            {mainLinks.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
          {logoutLink && <SidebarLink link={logoutLink} />}
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        {children}
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 py-2">
      <Image
        src="/logo.png"
        alt="Desi Flavors Hub"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white text-sm"
      >
        Desi Flavors Hub
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link href="/" className="py-2 flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="Desi Flavors Hub"
        width={32}
        height={32}
        className="h-8 w-8"
      />
    </Link>
  );
};
