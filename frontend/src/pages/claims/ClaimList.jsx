import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, ShieldCheck, Plus, Search, 
  Filter, ChevronRight, Loader2, ArrowLeft, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

export default function ClaimList() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('claims');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [authLoading, isAuthenticated, navigate]);

  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      try {
        const claimsRes = await api.get('/claims');
        if (claimsRes.data) setClaims(claimsRes.data);
      } catch (e) {
        console.error('Failed to fetch claims', e);
      }

      try {
        const policiesRes = await api.get('/policies');
        if (policiesRes.data) setPolicies(policiesRes.data);
      } catch (e) {
        console.error('Failed to fetch policies', e);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status || 'Pending';
    switch (s) {
      case 'Settled': case 'Paid': case 'Active':
        return <span className="badge-premium-green">{s}</span>;
      case 'Under Review': case 'Submitted': case 'Pending':
        return <span className="badge-premium-amber">{s}</span>;
      case 'Expiring Soon': case 'Expired': case 'Rejected':
        return <span className="badge-premium-red">{s}</span>;
      default:
        return <span className="badge-premium-blue">{s}</span>;
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center mesh-bg-light dot-grid">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center mesh-bg-light dot-grid">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 mesh-bg-light dot-grid relative overflow-x-hidden">
      
      {/* Top Header */}
      <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-base font-black font-outfit uppercase tracking-tight text-slate-900">Accident Claims</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/report')}
            className="premium-btn-primary py-2.5 px-5 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> File Payout Claim
          </button>
        </div>
      </header>

      {/* Main Registry Body */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase font-outfit tracking-tight">Claims & Policies</h1>
              <p className="text-xs text-slate-500 font-medium">
                View your claims, active coverage, and settlement status.
              </p>
            </div>
          </div>

          {/* Tabs switcher */}
          <div className="flex bg-white/85 backdrop-blur-xl rounded-xl p-1 border border-slate-200 w-full sm:w-64 shadow-sm">
            <button
              onClick={() => setActiveTab('claims')}
              className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all cursor-pointer ${
                activeTab === 'claims' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-905 hover:bg-slate-50'
              }`}
            >
              Claims
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all cursor-pointer ${
                activeTab === 'policies' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-905 hover:bg-slate-50'
              }`}
            >
              Policies
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'claims' ? (
              <motion.div key="claims" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-250/60 shadow-sm">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search claims by ID or date..." 
                      className="premium-input !pl-11 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <button className="premium-btn-secondary py-2.5 w-full sm:w-auto cursor-pointer">
                    <Filter className="w-4 h-4 mr-1.5" /> Filter Views
                  </button>
                </div>

                {/* Claims registry table */}
                <div className="premium-card p-0 overflow-hidden shadow-sm bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-wider border-b border-slate-200 text-slate-550">
                        <tr>
                          <th className="px-6 py-4">Claim ID</th>
                          <th className="px-6 py-4">Policy Number</th>
                          <th className="px-6 py-4">Filing Date</th>
                          <th className="px-6 py-4">Settlement Value</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {claims.length > 0 ? (
                          claims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                              <td className="px-6 py-4">
                                <div className="font-mono font-black text-slate-950">CLM-{claim.id.toString().padStart(5, '0')}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="font-bold text-slate-905">
                                    {(claim.insurance_policy || claim.insurancePolicy)?.policy_number || 'N/A'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-450 font-mono">{new Date(claim.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 font-black text-slate-950 font-mono">
                                ₹{parseFloat(claim.estimated_amount || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadge(claim.status)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => navigate(`/claims/${claim.id}`)}
                                  className="text-blue-600 hover:text-blue-700 font-black text-[11px] flex items-center gap-2 justify-end ml-auto cursor-pointer transition-colors uppercase tracking-wider"
                                >
                                  Inspect <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-16 text-center text-slate-550">
                              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-350 animate-pulse" />
                              <p className="text-sm font-bold text-slate-800 font-outfit uppercase tracking-wider mb-2">No active claims found</p>
                              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mb-6">No claims have been submitted under this account yet.</p>
                              <button onClick={() => navigate('/report')} className="premium-btn-primary mx-auto cursor-pointer">
                                File Payout Claim
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div key="policies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {policies.length > 0 ? (
                    policies.map((policy) => (
                      <div key={policy.id} className="premium-card bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-slate-350 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-110"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                              <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="badge-premium-green">
                              Active
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 font-outfit uppercase tracking-tight mb-1">{policy.company || 'Unknown Insurer'}</h3>
                          <p className="text-xs font-mono text-slate-400 mb-6">POL-{policy.policy_number}</p>
                          
                          <div className="space-y-3 font-medium text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Coverage Type</span>
                              <span className="font-bold text-slate-800">Comprehensive</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Premium Cycle</span>
                              <span className="font-bold text-slate-800">Annually</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full premium-card border-dashed border-slate-300/80 bg-white/40 text-center py-16">
                      <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-pulse" />
                      <h3 className="text-base font-bold text-slate-805 uppercase mb-2">No Active Policies Registered</h3>
                      <p className="text-xs text-slate-500 font-medium mb-6 max-w-md mx-auto leading-relaxed">Add an active insurance policy under your account profile to access digital verification.</p>
                      <button onClick={() => navigate('/profile')} className="premium-btn-secondary mx-auto cursor-pointer">
                        Go to Profile
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
