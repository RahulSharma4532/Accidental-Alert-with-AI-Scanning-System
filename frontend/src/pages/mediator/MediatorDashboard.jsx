import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, Scale, Clock, CheckCircle2, 
  Users, AlertCircle, Search, Filter, 
  ArrowRight, Video, FileText, MessageSquare,
  TrendingUp, Activity, Bell, Settings, LogOut,
  ShieldCheck, Loader2, ChevronRight, History, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

export default function MediatorDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    activeCases: 0,
    resolvedCases: 0,
    pendingQueue: 0
  });
  const [disputes, setDisputes] = useState([]);
  const [pendingDisputes, setPendingDisputes] = useState([]);
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' or 'queue'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'mediator')) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/mediator/stats');
      setStats(statsRes.data.stats);

      if (activeTab === 'assigned') {
        const disputesRes = await api.get('/mediator/disputes?type=assigned');
        setDisputes(disputesRes.data);
      } else {
        const queueRes = await api.get('/mediator/disputes?type=pending');
        setPendingDisputes(queueRes.data);
      }
    } catch (error) {
      console.error('Failed to load mediator data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (disputeId) => {
    try {
      await api.post(`/mediator/disputes/${disputeId}/assign`);
      fetchDashboardData();
      alert('Case assigned to you successfully!');
    } catch (error) {
      alert('Failed to assign case');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 mesh-bg-light dot-grid flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col shrink-0 z-50 shadow-2xl lg:shadow-none transition-transform duration-300 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-8 pb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-md">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-xl text-slate-900 font-outfit">Mediator Hub</h2>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Mediation Center</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-2">

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-5 h-5" /> },
              { id: 'cases', label: 'My Cases', icon: <Scale className="w-5 h-5" /> },
              { id: 'hearings', label: 'Video Hearings', icon: <Video className="w-5 h-5" /> },
              { id: 'docs', label: 'Legal Library', icon: <FileText className="w-5 h-5" /> },
              { id: 'settings', label: 'Preferences', icon: <Settings className="w-5 h-5" /> },
            ].map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  item.id === 'dashboard' 
                    ? 'bg-slate-950 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/85'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50/50 transition-all cursor-pointer">
            <LogOut className="w-5 h-5" />
            Exit Panel
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block w-96 max-w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for cases, users, or claim IDs..." 
                className="premium-input !pl-11 py-2.5 w-full" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-slate-55/50 border border-slate-200/80 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-4 ring-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-950 uppercase tracking-tight leading-none">Adv. Rajesh Kumar</p>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">Senior Mediator</p>
              </div>
              <div className="h-10 w-10 bg-slate-950 rounded-xl flex items-center justify-center font-bold text-white shadow-sm">R</div>
            </div>
          </div>
        </header>

        <div className="p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* STATS */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-subtle-fade"
            >
              {[
                { label: 'Assigned Cases', value: stats.totalAssigned, icon: <Scale className="w-5 h-5" />, color: 'bg-blue-50 text-blue-650' },
                { label: 'Active Reviews', value: stats.activeCases, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-50 text-amber-650' },
                { label: 'Cases Resolved', value: stats.resolvedCases, icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-650' },
                { label: 'Available in Queue', value: stats.pendingQueue, icon: <Users className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-650' },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="premium-card bg-white/70 backdrop-blur-md cursor-pointer group flex flex-col justify-between h-full border border-slate-200/80">
                  <div>
                    <div className={`${stat.color} p-3.5 rounded-xl w-fit mb-5 transition-transform duration-300 group-hover:scale-105`}>
                      {stat.icon}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight font-outfit mt-2">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* TAB SELECTOR */}
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setActiveTab('assigned')}
                className={`px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'assigned' ? 'premium-btn-primary shadow-sm' : 'premium-btn-secondary'
                }`}
              >
                My Active Cases
              </button>
              <button 
                onClick={() => setActiveTab('queue')}
                className={`px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'queue' ? 'premium-btn-primary shadow-sm' : 'premium-btn-secondary'
                }`}
              >
                Available for Assignment ({stats.pendingQueue})
              </button>
            </div>

            {/* CASES LIST */}
            <div className="premium-card p-0 overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Loading Case Directory...</p>
                </div>
              ) : activeTab === 'assigned' ? (
                disputes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-150">
                        <tr>
                          <th className="px-8 py-4">Case ID & Reason</th>
                          <th className="px-8 py-4">Claimant</th>
                          <th className="px-8 py-4">Expected Amount</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {disputes.map((dispute) => (
                          <tr key={dispute.id} className="group hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => navigate(`/mediator/disputes/${dispute.id}`)}>
                            <td className="px-8 py-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{dispute.dispute_id}</span>
                                <span className="text-sm font-bold text-slate-900">{dispute.reason}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-550 text-xs">
                                  {dispute.user?.name?.[0]}
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{dispute.user?.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-sm font-bold text-slate-900 font-outfit">₹{parseFloat(dispute.expected_amount).toLocaleString()}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className={dispute.status === 'Resolved' ? 'badge-premium-green' : 'badge-premium-amber'}>
                                {dispute.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/mediator/disputes/${dispute.id}`);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer shadow-md shadow-slate-950/10"
                              >
                                Review Case <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                      <ShieldCheck className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-outfit mb-1">No active cases found</h3>
                      <p className="text-sm font-medium text-slate-500">Pick a new case from the available queue to get started.</p>
                    </div>
                  </div>
                )
              ) : (
                pendingDisputes.length > 0 ? (
                   <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-150">
                        <tr>
                          <th className="px-8 py-4">Case ID & Reason</th>
                          <th className="px-8 py-4">Date Raised</th>
                          <th className="px-8 py-4">Amount Disputed</th>
                          <th className="px-8 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pendingDisputes.map((dispute) => (
                          <tr key={dispute.id} className="group hover:bg-slate-50/60 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{dispute.dispute_id}</span>
                                <span className="text-sm font-bold text-slate-900">{dispute.reason}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-sm font-medium text-slate-500">{new Date(dispute.created_at).toLocaleDateString()}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-sm font-bold text-slate-900 font-outfit">₹{parseFloat(dispute.expected_amount).toLocaleString()}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => handleAssign(dispute.id)}
                                className="premium-btn-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                              >
                                Assign to Me
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                      <AlertCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-outfit mb-1">The queue is empty</h3>
                      <p className="text-sm font-medium text-slate-500">All disputes are currently being handled by mediators.</p>
                    </div>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
