import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCircle2, AlertCircle, MessageSquare, 
  IndianRupee, ArrowLeft, Trash2, ShieldAlert,
  Loader2, ExternalLink, Calendar, Filter, Clock, Archive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Footer from '../../components/layout/Footer';

export default function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Claims') return n.type === 'claim_update';
    if (activeFilter === 'Disputes') return n.type === 'dispute_msg' || n.type === 'legal_alert';
    if (activeFilter === 'Payments') return n.type === 'payment_received';
    return true;
  });

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.action_url) {
      const targetUrl = notif.action_url.replace('/dashboard', '');
      navigate(targetUrl);
    }
  };

  const getIcon = (notif) => {
    const type = notif.type;
    const colorClass = `w-5 h-5 ${notif.is_read ? 'text-slate-400' : 'text-white'}`;
    switch (type) {
      case 'claim_update': return <ShieldAlert className={colorClass} />;
      case 'dispute_msg': return <MessageSquare className={colorClass} />;
      case 'payment_received': return <IndianRupee className={colorClass} />;
      case 'legal_alert': return <AlertCircle className={colorClass} />;
      default: return <Bell className={colorClass} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* STANDARD INSTITUTIONAL HEADER */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-12 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Notification Center</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => api.post('/notifications/read-all').then(fetchNotifications)}
            className="text-xs font-bold text-slate-500 hover:text-slate-950 cursor-pointer transition-colors px-4 py-2 hover:bg-slate-100 rounded-xl"
          >
            Clear All
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Platform Activity
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-md leading-relaxed">
              Real-time accident data, claim status shifts, and system updates archive.
            </p>
          </div>

          <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
            {['All', 'Claims', 'Disputes', 'Payments'].map(filter => (
              <button 
                key={filter} 
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeFilter === filter 
                    ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                    : 'bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-950 shadow-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <motion.div 
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`premium-card group cursor-pointer hover:shadow-md transition-all duration-300 relative flex items-start gap-6 ${
                    notif.is_read 
                      ? 'opacity-65 border-slate-200/60 shadow-none' 
                      : 'border-slate-250/90 bg-white/95'
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-105 ${
                    notif.is_read ? 'bg-slate-100' : 'bg-slate-950'
                  }`}>
                    {getIcon(notif)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className={`font-bold text-sm tracking-tight ${notif.is_read ? 'text-slate-500' : 'text-slate-900'}`}>{notif.title}</h3>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-650 font-medium leading-relaxed mb-4">{notif.message}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                      {notif.action_url && (
                        <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all">
                          Process <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="premium-card border-dashed border-slate-350 bg-white/80 text-center py-24">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-900 mb-1">No Notifications</h3>
                <p className="text-xs text-slate-450 font-medium">No new activity updates are currently queued.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
