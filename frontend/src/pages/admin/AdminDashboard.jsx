import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Users, Building2, Gavel, 
  BarChart3, Settings, Search, Bell, 
  Activity, DollarSign, ArrowLeft, LogOut, Loader2, ChevronDown,
  ShieldCheck, UserCog, ClipboardList, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';
import Logo from '../../assets/icons/LogoAccident.png';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminStats, setAdminStats] = useState({
    revenue: '₹1.2 Cr',
    users: '54,201',
    insurers: '18',
    pending: '142'
  });

  const [usersList, setUsersList] = useState([]);
  const [fraudData, setFraudData] = useState([]);
  const [healthStats, setHealthStats] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data) {
        setAdminStats(statsRes.data);
      }

      if (['users', 'insurers', 'mediators'].includes(activeTab)) {
        const usersRes = await api.get('/admin/users');
        if (usersRes.data) {
          setUsersList(usersRes.data);
        }
      }

      if (activeTab === 'fraud') {
        const res = await api.get('/admin/fraud');
        setFraudData(res.data);
      } else if (activeTab === 'system') {
        const res = await api.get('/admin/health');
        setHealthStats(res.data);
      } else if (activeTab === 'settings') {
        const res = await api.get('/admin/settings');
        setSystemSettings(res.data);
      }
    } catch (err) {
      console.error("Admin data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'User Directory', icon: <Users className="w-5 h-5" /> },
    { id: 'insurers', label: 'Insurance Providers', icon: <Building2 className="w-5 h-5" /> },
    { id: 'mediators', label: 'Mediators', icon: <Gavel className="w-5 h-5" /> },
    { id: 'revenue', label: 'Capital Flows', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'fraud', label: 'Anomaly Shield', icon: <ShieldAlert className="w-5 h-5" /> },
    { id: 'system', label: 'System Health', icon: <Activity className="w-5 h-5" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'audit', label: 'Audit Logs', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile Settings', icon: <UserCog className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex mesh-bg-light dot-grid bg-slate-50 text-slate-900 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Light Theme */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white/95 backdrop-blur-md text-slate-700 border-r border-slate-200/80 z-50 shadow-2xl lg:shadow-sm transition-transform duration-300 flex flex-col ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-6 w-auto mr-3" />
            <span className="text-slate-950 font-bold tracking-tight text-sm">AccidentAlert</span>
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <button onClick={() => navigate(-1)} className="w-full flex items-center gap-4 px-3 py-2.5 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition-all duration-200 cursor-pointer group mb-4">
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
            <span className="font-semibold text-xs uppercase tracking-wider">Go Back</span>
          </button>

          <div className="text-[10px] font-bold text-slate-400 mb-3 px-2 uppercase tracking-widest">Administration</div>
          
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'revenue') {
                  navigate('/admin/revenue');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-slate-950 text-white shadow-sm font-semibold' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={activeTab === item.id ? 'text-white shrink-0' : 'text-slate-400 group-hover:text-slate-900 transition-colors shrink-0'}>
                {item.icon}
              </div>
              <span className="font-semibold text-xs uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 w-full p-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/10">
              <span className="text-xs font-bold text-white">AD</span>
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Superuser</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">L3 Clearance</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block w-96 max-w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search globally across platform..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Network Stable
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 mesh-bg-light dot-grid bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Superuser monitoring and configuration panel.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-350" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div 
                        onClick={() => navigate('/admin/revenue')}
                        className="premium-card flex flex-col justify-between cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Gross Processed</p>
                          <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors"><DollarSign className="w-4 h-4" /></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{adminStats?.revenue || '0'}</h3>
                      </div>
                      <div 
                        onClick={() => setActiveTab('users')}
                        className="premium-card flex flex-col justify-between cursor-pointer hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Active Users</p>
                          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Users className="w-4 h-4" /></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{adminStats?.users || '0'}</h3>
                      </div>
                      <div 
                        onClick={() => setActiveTab('insurers')}
                        className="premium-card flex flex-col justify-between cursor-pointer hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Partner Insurers</p>
                          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Building2 className="w-4 h-4" /></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{adminStats?.insurers || '0'}</h3>
                      </div>
                      <div 
                        onClick={() => setActiveTab('users')}
                        className="premium-card flex flex-col justify-between cursor-pointer hover:border-amber-200 hover:shadow-md hover:shadow-amber-500/5 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Pending KYC</p>
                          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors"><ShieldAlert className="w-4 h-4" /></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{adminStats?.pending || '0'}</h3>
                      </div>
                    </div>

                    <div className="premium-card">
                      <h2 className="text-lg font-bold text-slate-900 mb-6">System Health Matrix</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">API Latency</p>
                          <p className="text-xl font-bold text-emerald-600">42ms</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">DB Connections</p>
                          <p className="text-xl font-bold text-slate-900">14/500</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fraud Shield Status</p>
                          <p className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Enforcing
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* USERS, INSURERS, MEDIATORS TABS */}
                {['users', 'insurers', 'mediators'].includes(activeTab) && (
                  <motion.div key="users-list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="premium-card overflow-hidden p-0 border border-slate-200/60 shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                          <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Name & Email</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Role</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Mobile Number</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Registration</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {usersList
                              .filter(u => {
                                if (activeTab === 'insurers') return u.role === 'insurer';
                                if (activeTab === 'mediators') return u.role === 'mediator';
                                return true;
                              })
                              .length > 0 ? (
                              usersList
                                .filter(u => {
                                  if (activeTab === 'insurers') return u.role === 'insurer';
                                  if (activeTab === 'mediators') return u.role === 'mediator';
                                  return true;
                                })
                                .map((u, i) => (
                                <tr key={i} className="hover:bg-slate-50/60 transition-colors cursor-pointer group">
                                  <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{u.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="badge-premium-blue capitalize">{u.role}</span>
                                  </td>
                                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{u.phone}</td>
                                  <td className="px-6 py-4 font-medium text-slate-600">{new Date(u.created_at).toLocaleDateString()}</td>
                                  <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider cursor-pointer">Inspect</button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">
                                  No {activeTab} found matching criteria.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* FRAUD/ANOMALY SHIELD TAB */}
                {activeTab === 'fraud' && (
                  <motion.div key="fraud" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="premium-card bg-rose-50/50 border-rose-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><ShieldAlert className="w-5 h-5" /></div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">Anomaly Detection Engine</h2>
                          <p className="text-xs text-slate-500 font-medium">Claims flagged by AI for high risk or data mismatch.</p>
                        </div>
                      </div>
                    </div>
                    <div className="premium-card overflow-hidden p-0 border border-slate-200/60 shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                          <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Claim Ref & Date</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">User</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">AI Confidence</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Flag Reason</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {fraudData.length > 0 ? fraudData.map((f, i) => (
                              <tr key={i} className="hover:bg-slate-50/60 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                  <p className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">{f.id}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{f.date}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="font-bold text-slate-700">{f.user_name}</p>
                                  <p className="text-xs text-slate-500">{f.user_email}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden w-16">
                                      <div className="h-full bg-rose-500" style={{ width: `${f.fraud_score}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-rose-600">{f.fraud_score}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-xs truncate">{f.reason}</td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-rose-600 hover:text-rose-700 font-bold text-[10px] uppercase tracking-wider border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">Lock & Review</button>
                                </td>
                              </tr>
                            )) : (
                              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">No anomalies detected.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SYSTEM HEALTH TAB */}
                {activeTab === 'system' && healthStats && (
                  <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="premium-card bg-slate-950 text-white">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Platform Status</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-2xl font-bold text-emerald-400">{healthStats.status}</span>
                        </div>
                      </div>
                      <div className="premium-card">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">API Latency</p>
                        <span className="text-2xl font-bold text-slate-900">{healthStats.api_latency}</span>
                      </div>
                      <div className="premium-card">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">DB Connections</p>
                        <span className="text-2xl font-bold text-slate-900">{healthStats.db_connections}</span>
                      </div>
                      <div className="premium-card">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Jobs</p>
                        <span className="text-2xl font-bold text-blue-600">{healthStats.active_jobs} workers</span>
                      </div>
                    </div>
                    <div className="premium-card">
                      <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Hardware Telemetry</h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-slate-600">
                            <span>Memory Allocation</span>
                            <span>{healthStats.memory_usage}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: healthStats.memory_usage }} className="h-full bg-blue-500"></motion.div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-slate-600">
                            <span>CPU Workload</span>
                            <span>{healthStats.cpu_load}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: healthStats.cpu_load }} className="h-full bg-indigo-500"></motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SYSTEM SETTINGS TAB */}
                {activeTab === 'settings' && systemSettings && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="premium-card">
                      <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Global Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div className="space-y-6 border-r border-slate-100 pr-8">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">Maintenance Mode</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Disables all public endpoints</p>
                            </div>
                            <button className={`w-12 h-6 rounded-full transition-colors relative ${systemSettings.maintenance_mode ? 'bg-rose-500' : 'bg-slate-200'}`}>
                              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${systemSettings.maintenance_mode ? 'translate-x-6' : ''}`}></span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">Automated Payouts</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">AI verified claims under threshold</p>
                            </div>
                            <button className={`w-12 h-6 rounded-full transition-colors relative ${systemSettings.auto_payouts ? 'bg-blue-600' : 'bg-slate-200'}`}>
                              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${systemSettings.auto_payouts ? 'translate-x-6' : ''}`}></span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="block font-bold text-slate-900 text-sm mb-2">Platform Fee (%)</label>
                            <input type="number" defaultValue={systemSettings.platform_fee_percentage} className="premium-input w-full" />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-900 text-sm mb-2">AI Strictness</label>
                            <select defaultValue={systemSettings.ai_strictness} className="premium-input w-full">
                              <option value="low">Low - Favor User</option>
                              <option value="medium">Medium - Balanced</option>
                              <option value="high">High - Favor Insurer (Current)</option>
                            </select>
                          </div>
                          <div className="pt-2">
                            <button className="premium-btn-primary w-full justify-center">Save Configuration</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* AUDIT LOGS TAB */}
                {activeTab === 'audit' && (
                  <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="premium-card bg-slate-950 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <ClipboardList className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-bold tracking-tight text-white">System Audit Ledger</h2>
                      </div>
                      <p className="text-sm text-slate-400 font-medium">Immutable record of critical administrative and financial actions.</p>
                    </div>

                    <div className="premium-card p-0 overflow-hidden border border-slate-200/60 shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                          <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Timestamp</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Actor</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Event Action</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { time: 'Just now', actor: 'System Administrator', event: 'Global Config Updated: Maintenance Mode Disabled', sev: 'High' },
                              { time: '2 mins ago', actor: 'HDFC ERGO', event: 'Payout Authorized: CLM-1029 (₹45,000)', sev: 'Critical' },
                              { time: '14 mins ago', actor: 'AI Anomaly Shield', event: 'Flagged User for Fraud: Multiple IPs detected', sev: 'High' },
                              { time: '1 hour ago', actor: 'Adv. Rajesh Kumar', event: 'Mediator Dispute Resolved: Case #992', sev: 'Medium' },
                              { time: '2 hours ago', actor: 'System', event: 'Automated Daily Backup Completed successfully', sev: 'Low' },
                            ].map((log, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{log.time}</td>
                                <td className="px-6 py-4 font-bold text-slate-700">{log.actor}</td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{log.event}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                    log.sev === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                    log.sev === 'High' ? 'bg-amber-100 text-amber-700' :
                                    log.sev === 'Medium' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {log.sev}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PROFILE SETTINGS TAB */}
                {activeTab === 'profile' && user && (
                  <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    
                    <div className="premium-card flex flex-col md:flex-row gap-8 items-center md:items-start border-t-4 border-t-blue-600">
                      <div className="shrink-0 relative">
                        <img 
                          src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'} 
                          alt="Admin Avatar" 
                          className="w-24 h-24 rounded-2xl object-cover shadow-md border border-slate-200"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-1.5 rounded-lg border-2 border-white">
                          <UserCog className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name}</h2>
                        <p className="text-sm font-medium text-slate-500">{user.email}</p>
                        <div className="pt-2">
                          <span className="badge-premium-blue capitalize">Level 5 Clearance ({user.role})</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="premium-card space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                            <input type="text" defaultValue={user.name} className="premium-input w-full" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input type="email" defaultValue={user.email} className="premium-input w-full" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                            <input type="text" defaultValue={user.phone || '+91 9876543210'} className="premium-input w-full" />
                          </div>
                          <button className="premium-btn-primary w-full justify-center">Save Details</button>
                        </div>
                      </div>

                      <div className="premium-card space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Security & Auth</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                            <input type="password" placeholder="••••••••" className="premium-input w-full" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                            <input type="password" placeholder="Leave blank to keep current" className="premium-input w-full" />
                          </div>
                          
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mt-6">
                            <div className="flex gap-3">
                              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-amber-900">Two-Factor Authentication</p>
                                <p className="text-xs text-amber-700 mt-1">Protect your admin account with an extra layer of security.</p>
                                <button className="mt-3 px-4 py-2 bg-white text-amber-600 border border-amber-300 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">Enable 2FA</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* OTHER TABS PLACEHOLDER (Catch-all) */}
                {activeTab !== 'overview' && !['users', 'insurers', 'mediators', 'fraud', 'system', 'settings', 'audit', 'profile'].includes(activeTab) && (
                  <motion.div key="placeholder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 premium-card border-dashed border-slate-350">
                    <Settings className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                    <h4 className="text-base font-bold text-slate-900 mb-1">Module Inactive</h4>
                    <p className="text-sm text-slate-500 font-medium">The {activeTab} module is currently offline for maintenance.</p>
                  </motion.div>
                )}

              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
