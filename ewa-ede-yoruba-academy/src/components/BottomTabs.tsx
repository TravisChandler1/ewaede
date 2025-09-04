'use client';

import Link from 'next/link';
import { Home, BookOpen, Users, User, LogIn } from 'lucide-react';

export default function BottomTabs() {
  const tabs = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      active: true
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpen,
      active: false
    },
    {
      name: 'Community',
      href: '#community',
      icon: Users,
      active: false
    },
    {
      name: 'Sign In',
      href: '/auth/signin',
      icon: LogIn,
      active: false
    },
    {
      name: 'Get Started',
      href: '/auth/register',
      icon: User,
      active: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                tab.active
                  ? 'bg-[#4f46e5] text-white'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a]'
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