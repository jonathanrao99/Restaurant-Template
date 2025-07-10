import Link from 'next/link';
import { FiShoppingCart, FiSettings, FiUsers, FiEdit } from 'react-icons/fi';

export default function NimdaNavbar() {
  const navigationItems = [
    {
      label: 'Orders',
      href: '/nimda/dashboard/orders',
      icon: FiShoppingCart,
    },
    {
      label: 'Menu',
      href: '/nimda/dashboard/menu',
      icon: FiSettings,
    },
    {
      label: 'Customers',
      href: '/nimda/dashboard/customers',
      icon: FiUsers,
    },
    {
      label: 'Blog',
      href: '/nimda/dashboard/blog',
      icon: FiEdit,
    }
  ];

  return (
    <header className="shadow-md bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/nimda/dashboard" className="flex items-center gap-2">
          <span className="font-samarkan text-3xl text-desi-orange">Desi</span>
          <span className="font-display text-2xl font-bold tracking-wide text-desi-black">Flavors Katy</span>
        </Link>
        <nav className="flex items-center gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-gray-600 hover:text-desi-orange transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
} 