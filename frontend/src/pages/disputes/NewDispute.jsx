import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Gavel, Scale, FileText, 
  AlertCircle, CheckCircle2, MessageSquare, Info, 
  HelpCircle, Loader2, IndianRupee, ShieldAlert,
  Landmark, Zap, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

export default function NewDispute() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [reason, setReason] = useState('Underpayment');
  const [expectedAmount, setExpectedAmount] = useState('');
  const [explanation, setExplanation] = useState('');
  const [reportResult, setReportResult] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClaims();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await api.get('/claims');
      if (response.data) setClaims(response.data);
    } catch (error) {
      console.error('Failed to load claims', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/disputes', {
        claim_id: selectedClaim,
        reason: reason,
        expected_amount: expectedAmount,
        explanation: explanation
      });
      setReportResult(response.data.dispute);
      setStep(4);
    } catch (error) {
      console.error('Dispute submission failed', error);
      alert('Failed to raise dispute.');
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-lg font-bold text-slate-900 font-outfit">New Dispute</h2>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-500">Step {step} of 3</span>
          <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-950 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 animate-subtle-fade">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">Start Dispute</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Start the dispute process. Select the claim for verification.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: Link Claim */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Select Claim Reference</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {claims.filter(c => c.status !== 'Resolved').length > 0 ? claims.filter(c => c.status !== 'Resolved').map((claim) => (
                    <button 
                      key={claim.id}
                      onClick={() => setSelectedClaim(claim.id)}
                      className={`text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-40 cursor-pointer ${
                        selectedClaim === claim.id 
                          ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500/10' 
                          : 'border-slate-200/80 bg-white/70 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          selectedClaim === claim.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        {selectedClaim === claim.id && <CheckCircle2 className="w-5 h-5 text-blue-600 animate-pulse" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">CLM-{claim.id.toString().padStart(5, '0')}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Policy: {claim.policy_number}</p>
                      </div>
                    </button>
                  )) : (
                    <div className="md:col-span-2 text-center py-20 bg-white/70 backdrop-blur-md rounded-2xl border border-dashed border-slate-200 shadow-sm">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-900 mb-2">No Eligible Claims</p>
                      <button onClick={() => navigate('/claims')} className="premium-btn-secondary px-5 py-2.5 mx-auto mt-4 cursor-pointer">
                        Return to Claims List
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Dispute Details</h2>
                <div className="grid md:grid-cols-2 gap-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Basis of Dispute</label>
                      <select value={reason} onChange={(e) => setReason(e.target.value)} className="premium-input cursor-pointer">
                        <option>Underpayment</option>
                        <option>Claim Rejection</option>
                        <option>Unreasonable Delay</option>
                        <option>Liability Contest</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Expected Amount (₹)</label>
                      <input 
                        type="number" 
                        value={expectedAmount}
                        onChange={(e) => setExpectedAmount(e.target.value)}
                        className="premium-input"
                        placeholder="Value in Rupees"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Reason/Explanation</label>
                    <textarea 
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      className="premium-input h-[134px] resize-none"
                      placeholder="Provide detailed reason..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center max-w-xl mx-auto">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200/60 shadow-sm">
                  <Scale className="w-8 h-8 text-slate-900" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Review & Submit</h2>
                <p className="text-sm font-medium text-slate-500 mb-8">Review details before submitting to the mediator.</p>

                <div className="premium-card text-left space-y-4 bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                    <span className="text-sm font-medium text-slate-500">Claim Reference</span>
                    <span className="text-sm font-bold text-slate-900 font-outfit">CLM-{selectedClaim?.toString().padStart(5, '0')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                    <span className="text-sm font-medium text-slate-500">Basis</span>
                    <span className="text-sm font-bold text-slate-900 font-outfit">{reason}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Expected Recovery</span>
                    <span className="text-xl font-bold text-blue-600 font-outfit">₹{parseFloat(expectedAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === 4 && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 max-w-xl mx-auto">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Dispute Submitted</h2>
                <p className="text-sm font-medium text-slate-500 mb-8">Dispute DSP-{reportResult?.id?.toString().padStart(5, '0') || '12345'} successfully submitted to the mediator/court.</p>
                
                <button onClick={() => navigate('/disputes')} className="premium-btn-primary w-full py-3.5 cursor-pointer">
                  Track Dispute Status
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* FOOTER WIZARD CONTROLS */}
      {step <= 3 && (
        <footer className="p-4 lg:p-6 bg-white/80 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-between sticky bottom-0 z-50">
          <button 
            onClick={step === 1 ? () => navigate(-1) : handleBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={step === 3 ? handleSubmit : handleNext} 
            disabled={isSubmitting || (step === 1 && !selectedClaim)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              (step === 1 && !selectedClaim) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
              step === 3 ? 'premium-btn-accent shadow-md shadow-blue-500/20' : 
              'premium-btn-primary'
            }`}
          >
            {isSubmitting ? 'Submitting...' : step === 3 ? 'Submit Dispute' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      )}

    </div>
  );
}
