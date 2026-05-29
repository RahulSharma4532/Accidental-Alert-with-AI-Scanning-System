import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, Clock, CheckCircle2, AlertTriangle, 
  Plus, Search, ChevronRight, MessageSquare, 
  Calendar, FileText, Scale, Loader2, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

export default function DisputeList() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [authLoading, isAuthenticated, navigate]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDisputes();
    }
  }, [isAuthenticated]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/disputes');
      if (response.data) setDisputes(response.data);
    } catch (error) {
      console.error('Failed to fetch disputes', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return 'badge-premium-green';
      case 'Hearing': return 'badge-premium-blue';
      case 'Under Review': return 'badge-premium-amber';
      case 'Mediator Assigned': return 'badge-premium-blue';
      default: return 'badge-premium-blue';
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-lg font-bold text-slate-900 font-outfit">Disputes & Mediation</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/disputes/new')}
            className="premium-btn-accent py-2.5 px-5 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Submit Dispute
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 animate-subtle-fade">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">Disputes & Mediation</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Resolve claim disagreements and issues through active mediation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="premium-card">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Success Metric</p>
              <p className="text-3xl font-bold text-slate-900 font-outfit">92.4%</p>
            </div>
            <div className="premium-card">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Cases</p>
              <p className="text-3xl font-bold text-slate-900 font-outfit">{disputes.filter(d => d.status !== 'Resolved').length}</p>
            </div>
            <div className="premium-card border-l-4 border-l-slate-900">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Avg Resolution</p>
              <p className="text-3xl font-bold text-slate-900 font-outfit">14 Days</p>
            </div>
          </div>

          <div className="premium-card p-0 overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200/80">
            <div className="p-4 border-b border-slate-200/80 bg-white/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search active disputes..." 
                  className="premium-input !pl-11 py-2.5"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-150">
                  <tr>
                    <th className="px-6 py-4">Dispute Case</th>
                    <th className="px-6 py-4">Linked Claim</th>
                    <th className="px-6 py-4">Opposing Party</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disputes.length > 0 ? (
                    disputes.map((dispute) => (
                      <tr 
                        key={dispute.id} 
                        onClick={() => navigate(`/disputes/${dispute.id}`)}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/60 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors shrink-0">
                              <Scale className="w-4.5 h-4.5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">DSP-{dispute.id.toString().padStart(5, '0')}</p>
                              <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(dispute.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">Claim CLM-{dispute.claim_id}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{dispute.party_b || 'Insurance Company'}</td>
                        <td className="px-6 py-4">
                          <span className={getStatusStyle(dispute.status)}>
                            {dispute.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/disputes/${dispute.id}`);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-2 justify-end ml-auto cursor-pointer transition-colors group-hover:translate-x-1 duration-300"
                          >
                            Inspect <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-200/60">
                          <Gavel className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">No active disputes found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
