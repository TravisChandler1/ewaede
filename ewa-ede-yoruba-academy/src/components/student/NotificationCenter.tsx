'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/student/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId, action: 'markAsRead' }),
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50 p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-[#4f46e5] mr-2" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5] mx-auto mb-4"></div>
              <p className="text-[#a1a1aa]">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
              <p className="text-[#a1a1aa]">No notifications yet</p>
              <p className="text-sm text-[#6b7280] mt-1">Check back later for updates!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-[#4f46e5]/5 border-l-4 border-[#4f46e5]' : ''
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-[#a1a1aa] mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center text-xs text-[#6b7280]">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#4f46e5] rounded-full ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-[#2a2a2a]">
            <Button
              onClick={async () => {
                try {
                  await fetch('/api/student/notifications', {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'markAllAsRead' }),
                  });
                  setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
                } catch (error) {
                  console.error('Error marking all as read:', error);
                }
              }}
              className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white"
            >
              Mark All as Read
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}