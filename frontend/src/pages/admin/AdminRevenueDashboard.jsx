import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, CreditCard, DollarSign, 
  ArrowUpRight, ArrowDownRight, PieChart, 
  Download, Calendar, Filter, MoreHorizontal,
  Zap, Scale, Gavel, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../store/AuthContext';

export default function AdminRevenueDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/admin/revenue/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    { label: 'Total Revenue', value: `₹${stats?.total_revenue?.toLocaleString() || '0'}`, change: '+12.5%', icon: <DollarSign className="w-6 h-6" />, color: 'bg-emerald-500' },
    { label: 'Net Earnings', value: `₹${stats?.net_revenue?.toLocaleString() || '0'}`, change: '+8.2%', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Platform GST', value: `₹${stats?.total_tax?.toLocaleString() || '0'}`, change: '+14.1%', icon: <Receipt className="w-6 h-6 text-white" />, color: 'bg-indigo-600' },
    { label: 'Active Subscriptions', value: '1,284', change: '+18.7%', icon: <Users className="w-6 h-6" />, color: 'bg-amber-500' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER & BACK BUTTON */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition-all duration-200 border border-slate-200 shadow-sm hover:shadow cursor-pointer mb-6 text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Revenue Dashboard</h1>
            <p className="text-slate-500 mt-2 font-medium">Financial overview, tax compliance, and growth analytics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <button className="px-4 py-2 bg-slate-950 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow cursor-pointer">Real-time</button>
              <button className="px-4 py-2 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 cursor-pointer">Historical</button>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer">
              <Download className="w-4 h-4" /> Financial Report
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="premium-card flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 ${kpi.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-inherit/10`}>
                  {kpi.icon}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">{kpi.value}</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-100/80 w-fit">
                <TrendingUp className="w-3 h-3" />
                {kpi.change}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 premium-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Revenue Growth</h3>
              <select className="premium-input bg-slate-50/50 max-w-[150px] py-2 px-3 text-xs cursor-pointer">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>All Time</option>
              </select>
            </div>
            
            {/* Simulated Chart Placeholder */}
            <div className="h-80 w-full bg-slate-50/80 rounded-2xl relative flex items-end justify-between px-8 pb-8 overflow-hidden border border-slate-100">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              {[60, 80, 45, 90, 100, 75].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                  className="w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-2xl relative group cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    ₹{((h * 1000) / 10).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between px-8 mt-6">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
                <span key={m} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m}</span>
              ))}
            </div>
          </div>

          {/* Service Breakdown */}
          <div className="premium-card p-8">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Service Share</h3>
            <div className="space-y-6">
              {stats?.service_breakdown?.map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                        item.service_type === 'premium_dispute' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        item.service_type === 'priority_claim' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        item.service_type === 'legal_consultation' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {item.service_type === 'premium_dispute' && <Scale className="w-4 h-4" />}
                        {item.service_type === 'priority_claim' && <Zap className="w-4 h-4" />}
                        {item.service_type === 'legal_consultation' && <Gavel className="w-4 h-4" />}
                        {item.service_type === 'doc_verification' && <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-slate-700 capitalize">{item.service_type.replace('_', ' ')}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{parseFloat(item.total).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '70%' }}
                      transition={{ delay: 0.8 + (idx * 0.1), duration: 1 }}
                      className={`h-full rounded-full ${
                        item.service_type === 'premium_dispute' ? 'bg-blue-500' :
                        item.service_type === 'priority_claim' ? 'bg-amber-500' :
                        item.service_type === 'legal_consultation' ? 'bg-emerald-500' :
                        'bg-rose-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="mt-12 premium-card p-0 overflow-hidden border border-slate-200/60 shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Platform Transactions</h3>
            <button className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider cursor-pointer">View All Transactions</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider">Transaction</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider">User</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors cursor-pointer group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-500/5">AA</div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">TXN-98721{i}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Dispute</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-650">Rahul Sharma</td>
                    <td className="px-8 py-5">
                      <span className="badge-premium-green">Completed</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-400">22 May, 2026</td>
                    <td className="px-8 py-5 font-extrabold text-slate-900">₹4,999.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Receipt(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5V6.5" />
    </svg>
  )
}

