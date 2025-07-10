"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

const PAGE_TITLES: Record<string, string> = {
  "/nimda/dashboard": "Dashboard",
  "/nimda/dashboard/orders": "Orders",
  "/nimda/dashboard/analytics": "Sales Analytics",
  "/nimda/dashboard/qr": "QR Code Analytics",
  "/nimda/dashboard/menu": "Menu Management",
  "/nimda/dashboard/feedback": "Customer Feedback",
  // Add more as needed
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Protect all dashboard pages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authed = localStorage.getItem('nimda_authed');
      if (!authed) {
        router.replace('/nimda');
      }
    }
  }, [router]);

  // Find the best matching page title
  let pageTitle = "";
  for (const key of Object.keys(PAGE_TITLES)) {
    if (pathname === key || pathname.startsWith(key + "/")) {
      pageTitle = PAGE_TITLES[key];
      break;
    }
  }
  if (!pageTitle) pageTitle = "Dashboard";

  // Logout handler
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nimda_authed');
      router.replace('/nimda');
    }
  };

  return (
    <div className="min-h-screen bg-desi-cream">
      {/* Top Navbar - styled like /nimda login */}
      <nav className="w-full flex items-center justify-between px-8 py-5 bg-white shadow-md">
        <div className="flex items-center gap-2 select-none">
          <span className="font-samarkan text-3xl text-desi-orange">Desi</span>
          <span className="font-display text-2xl font-bold tracking-wide text-desi-black">Flavors Katy</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 bg-desi-orange text-white rounded-full font-semibold shadow hover:bg-desi-black transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
      <div className="relative mb-6 flex flex-col items-center gap-2 pt-10">
        <h1 className="text-5xl font-bold font-display text-center w-full">{pageTitle}</h1>
        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link href="/nimda/dashboard/orders" className="px-6 py-3 bg-desi-orange text-white rounded-lg font-semibold shadow hover:bg-desi-black transition-colors">Orders</Link>
          <Link href="/nimda/dashboard/menu" className="px-6 py-3 bg-desi-orange text-white rounded-lg font-semibold shadow hover:bg-desi-black transition-colors">Menu</Link>
          <Link href="/nimda/dashboard/customers" className="px-6 py-3 bg-desi-orange text-white rounded-lg font-semibold shadow hover:bg-desi-black transition-colors">Customers</Link>
          <Link href="/nimda/dashboard/blog" className="px-6 py-3 bg-desi-orange text-white rounded-lg font-semibold shadow hover:bg-desi-black transition-colors">Blog</Link>
        </div>
      </div>
      <div className="px-6">{children}</div>
    </div>
  );
} 