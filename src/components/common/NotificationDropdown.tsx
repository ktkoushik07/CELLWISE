import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { dbService } from '../../services/db';
import type { NotificationItem, UserRole } from '../../types/battery';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  userRole?: UserRole;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const navigate = useNavigate();

  const loadNotifs = () => {
    const list = dbService.getNotifications(userRole);
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifs();
    const handleDbChange = () => loadNotifs();
    window.addEventListener('cellwise_db_change', handleDbChange);
    return () => window.removeEventListener('cellwise_db_change', handleDbChange);
  }, [userRole]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/80"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold font-mono flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden font-sans">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <span className="text-xs font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-400" /> Notifications ({notifications.length})
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">No new notifications.</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.linkUrl) navigate(n.linkUrl);
                      setIsOpen(false);
                    }}
                    className={`p-3 hover:bg-slate-800/60 cursor-pointer transition-colors ${
                      !n.read ? 'bg-slate-850/50 border-l-2 border-cyan-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{n.message}</p>
                    {n.linkUrl && (
                      <span className="text-[10px] text-cyan-400 font-mono mt-1.5 inline-flex items-center gap-1 hover:underline">
                        View detail <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
