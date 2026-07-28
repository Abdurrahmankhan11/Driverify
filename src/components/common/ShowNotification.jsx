import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

const defaultNotifications = [
  {
    title: 'Recruitment update: Uzair',
    description: 'Sahil Uddin marked Uzair as Selected',
    time: '07/07/2026, 13:18:38',
  },
  {
    title: 'Recruitment update: Uzair',
    description: 'Sahil Uddin marked Uzair as Pending',
    time: '07/07/2026, 13:18:28',
  },
  {
    title: 'Recruitment update: Uzair',
    description: 'Sahil Uddin marked Uzair as Selected',
    time: '07/07/2026, 13:18:03',
  },
  {
    title: 'Student Decision Update',
    description: 'Uzair Ahmed has Accepted the offer.',
    time: '07/07/2026, 13:15:27',
  },
  {
    title: 'Recruitment update: Ibrahim',
    description: 'Sahil Uddin marked Ibrahim as Selected',
    time: '07/07/2026, 12:50:32',
  },
];

const ShowNotification = ({ open, onClose, notifications = defaultNotifications }) => {
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div ref={notificationRef} className="fixed top-20 right-4 z-50 w-full max-w-sm rounded-[1.5rem] bg-white shadow-none border border-border/50 drop-shadow-xl">
      <div className="flex items-center justify-between gap-3 px-5 py-4 bg-white rounded-t-[1.5rem]">
        <div>
          <h2 className="text-sm font-semibold text-[#18181B]">Notifications</h2>
          <p className="text-xs text-[#6b7280]">Latest updates from your account</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs font-medium text-[#f97316] hover:text-[#f97333] transition">
            Mark all as read
          </button>
          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="rounded-full p-2 text-[#57534E] transition hover:bg-[#F5F5F4] hover:text-[#18181B]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-3 py-4">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="flex gap-3 bg-transparent px-4 py-4 transition hover:bg-[#fafaf9] first:mt-0 mt-3 rounded-xl cursor-pointer">
              <span className="mt-5 inline-flex h-2 w-2 rounded-full bg-[#f97316] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#18181B] truncate">{notification.title}</p>
                <p className="mt-1 text-xs text-[#4b5563] leading-5">{notification.description}</p>
                <p className="mt-2 text-xs text-[#9ca3af]">{notification.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#f8fafc] px-4 py-8 text-center text-sm text-[#6b7280] rounded-b-[1.5rem]">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowNotification;
