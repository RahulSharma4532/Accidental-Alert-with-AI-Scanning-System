import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'claim_update': return <Info className="w-4 h-4 text-blue-500" />;
      case 'dispute_msg': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'legal_alert': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'payment_received': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all ${
          isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-900'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200 overflow-hidden z-[100]"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => !n.is_read && markAsRead(n.id)}
                    className={`p-6 border-b border-slate-50 transition-all cursor-pointer hover:bg-slate-50 relative group ${
                      !n.is_read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-black text-slate-900 truncate mb-1`}>
                          {n.title}
                        </p>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed mb-3 line-clamp-2">
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {n.action_url && (
                            <Link 
                              to={n.action_url}
                              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all"
                            >
                              View Details
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    {!n.is_read && (
                      <div className="absolute top-6 right-6 w-2 h-2 bg-indigo-600 rounded-full" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No new notifications</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
              <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-all">
                See all activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
