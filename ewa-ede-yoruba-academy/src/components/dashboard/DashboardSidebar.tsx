'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'next-auth';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHome, FiBook, FiMessageSquare, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
};

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <FiHome className="w-5 h-5" />,
  },
  {
    name: 'My Courses',
    href: '/courses',
    icon: <FiBook className="w-5 h-5" />,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: <FiMessageSquare className="w-5 h-5" />,
  },
];

type DashboardSidebarProps = {
  user?: User;
};

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(session?.user?.role || user?.role || '');
  });

  // Mobile menu button
  const MobileMenuButton = () => (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
      >
        {isMobileMenuOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>
    </div>
  );

  // Sidebar content
  const SidebarContent = ({ isMobile = false }) => (
    <div
      className={`${isMobile ? 'md:hidden' : 'hidden md:flex'} ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 top-0 z-40`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-indigo-600">Ewa Ede Yoruba</h1>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white">
            EY
          </div>
        )}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {isCollapsed ? (
              <FiChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <FiChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            {(session?.user?.name || user?.name || 'U')
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || user?.name || 'User'}
              </p>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <MobileMenuButton />

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <SidebarContent isMobile={true} />

      {/* Desktop sidebar */}
      <SidebarContent />

      {/* Main content area padding */}
      <div
        className={`flex-1 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        } transition-all duration-300 pt-4 md:pt-0`}
      >
        {/* Mobile header */}
        <div className="md:hidden p-4">
          <h1 className="text-xl font-bold text-gray-800">
            {pathname === '/dashboard'
              ? 'Dashboard'
              : pathname.split('/').pop()?.replace(/-/g, ' ')}
          </h1>
        </div>
      </div>
    </>
  );
}
