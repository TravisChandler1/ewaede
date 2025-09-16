'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, LogIn } from 'lucide-react';

export default function BottomTabs() {
  const pathname = usePathname();

  // Hide bottom tabs on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const tabs = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      active: pathname === '/'
    },
    {
      name: 'Pricing',
      href: '/services/yoruba-language-lessons',
      icon: User,
      active: pathname === '/services/yoruba-language-lessons'
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: LogIn,
      active: pathname === '/contact'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#4f46e5] border-t border-[#3b4a6b] z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                tab.active
                  ? 'bg-[#e69d2a] text-white'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#2d4a77]'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}