import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Shield, ChevronRight, Search, 
  Filter, Clock, AlertTriangle, CheckCircle2, Loader2,
  FileText, History, ArrowLeft, ShieldCheck, Briefcase, Archive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function AccidentList() {
  const navigate = useNavigate();
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAccidents();
  }, []);

  const fetchAccidents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/accidents');
      if (res.data) setAccidents(res.data);
    } catch (err) {
      console.error('Failed to fetch accidents', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAccidents = accidents.filter(acc => {
    const reportLabel = acc.report_id ? acc.report_id.toLowerCase() : '';
    const addressLabel = acc.address ? acc.address.toLowerCase() : '';
    const matchesSearch = reportLabel.includes(searchQuery.toLowerCase()) || 
                          addressLabel.includes(searchQuery.toLowerCase());
    const severityLabel = acc.severity ? acc.severity.toLowerCase() : '';
    const matchesFilter = filter === 'all' || severityLabel === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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
      <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0 z-45 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-base font-black font-outfit uppercase tracking-tight text-slate-900">Accident Registry</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/80 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm text-slate-700">
            <History className="w-3.5 h-3.5 text-blue-600" /> {accidents.length} Records Verified
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase font-outfit tracking-tight">Accident History</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Chronological list of all registered accident reports and ledger audit status.
              </p>
            </div>
            <button onClick={() => navigate('/report')} className="premium-btn-primary cursor-pointer bg-slate-950 hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50">
              <ShieldCheck className="w-4 h-4" /> Report Accident
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-250/60 shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Report ID or location..." 
                className="premium-input !pl-11 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              {['all', 'high', 'medium', 'low', 'critical', 'minor', 'moderate'].filter(item => {
                // Deduplicate filters based on severity levels in database
                if (item === 'medium') return false; // Moderate is used
                if (item === 'low') return false; // Minor is used
                return true;
              }).map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)} 
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
                    filter === f 
                      ? 'bg-slate-950 border-transparent text-white shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-350'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredAccidents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccidents.map((acc, i) => (
                <motion.div 
                  key={acc.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/accidents/${acc.id}`)}
                  className="premium-card bg-white/90 backdrop-blur-xl border border-slate-200/80 cursor-pointer hover:border-blue-500 hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        acc.severity?.toLowerCase() === 'high' || acc.severity?.toLowerCase() === 'critical'
                          ? 'bg-rose-50 border-rose-100 text-rose-600' 
                          : acc.severity?.toLowerCase() === 'medium' || acc.severity?.toLowerCase() === 'moderate'
                            ? 'bg-amber-50 border-amber-100 text-amber-600' 
                            : 'bg-blue-50 border-blue-100 text-blue-600'
                      }`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className={
                        acc.severity?.toLowerCase() === 'high' || acc.severity?.toLowerCase() === 'critical'
                          ? 'badge-premium-red' 
                          : acc.severity?.toLowerCase() === 'medium' || acc.severity?.toLowerCase() === 'moderate'
                            ? 'badge-premium-amber' 
                            : 'badge-premium-blue'
                      }>
                        {acc.severity || 'Minor'}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-black font-outfit uppercase tracking-tight text-slate-900 mb-1">
                      INC-{acc.report_id ? acc.report_id.slice(0, 8) : acc.id}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-6 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {acc.address || 'Unknown Location'}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {new Date(acc.created_at).toLocaleDateString()}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 premium-card border-dashed border-slate-300/80 bg-white/40">
              <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-bold font-outfit uppercase tracking-wider text-slate-800 mb-2">No Records Found</h3>
              <p className="text-xs text-slate-500 font-medium mb-6 max-w-sm mx-auto leading-relaxed">
                Your search query or selected filters did not match any registered accident reports.
              </p>
              <button onClick={() => navigate('/report')} className="premium-btn-primary mx-auto cursor-pointer bg-slate-950 text-white">
                Report Accident
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
