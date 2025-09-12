'use client';

import { BarChart2, BookOpen, Calendar, MessageSquare } from 'lucide-react';

interface DashboardBottomTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function DashboardBottomTabs({ activeTab, onTabChange }: DashboardBottomTabsProps) {
  const tabs = [
    {
      name: 'Overview',
      icon: BarChart2,
      id: 'overview'
    },
    {
      name: 'Courses',
      icon: BookOpen,
      id: 'courses'
    },
    {
      name: 'Sessions',
      icon: Calendar,
      id: 'sessions'
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      id: 'messages'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                activeTab === tab.id
                  ? 'bg-[#4f46e5] text-white'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}