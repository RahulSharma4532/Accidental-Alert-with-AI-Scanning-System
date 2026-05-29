import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, Download, ChevronRight, Search, 
  Filter, Calendar, ArrowUpRight, CheckCircle2,
  Clock, AlertCircle, FileText, ArrowLeft, Loader2,
  Landmark, Zap, ShieldCheck, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Footer from '../../components/layout/Footer';

export default function TransactionHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/payments/history');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="badge-premium-green">Completed</span>;
      case 'pending': return <span className="badge-premium-amber">Pending</span>;
      case 'failed': return <span className="badge-premium-red">Failed</span>;
      default: return <span className="badge-premium-blue capitalize">{status}</span>;
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
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Payments Hub</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-3 premium-btn-primary cursor-pointer text-xs py-2 px-4">
            <Download className="w-3.5 h-3.5 shrink-0" /> Export History
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Payment History
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-md leading-relaxed">
              View and manage your platform billing, service upgrades, and payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="premium-card p-6 flex flex-col justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Spent</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">₹{transactions.reduce((acc, tx) => acc + parseFloat(tx.total_amount), 0).toLocaleString()}</p>
            </div>
            <div className="premium-card p-6 flex flex-col justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Subscriptions</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">02</p>
            </div>
            <div className="premium-card p-6 flex flex-col justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tax Residency</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">IN-DOMESTIC</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transactions.map((tx, idx) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-6 flex flex-col justify-between h-56 group cursor-pointer hover:shadow-md transition-all duration-300 border border-slate-200/80"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all duration-350 shadow-sm">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest mb-1">TXN-{tx.transaction_id.slice(0, 10)}</p>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4 truncate capitalize">{tx.service_type.replace('_', ' ')}</h3>
                  
                  <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] text-slate-450 font-medium mb-1">{new Date(tx.created_at).toLocaleDateString()}</p>
                      <p className="text-xl font-black text-slate-950 tracking-tighter">₹{parseFloat(tx.total_amount).toLocaleString()}</p>
                    </div>
                    {tx.invoice && (
                      <button className="p-2 bg-slate-50 hover:bg-slate-950 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-100 cursor-pointer">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {transactions.length === 0 && (
              <div className="col-span-full py-24 text-center premium-card border-dashed border-slate-350 bg-white/80">
                <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-900 mb-1">No Transactions Yet</h3>
                <p className="text-xs text-slate-450 font-medium">No payment records were found for this account.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function Archive({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
  );
}
