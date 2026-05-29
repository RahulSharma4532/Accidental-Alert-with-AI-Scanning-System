import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Inbox, FileText, Gavel, TrendingUp, 
  Users, AlertCircle, CheckCircle2, XCircle, 
  Search, Download, Filter, MoreVertical, 
  ArrowLeft, LogOut, Loader2, DollarSign, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

export default function InsurerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('queue');
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'insurer')) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    fetchInsurerData();
  }, [activeTab]);

  const fetchInsurerData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/insurer/claims');
      if (response.data) {
        setClaims(response.data);
      }
    } catch (error) {
      console.error('Failed to load insurer data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/insurer/claims/${id}`, { status });
      fetchInsurerData();
    } catch (err) {
      console.error('Failed to update claim status', err);
    }
  };

  const totalClaims = claims.length;
  const pendingReview = claims.filter(c => c.status === 'Pending' || c.status === 'Under Review' || c.status === 'Submitted' || c.status === 'investigating').length;
  const activeDisputes = claims.filter(c => c.status === 'Disputed').length;
  const settledValue = claims
    .filter(c => c.status === 'Settled' || c.status === 'Approved' || c.status === 'Paid')
    .reduce((sum, c) => sum + parseFloat(c.estimated_amount || 0), 0);

  const stats = [
    { label: 'Total Claims', value: totalClaims.toString(), icon: <FileText className="w-4 h-4" /> },
    { label: 'Pending Review', value: pendingReview.toString(), icon: <Inbox className="w-4 h-4" /> },
    { label: 'Active Disputes', value: activeDisputes.toString(), icon: <Gavel className="w-4 h-4" /> },
    { label: 'Settled Value', value: `₹${settledValue.toLocaleString()}`, icon: <DollarSign className="w-4 h-4" /> },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'queue', label: 'Claims Queue', icon: <Inbox className="w-5 h-5" /> },
    { id: 'disputes', label: 'Legal Disputes', icon: <Gavel className="w-5 h-5" /> },
    { id: 'surveyors', label: 'Surveyor Network', icon: <Users className="w-5 h-5" /> },
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
            <Shield className="h-6 w-auto mr-3 text-blue-600 animate-pulse-glow" />
            <span className="text-slate-950 font-bold tracking-tight text-sm">Insurer Dashboard</span>
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

          <div className="text-[10px] font-bold text-slate-400 mb-3 px-2 uppercase tracking-widest">Claims Management</div>
          
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-slate-950 text-white shadow-sm font-semibold' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-white'
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
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm shadow-blue-500/10">
              HE
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">HDFC ERGO</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Assigned Insurer</p>
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
                placeholder="Search claims by policy or ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 mesh-bg-light dot-grid bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Manage and process incoming insurance claims.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-350" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                
                {activeTab === 'queue' && (
                  <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {stats.map((s, i) => (
                        <div key={i} className="premium-card flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">{s.icon}</div>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{s.value}</h3>
                        </div>
                      ))}
                    </div>

                    <div className="premium-card p-0 overflow-hidden border border-slate-200/60 shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                          <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Claim ID</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Policy Holder</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Risk Score</th>
                              <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {claims.length > 0 ? 
                              claims.map((claim) => (
                                  <tr 
                                    key={claim.id} 
                                    onClick={() => navigate(`/claims/${claim.id}`)}
                                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                                  >
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">CLM-{claim.id.toString().padStart(5, '0')}</td>
                                    <td className="px-6 py-4">
                                      <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{claim.user?.name || 'N/A'}</div>
                                      <div className="text-[10px] text-slate-400 font-mono font-medium">
                                        POL-{(claim.insurance_policy || claim.insurancePolicy)?.policy_number || 'N/A'}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={
                                        claim.status === 'Approved' || claim.status === 'Settled' || claim.status === 'Paid' ? 'badge-premium-green' :
                                        claim.status === 'Pending' || claim.status === 'Under Review' || claim.status === 'Submitted' || claim.status === 'investigating' ? 'badge-premium-amber' :
                                        'badge-premium-red'
                                      }>
                                        {claim.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-20">
                                          <div 
                                            className={`h-full rounded-full ${
                                              (claim.fraud_score || 0) >= 70 ? 'bg-rose-500' :
                                              (claim.fraud_score || 0) >= 30 ? 'bg-amber-500' :
                                              'bg-emerald-500'
                                            }`} 
                                            style={{ width: `${claim.fraud_score || 0}%` }}
                                          />
                                        </div>
                                        <span className={`text-xs font-bold ${
                                          (claim.fraud_score || 0) >= 70 ? 'text-rose-600' :
                                          (claim.fraud_score || 0) >= 30 ? 'text-amber-600' :
                                          'text-emerald-600'
                                        }`}>
                                          {claim.fraud_score || 0}%
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3" onClick={(e) => e.stopPropagation()}>
                                      <button 
                                        onClick={() => navigate(`/claims/${claim.id}`)}
                                        className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
                                      >
                                        Inspect
                                      </button>
                                      <span className="text-slate-200">|</span>
                                      <button 
                                        onClick={() => handleUpdateStatus(claim.id, 'Approved')} 
                                        className="text-emerald-600 hover:text-emerald-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
                                      >
                                        Approve
                                      </button>
                                      <span className="text-slate-200">|</span>
                                      <button 
                                        onClick={() => handleUpdateStatus(claim.id, 'Rejected')} 
                                        className="text-rose-600 hover:text-rose-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                    </td>
                                  </tr>
                              ))
                             : (
                              <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">
                                  No claims in queue.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab !== 'queue' && (
                  <motion.div key="placeholder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 premium-card border-dashed border-slate-350">
                    <Shield className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                    <h4 className="text-base font-bold text-slate-900 mb-1">Module Offline</h4>
                    <p className="text-sm text-slate-500 font-medium">The {activeTab} dashboard is currently under configuration.</p>
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
