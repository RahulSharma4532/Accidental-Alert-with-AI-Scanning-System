import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const MOCK_CLAIMS = [
  { id: 'CLM-99281', user: 'Amit Sharma', date: 'May 05, 2024', amount: '₹45,000', vehicle: 'Tesla Model 3', status: 'processing', severity: 'Medium' },
  { id: 'CLM-99275', user: 'Priya Patel', date: 'May 04, 2024', amount: '₹12,500', vehicle: 'Honda City', status: 'pending', severity: 'Low' },
  { id: 'CLM-99260', user: 'Rahul Verma', date: 'May 02, 2024', amount: '₹2,80,000', vehicle: 'BMW X5', status: 'awaiting_inspection', severity: 'High' },
  { id: 'CLM-99245', user: 'Sonia Khan', date: 'Apr 28, 2024', amount: '₹62,000', vehicle: 'Hyundai Creta', status: 'approved', severity: 'Medium' },
];

export default function ClaimQueue() {
  const [claims] = useState(MOCK_CLAIMS);
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (['approved', 'completed', 'active', 'success'].includes(s)) {
      return <span className="badge-premium-green">Approved</span>;
    } else if (['pending', 'awaiting', 'awaiting_inspection'].includes(s)) {
      return <span className="badge-premium-amber">Pending</span>;
    } else if (['processing', 'in_progress'].includes(s)) {
      return <span className="badge-premium-blue">Processing</span>;
    } else {
      return <span className="badge-premium-red">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* HEADER & NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition-all duration-200 border border-slate-200 shadow-sm hover:shadow cursor-pointer mb-6 text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-50/80 border border-blue-100/80 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Insurer Dashboard Active
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Claim <span className="text-slate-400 font-medium">Queue</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md">
              Review and process incoming insurance claims. Priority is given to high-severity incidents and platinum users.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Queue Status</p>
              <p className="text-sm font-bold text-emerald-500">Live • 12 Active</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS & FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="premium-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Awaiting Review</p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">08</p>
          </div>
          <div className="premium-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">High Severity</p>
            <p className="text-3xl font-extrabold text-rose-600 tracking-tight">03</p>
          </div>
          <div className="premium-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Payout (MoM)</p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">₹8.2L</p>
          </div>
          <div className="premium-card bg-slate-50 border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Efficiency Rate</p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">94.2%</p>
          </div>
        </div>

        {/* SEARCH & QUEUE TABLE */}
        <div className="premium-card p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex-1 max-w-md">
              <Input 
                placeholder="Search by Claim ID or Driver Name..." 
                icon={Search}
                className="premium-input bg-slate-50/50"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" icon={Filter} className="cursor-pointer">Filter Queue</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Claim Details</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Claim Value</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr 
                    key={claim.id} 
                    onClick={() => navigate(`/claims/${claim.id.replace('CLM-', '')}`)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5">{claim.id}</p>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{claim.user}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">{claim.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-800">{claim.vehicle}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Verified Policy</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-slate-900">{claim.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider
                        ${claim.severity === 'High' ? 'bg-red-50 text-rose-600 border border-red-100' : 
                          claim.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                          'bg-blue-50 text-blue-600 border border-blue-100'}
                      `}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {claim.severity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(claim.status)}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Eye} 
                        onClick={() => navigate(`/claims/${claim.id.replace('CLM-', '')}`)} 
                        className="cursor-pointer hover:bg-slate-950 hover:text-white"
                      >
                        Review Claim
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

