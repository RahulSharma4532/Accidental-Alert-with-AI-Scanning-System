import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, User, Phone, 
  CheckCircle2, Clock, AlertCircle, Download, 
  ChevronRight, ShieldCheck, Loader2,
  Brain, Cpu
} from 'lucide-react';
import api from '../../utils/api';

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [assessing, setAssessing] = useState(false);

  useEffect(() => {
    fetchClaimDetails();
  }, [id]);

  const handleAssess = async () => {
    if (!claim?.accident?.id) return;
    try {
      setAssessing(true);
      const res = await api.post(`/accidents/${claim.accident.id}/assess`);
      setClaim(prev => ({
        ...prev,
        accident: res.data.accident
      }));
    } catch (error) {
      console.error('AI assessment failed', error);
      alert('Failed to trigger AI damage assessment.');
    } finally {
      setAssessing(false);
    }
  };

  const fetchClaimDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/claims/${id}`);
      setClaim(res.data);
    } catch (error) {
      console.error('Failed to load claim details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      setDownloadingId(doc.id);
      const response = await api.get(`/claims/${claim.id}/documents/${doc.id}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const filename = doc.file_path.split('/').pop() || `${doc.doc_type}.enc`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to securely download and decrypt this document.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center mesh-bg-light dot-grid">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center mesh-bg-light dot-grid">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-black text-slate-900 mb-2 font-outfit uppercase">Claim Not Found</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-sm font-medium">The requested claim details could not be retrieved from the server.</p>
        <button onClick={() => navigate(-1)} className="premium-btn-primary cursor-pointer">Go Back</button>
      </div>
    );
  }

  const steps = ['Submitted', 'Under Review', 'Disputed', 'Settled'];
  const getStepIndex = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'pending' || s === 'submitted') return 0;
    if (s === 'under review' || s === 'assigned' || s === 'inspection') return 1;
    if (s === 'disputed') return 2;
    if (s === 'settled' || s === 'paid') return 3;
    return 1; // Default to review
  };

  const currentStep = getStepIndex(claim.status);
  const policy = claim.insurance_policy || claim.insurancePolicy;

  // AI Fraud Visual parameters
  const getFraudColor = (score) => {
    if (score >= 70) return { text: 'text-rose-605', bg: 'bg-rose-50/70', border: 'border-rose-200/80', shield: 'text-rose-500', bar: 'bg-rose-500' };
    if (score >= 30) return { text: 'text-amber-605', bg: 'bg-amber-50/70', border: 'border-amber-200/80', shield: 'text-amber-500', bar: 'bg-amber-500' };
    return { text: 'text-emerald-605', bg: 'bg-emerald-50/70', border: 'border-emerald-200/80', shield: 'text-emerald-500', bar: 'bg-emerald-500' };
  };
  const fraudStyle = getFraudColor(claim.fraud_score || 0);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'settled':
      case 'paid':
        return 'badge-premium-green';
      case 'rejected':
      case 'denied':
        return 'badge-premium-red';
      case 'under review':
      case 'pending':
      default:
        return 'badge-premium-amber';
    }
  };

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
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-base font-black font-outfit uppercase tracking-tight text-slate-900">Claim File Audit</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="premium-btn-secondary px-4 py-2.5 text-[10px] cursor-pointer flex items-center gap-3"
          >
            <Download className="w-3.5 h-3.5 shrink-0" /> Export Report
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase font-outfit tracking-tight">Claim Details</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Verification history and details for CLM-{(claim.claim_id || claim.id.toString()).slice(0, 8)}.
              </p>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm relative overflow-hidden p-6">
            <div className="absolute top-6 right-6">
              <span className={getStatusBadgeClass(claim.status)}>
                {claim.status || 'Under Review'}
              </span>
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Claim Progress Status</h2>
            
            <div className="flex flex-wrap items-center gap-4 sm:justify-between relative">
              {steps.map((step, idx) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all duration-350 ${
                    idx < currentStep 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : idx === currentStep 
                        ? 'bg-white border-slate-950 text-slate-950 border-2 font-extrabold shadow-sm' 
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wider ${idx <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step}
                  </span>
                  {idx < steps.length - 1 && <div className="hidden sm:block w-12 lg:w-20 h-px bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* Activity Timeline */}
              <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm p-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-6">Activity History</h2>
                <div className="space-y-8 relative">
                  <div className="absolute top-2 bottom-0 left-[15px] w-px bg-slate-200" />
                  
                  <div className="relative pl-10">
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 bg-white border-2 rounded-full flex items-center justify-center z-10 border-slate-900">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Claim Registered</h3>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-550 font-medium leading-relaxed">
                      Claim submitted via portal. Accident details checked.
                    </p>
                  </div>

                  {claim.status !== 'Pending' && (
                    <div className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 bg-white border-2 rounded-full flex items-center justify-center z-10 border-slate-900">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Verification Review</h3>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          {new Date(claim.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-550 font-medium leading-relaxed">
                        Currently undergoing review. Fraud check completed.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Secure Vault Documents */}
              <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm p-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">Evidence & Documents</h2>
                <p className="text-xs text-slate-450 font-medium mb-6">Files are encrypted for security. Documents are decrypted automatically when downloaded.</p>

                {claim.documents && claim.documents.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {claim.documents.map((doc) => {
                      const name = doc.file_path.split('/').pop() || `${doc.doc_type}.enc`;
                      return (
                        <div key={doc.id} className="flex justify-between items-center p-4">
                          <div className="flex items-center gap-3 truncate">
                            <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-xs font-bold text-slate-900 block truncate">{name}</span>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">
                                Type: {doc.doc_type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={doc.verified ? 'badge-premium-green' : 'badge-premium-amber'}>
                              {doc.verified ? 'Verified' : 'Reviewing'}
                            </span>
                            <button
                              onClick={() => handleDownload(doc)}
                              disabled={downloadingId === doc.id}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                              title="Decrypt & Download"
                            >
                              {downloadingId === doc.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                    <FileText className="w-8 h-8 text-slate-350 mx-auto mb-3" />
                    <p className="text-xs font-medium text-slate-450">No document attachments found.</p>
                  </div>
                )}
              </div>

              {/* Data Grid */}
              <div className="premium-card p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-outfit">Claim Information</h2>
                </div>
                <div className="grid grid-cols-2 p-6 gap-6 bg-white">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Accident Report Ref</p>
                    <p className="text-xs font-bold text-slate-900">
                      ACC-{claim.accident?.report_id ? claim.accident.report_id.slice(0, 8) : claim.accident_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Policy Number</p>
                    <p className="text-xs font-bold text-slate-900">{policy?.policy_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Claim Amount</p>
                    <p className="text-sm font-black text-blue-600 font-mono">
                      ₹{parseFloat(claim.estimated_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Submission Date</p>
                    <p className="text-xs font-bold text-slate-900 font-mono">
                      {new Date(claim.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              
              {/* AI Fraud Shield Card */}
              <div className={`premium-card border ${fraudStyle.bg} ${fraudStyle.border} shadow-sm p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className={`w-6 h-6 ${fraudStyle.shield}`} />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">AI Fraud Check</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                  Real-time fraud verification and risk analysis.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider">Risk Factor</span>
                    <span className={`text-base font-black font-mono ${fraudStyle.text}`}>{claim.fraud_score || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100/50 border border-slate-200/20 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${fraudStyle.bar} transition-all duration-500`} style={{ width: `${claim.fraud_score || 0}%` }} />
                  </div>
                </div>
              </div>

              {/* AI Damage Assessment Card */}
              {claim.accident && (
                <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                        <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">AI Damage Scan</h3>
                        <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase mt-0.5">AI Model V2.8</p>
                      </div>
                    </div>
                    <span className={claim.accident.ai_assessment_status === 'completed' ? 'badge-premium-green' : 'badge-premium-amber'}>
                      {claim.accident.ai_assessment_status || 'Pending'}
                    </span>
                  </div>

                  {claim.accident.ai_assessment_status === 'completed' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-left">
                          <span className="text-[9px] font-black text-slate-405 uppercase tracking-wider block mb-1">Severity</span>
                          <span className={
                            claim.accident.ai_damage_severity === 'Minor' ? 'badge-premium-green' :
                            claim.accident.ai_damage_severity === 'Moderate' ? 'badge-premium-amber' :
                            'badge-premium-red'
                          }>
                            {claim.accident.ai_damage_severity}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-left">
                          <span className="text-[9px] font-black text-slate-405 uppercase tracking-wider block mb-1">Action</span>
                          <span className={
                            claim.accident.ai_damage_severity === 'Minor' || claim.accident.ai_damage_severity === 'Moderate'
                              ? 'badge-premium-green'
                              : claim.accident.ai_damage_severity === 'High'
                              ? 'badge-premium-amber'
                              : 'badge-premium-red'
                          }>
                            {claim.accident.ai_damage_severity === 'Minor' || claim.accident.ai_damage_severity === 'Moderate' ? 'Repairable' :
                             claim.accident.ai_damage_severity === 'High' ? 'Towing Req.' : 'Total Loss'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                        <span className="text-[9px] font-black text-slate-405 uppercase tracking-wider block mb-1">Repair Cost Estimate</span>
                        <div className="text-lg font-black text-slate-900 tracking-tight font-mono">
                          ₹{parseFloat(claim.accident.ai_estimated_cost_min || 0).toLocaleString('en-IN')} - ₹{parseFloat(claim.accident.ai_estimated_cost_max || 0).toLocaleString('en-IN')}
                        </div>
                        <span className="text-[9px] text-slate-500 font-medium leading-relaxed block mt-0.5">
                          Verified estimate based on optical signature analysis.
                        </span>
                      </div>

                      {claim.accident.ai_affected_parts && Object.keys(claim.accident.ai_affected_parts).length > 0 && (
                        <div className="space-y-3 pt-1">
                          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Damage Analysis</span>
                          <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                            {Object.entries(claim.accident.ai_affected_parts).map(([part, desc]) => {
                              const dmgPct = parseInt(desc.match(/\d+/) || [0], 10);
                              return (
                                <div key={part} className="text-xs space-y-1">
                                  <div className="flex justify-between font-bold text-slate-800">
                                    <span>{part}</span>
                                    <span className={dmgPct > 50 ? 'text-rose-600 font-bold' : 'text-slate-500'}>{desc}</span>
                                  </div>
                                  <div className="w-full bg-slate-100 border border-slate-200/10 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${
                                      dmgPct > 70 ? 'bg-rose-500' : dmgPct > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`} style={{ width: `${dmgPct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={handleAssess}
                        disabled={assessing}
                        className="premium-btn-secondary w-full py-2.5 text-[10px] cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {assessing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recalculating...
                          </>
                        ) : (
                          <>
                            <Cpu className="w-3.5 h-3.5" /> Re-run Damage Analysis
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Cpu className="w-8 h-8 mx-auto text-slate-350 mb-2 animate-pulse" />
                      <p className="text-xs text-slate-450 font-medium leading-relaxed mb-4">
                        AI damage scanning is currently pending.
                      </p>
                      <button 
                        onClick={handleAssess}
                        disabled={assessing}
                        className="premium-btn-primary mx-auto px-4 py-2 cursor-pointer flex items-center gap-1.5"
                      >
                        {assessing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Ingesting...
                          </>
                        ) : (
                          <>
                            <Cpu className="w-3.5 h-3.5" /> Run Damage Scan
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Surveyor Assigned Card */}
              {claim.surveyor_name ? (
                <div className="premium-card bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Surveyor Assigned</h3>
                      <p className="text-xs text-slate-450 font-medium">Verification Officer</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-450">Officer</span>
                      <span className="font-bold text-slate-900">{claim.surveyor_name}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-450">Contact</span>
                      <span className="font-bold text-slate-900">{claim.surveyor_phone}</span>
                    </div>
                  </div>
                  <a 
                    href={`tel:${claim.surveyor_phone}`}
                    className="premium-btn-primary w-full py-2.5 text-xs cursor-pointer flex items-center justify-center gap-3"
                  >
                    <Phone className="w-4 h-4 shrink-0" /> Call Surveyor
                  </a>
                </div>
              ) : (
                <div className="premium-card bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">Surveyor Assignment</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Insurance provider review pending. A surveyor will be assigned after document verification.
                  </p>
                </div>
              )}

              {/* Dispute Protocol Trigger */}
              <div className="premium-card p-4 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm">
                <button 
                  onClick={() => navigate(`/disputes/new?claim_id=${claim.id}`)}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-rose-700">Raise Dispute</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

