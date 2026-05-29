import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Cloud, FileText, Bell, Settings, Search, Plus, 
  Activity, Clock, MapPin, Loader2, ArrowRight, ArrowLeft, User, PieChart, LogOut, ShieldAlert, Check, Menu, X
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';
import Logo from '../../assets/icons/LogoAccident.png';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    } else if (!authLoading && isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'insurer') {
        navigate('/insurer', { replace: true });
      } else if (user.role === 'mediator') {
        navigate('/mediator', { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setAvatarPreview(localStorage.getItem(`userAvatar_${user.id}`) || null);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getActivityColorClass = (type, status) => {
    if (status === 'Settled' || status === 'Resolved' || status === 'Active') {
      return 'badge-premium-green';
    }
    if (status === 'Rejected' || status === 'Expired') {
      return 'badge-premium-red';
    }
    if (status === 'Under Review' || status === 'Pending') {
      return 'badge-premium-amber';
    }
    return 'badge-premium-blue';
  };

  const getActivityIcon = (type) => {
    if (type === 'dispute') return <ShieldAlert className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  const handleLogout = async () => {
    await logout();
    navigate(-1);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-body text-slate-800 mesh-bg-light dot-grid">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Sleek Deep Black */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-950 text-slate-300 border-r border-slate-900 z-50 shadow-2xl transition-transform duration-300 flex flex-col ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-900 shrink-0">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-6 w-auto filter brightness-0 invert mr-1.5" />
            <span className="text-white font-outfit font-black tracking-widest text-xs uppercase">AccidentAlert</span>
          </div>
          <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all group mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="font-bold text-xs uppercase tracking-wider">Go Back</span>
          </button>
          
          <div className="text-[10px] font-black text-zinc-500 mb-3 px-2 uppercase tracking-widest">Main Menu</div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-zinc-900 text-white rounded-xl transition-all"
          >
            <Home className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Overview</span>
          </button>
          
          <button 
            onClick={() => navigate('/claims')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all group"
          >
            <FileText className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="font-bold text-xs uppercase tracking-wider">My Claims</span>
          </button>
          
          <button 
            onClick={() => navigate('/vault')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all group"
          >
            <Cloud className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="font-bold text-xs uppercase tracking-wider">Document Locker</span>
          </button>
          
          <div className="text-[10px] font-black text-zinc-500 mb-3 mt-8 px-2 uppercase tracking-widest">Resources</div>
          <button 
            onClick={() => navigate('/knowledge')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all group"
          >
            <PieChart className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="font-bold text-xs uppercase tracking-wider">Analytics</span>
          </button>
          
          <button 
            onClick={() => navigate('/knowledge')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all group"
          >
            <Settings className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="font-bold text-xs uppercase tracking-wider">Knowledge Hub</span>
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950">
                      <button onClick={() => navigate('/profile')} className="flex items-center gap-4 w-full p-2.5 hover:bg-zinc-900 rounded-xl transition-all">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">{getInitials(user?.name)}</span>
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate font-outfit">{user?.name || 'Authorized User'}</p>
              <p className="text-[9px] text-zinc-500 truncate font-mono">{user?.email}</p>
            </div>
            <Settings className="w-4 h-4 text-zinc-500 shrink-0" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search for claims, disputes..." className="premium-input !pl-11 py-2.5 w-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-4 ring-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-950 uppercase tracking-tight leading-none">{user?.name || 'User'}</p>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">Policyholder</p>
              </div>
              <img 
                src={avatarPreview || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"} 
                alt="Profile" 
                className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl object-cover shadow-sm border border-slate-200"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard view */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Title / Action Headers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-outfit uppercase">My Dashboard</h1>
                <p className="text-xs text-slate-400 font-medium">Overview of your telemetry profile and active claim files.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate('/report')} className="premium-btn-secondary">
                  <MapPin className="w-3.5 h-3.5" /> Report Accident
                </button>
                <button onClick={() => navigate('/claims/new')} className="premium-btn-accent">
                  <Plus className="w-3.5 h-3.5" /> File Payout Claim
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Stats Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="premium-card">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Claims</p>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0"><FileText className="w-4 h-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-extrabold text-slate-900 font-outfit">{stats?.active_claims || 0}</h3>
                      <span className="text-[9px] font-bold text-emerald-600">+2 new active</span>
                    </div>
                  </div>
                  
                  <div className="premium-card">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Locker Docs</p>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Cloud className="w-4 h-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-extrabold text-slate-900 font-outfit">{stats?.vault_documents || 0}</h3>
                      <span className="text-[9px] font-bold text-slate-400">Total stored docs</span>
                    </div>
                  </div>

                  <div className="premium-card">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Disputes</p>
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0"><ShieldAlert className="w-4 h-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-extrabold text-slate-900 font-outfit">{stats?.open_disputes || 0}</h3>
                      <span className="text-[9px] font-bold text-slate-400">Awaiting SDM tribunal</span>
                    </div>
                  </div>

                  <div className="premium-card border-t-2 border-slate-950">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Level</p>
                      <div className="p-2 bg-slate-950 text-white rounded-xl shrink-0"><Check className="w-4 h-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-extrabold text-slate-900 font-outfit">100%</h3>
                      <span className="text-[9px] font-bold text-emerald-600">RTO Compliant</span>
                    </div>
                  </div>

                </div>

                {/* Lower Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Recent Activities */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-base font-bold text-slate-900 uppercase font-outfit">Recent Incident Logs</h2>
                        <button onClick={() => navigate('/claims')} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider">Inspect All</button>
                      </div>
                      
                      <div className="space-y-4">
                        {stats?.recent_activities?.length > 0 ? (
                          stats.recent_activities.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">{activity.title}</p>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">{activity.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className={getActivityColorClass(activity.type, activity.status)}>
                                  {activity.status}
                                </span>
                                <p className="text-[9px] text-slate-400 mt-1 font-mono">{new Date(activity.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                            <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-xs font-semibold text-slate-400">No incident logs reported yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid Panel */}
                  <div className="space-y-6">
                    <div className="premium-card bg-slate-950 text-white border-zinc-900 shadow-2xl">
                      <h2 className="text-base font-bold mb-6 font-outfit uppercase tracking-tight">Quick Actions</h2>
                      <div className="space-y-3">
                        
                        <button onClick={() => navigate('/report')} className="w-full flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-850 rounded-xl transition-all group border border-zinc-850">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">File Incident</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                        </button>
                        
                        <button onClick={() => navigate('/claims/new')} className="w-full flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-850 rounded-xl transition-all group border border-zinc-855">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-emerald-400" />
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">File New Claim</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                        </button>
                        
                        <button onClick={() => navigate('/vault')} className="w-full flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-850 rounded-xl transition-all group border border-zinc-850">
                          <div className="flex items-center gap-3">
                            <Cloud className="w-4 h-4 text-purple-400" />
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Locker Upload</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                        </button>

                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

