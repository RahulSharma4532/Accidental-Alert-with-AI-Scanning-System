import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, FileText, 
  CheckCircle2, AlertCircle, Trash2, Loader2,
  Zap, Paperclip
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

export default function NewClaim() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recentAccidents, setRecentAccidents] = useState([]);
  const [policies, setPolicies] = useState([]);
  
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [claimType, setClaimType] = useState('Own Damage');
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState('');
  const [files, setFiles] = useState([]);
  const [reportResult, setReportResult] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchInitialData = async () => {
    try {
      const [accRes, polRes] = await Promise.all([
        api.get('/accidents'),
        api.get('/policies')
      ]);
      if (accRes.data) setRecentAccidents(accRes.data);
      if (polRes.data) setPolicies(polRes.data);
    } catch (error) {
      console.error('Failed to load claim data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, idx) => idx !== index));
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('accident_id', selectedAccident);
    formData.append('insurance_policy_id', selectedPolicy);
    formData.append('claim_type', claimType);
    formData.append('description', description);
    formData.append('estimated_amount', estimate || 0);
    
    files.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });

    try {
      const response = await api.post('/claims', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReportResult(response.data.claim);
      setStep(5);
    } catch (error) {
      console.error('Claim submission failed', error);
      alert('Failed to submit claim. Make sure all files are valid and under 10MB.');
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-base font-black font-outfit uppercase tracking-tight text-slate-900">New Claim Portal</h2>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-450">Step {step} of 4</span>
          <div className="w-32 h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
            <div className="h-full bg-slate-950 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase font-outfit tracking-tight">Submit New Claim</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Initiate your payouts processing. Provide the associated accident log and active policy coverage.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: Link Accident Report */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-450">Select Accident Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentAccidents.length > 0 ? recentAccidents.map((acc) => (
                    <button 
                      key={acc.id}
                      onClick={() => setSelectedAccident(acc.id)}
                      className={`text-left flex flex-col justify-between h-40 transition-all duration-300 ${
                        selectedAccident === acc.id 
                          ? 'premium-card border-blue-500 bg-blue-50/10 shadow-md scale-[1.01] ring-1 ring-blue-500/30 cursor-pointer' 
                          : 'premium-card bg-white/80 border-slate-200/80 cursor-pointer hover:border-slate-350 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedAccident === acc.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border border-slate-200/60 text-slate-500'
                        }`}>
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        {selectedAccident === acc.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-black font-outfit uppercase tracking-tight text-slate-900">INC-{acc.report_id.slice(0, 8)}</p>
                        <p className="text-xs text-slate-400 font-mono mt-1">{new Date(acc.created_at).toLocaleDateString()}</p>
                      </div>
                    </button>
                  )) : (
                    <div className="md:col-span-2 text-center py-16 premium-card border-dashed border-slate-300/80 bg-white/40">
                      <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-4 animate-pulse" />
                      <p className="text-sm font-bold text-slate-800 font-outfit uppercase tracking-wider mb-2">No Recent Reports Found</p>
                      <button onClick={() => navigate('/report')} className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">File an Accident Report</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Policy Selection */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-450">Select Insurance Policy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {policies.map((policy) => (
                    <button 
                      key={policy.id}
                      onClick={() => setSelectedPolicy(policy.id)}
                      className={`text-left flex flex-col justify-between h-40 transition-all duration-300 ${
                        selectedPolicy === policy.id 
                          ? 'premium-card border-blue-500 bg-blue-50/10 shadow-md scale-[1.01] ring-1 ring-blue-500/30 cursor-pointer' 
                          : 'premium-card bg-white/80 border-slate-200/80 cursor-pointer hover:border-slate-350 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedPolicy === policy.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border border-slate-200/60 text-slate-500'
                        }`}>
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        {selectedPolicy === policy.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-black font-outfit uppercase tracking-tight text-slate-900">{policy.company}</p>
                        <p className="text-xs text-slate-400 font-mono mt-1">{policy.policy_number}</p>
                      </div>
                    </button>
                  ))}
                  {policies.length === 0 && (
                     <div className="col-span-full text-center py-16 premium-card border-dashed border-slate-300/80 bg-white/40">
                      <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-4 animate-pulse" />
                      <p className="text-sm font-bold text-slate-800 font-outfit uppercase tracking-wider mb-2">No Active Policies Found</p>
                      <button onClick={() => navigate('/profile')} className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">Add a Policy</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Details & Document Upload */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-450">Claim Details & Documents</h2>
                <div className="grid md:grid-cols-2 gap-6 premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Claim Type</label>
                      <select value={claimType} onChange={(e) => setClaimType(e.target.value)} className="premium-input cursor-pointer">
                        <option>Own Damage</option>
                        <option>Third Party</option>
                        <option>Theft</option>
                        <option>Fire</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Estimated Claim Amount (₹)</label>
                      <input 
                        type="number" 
                        value={estimate}
                        onChange={(e) => setEstimate(e.target.value)}
                        className="premium-input"
                        placeholder="Amount in Rupees"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Claim Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="premium-input h-[124px] resize-none"
                      placeholder="Describe what happened and details of the damage..."
                    />
                  </div>
                </div>

                <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Upload Supporting Documents</h3>
                  <p className="text-xs text-slate-500 font-medium">Upload FIR copy, repair bills/estimates, or other bills. All files are saved securely.</p>
                  
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-slate-350 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-all duration-300 text-xs font-black uppercase tracking-widest text-slate-700">
                      <Paperclip className="w-4 h-4 text-slate-500" />
                      Attach Document
                      <input type="file" multiple onChange={handleFileChange} className="hidden" />
                    </label>

                    {files.length > 0 && (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {files.map((file, index) => (
                          <div key={index} className="flex justify-between items-center p-3 text-xs">
                            <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-450">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeFile(index)} 
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Review */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center max-w-xl mx-auto">
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tight mb-2">Final Review</h2>
                <p className="text-xs text-slate-500 font-medium mb-8">Review accident and claim details before submitting to the insurance provider.</p>

                <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 text-left space-y-4 shadow-sm p-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">Insurance Company</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">{policies.find(p => p.id === selectedPolicy)?.company || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">Accident Report</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">INC-{recentAccidents.find(a => a.id === selectedAccident)?.report_id.slice(0, 8) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">Documents Attached</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">{files.length} Files</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Claim Amount</span>
                    <span className="text-2xl font-black text-slate-950 font-mono">₹{parseFloat(estimate || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === 5 && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 max-w-xl mx-auto">
                <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tight mb-2">Claim Submitted</h2>
                <p className="text-xs text-slate-500 font-medium mb-8 font-sans">Claim successfully submitted to the insurance provider.</p>
                
                <button onClick={() => navigate('/claims')} className="premium-btn-primary w-full py-3.5 cursor-pointer">
                  View My Claims
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* FOOTER WIZARD CONTROLS */}
      {step <= 4 && (
        <footer className="p-4 lg:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex items-center justify-between sticky bottom-0 z-50 shadow-lg">
          <button 
            onClick={step === 1 ? () => navigate(-1) : handleBack}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          <button 
            onClick={step === 4 ? handleSubmit : handleNext} 
            disabled={isSubmitting || (step === 1 && !selectedAccident) || (step === 2 && !selectedPolicy)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              (step === 1 && !selectedAccident) || (step === 2 && !selectedPolicy) 
                ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed' 
                : step === 4 
                  ? 'premium-btn-accent px-6 py-3.5 cursor-pointer' 
                  : 'premium-btn-primary px-6 py-3.5 cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Submitting...' : step === 4 ? 'Submit Claim' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      )}

    </div>
  );
}
