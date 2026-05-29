import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Scale, Clock, CheckCircle2, 
  FileText, MessageSquare, Video, ShieldCheck, 
  User, CreditCard, Calendar, MapPin, Loader2,
  AlertCircle, Download, ExternalLink, Send,
  Award, FileSignature, Eraser
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import api from '../../utils/api';

export default function MediatorDisputeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const sigCanvas = useRef(null);
  const [resolutionData, setResolutionData] = useState({
    resolution_summary: '',
    awarded_amount: 0,
    signature_data: null
  });

  useEffect(() => {
    fetchDisputeDetail();
  }, [id]);

  const fetchDisputeDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/disputes/${id}`);
      setDispute(res.data);
      setResolutionData({
        ...resolutionData,
        awarded_amount: res.data.expected_amount
      });
    } catch (error) {
      console.error('Failed to load dispute', error);
      alert('Error loading case data');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/mediator/disputes/${id}/status`, { status: newStatus });
      fetchDisputeDetail();
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleResolve = async () => {
    if (!resolutionData.resolution_summary) {
      alert('Please provide a resolution summary');
      return;
    }
    
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide your digital signature');
      return;
    }

    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    
    try {
      await api.post(`/mediator/disputes/${id}/resolve`, {
        ...resolutionData,
        signature_data: signature
      });
      setShowResolveModal(false);
      fetchDisputeDetail();
      alert('Dispute resolved successfully with digital signature!');
    } catch (error) {
      alert('Failed to resolve dispute');
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await api.get(`/claims/${dispute.claim_id}/documents/${doc.id}`, {
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex items-center justify-center flex-col gap-6">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opening Case Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 mesh-bg-light dot-grid p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAV */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          
          <div className="flex items-center gap-4">
            <span className={dispute.status === 'Resolved' ? 'badge-premium-green' : 'badge-premium-amber'}>
              {dispute.status}
            </span>
            <div className="h-10 w-px bg-slate-200" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference: <span className="text-slate-900 font-outfit">{dispute.dispute_id}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: CASE INFO */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* MAIN CARD */}
            <div className="premium-card bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm p-10 relative overflow-hidden animate-subtle-fade">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-slate-400 pointer-events-none">
                 <Scale className="w-64 h-64" />
               </div>

               <div className="relative z-10">
                 <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight mb-4">{dispute.reason}</h1>
                 <p className="text-base font-medium text-slate-500 leading-relaxed max-w-2xl mb-10">
                   {dispute.description || "The claimant has raised a dispute regarding the settlement amount offered by the insurance provider. They are requesting a higher payout based on the evidence provided."}
                 </p>

                 <div className="grid grid-cols-3 gap-8 border-y border-slate-200/60 py-8 mb-10">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Expected Amount</p>
                     <p className="text-xl font-bold text-slate-900 font-outfit">₹{parseFloat(dispute.expected_amount).toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date Initiated</p>
                     <p className="text-xl font-bold text-slate-900 font-outfit">{new Date(dispute.created_at).toLocaleDateString()}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Policy Number</p>
                     <p className="text-xl font-bold text-blue-600 font-outfit">POL-{dispute.claim?.insurance_policy?.policy_number || '88273'}</p>
                   </div>
                 </div>

                 {/* EVIDENCE SECTION */}
                 <div>
                     <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-blue-600" /> Evidence & Documentation
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {dispute.claim?.documents && dispute.claim.documents.length > 0 ? (
                         dispute.claim.documents.map((doc, i) => {
                           const filename = doc.file_path.split('/').pop() || `${doc.doc_type}.enc`;
                           return (
                             <div 
                               key={doc.id} 
                               onClick={() => handleDownload(doc)}
                               className="flex items-center justify-between p-5 rounded-2xl bg-white/50 border border-slate-200/60 group hover:border-blue-600 hover:bg-white transition-all cursor-pointer shadow-sm"
                             >
                               <div className="flex items-center gap-4 truncate">
                                 <div className="w-10 h-10 bg-slate-100/80 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                 </div>
                                 <div className="truncate">
                                   <p className="text-sm font-bold text-slate-700 truncate">{filename}</p>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                     {doc.doc_type.replace('_', ' ')} • {doc.verified ? 'Verified' : 'Pending Review'}
                                   </p>
                                 </div>
                               </div>
                               <Download className="w-4 h-4 text-slate-350 group-hover:text-blue-600 shrink-0 transition-colors" />
                             </div>
                           );
                         })
                       ) : (
                         <div className="col-span-2 text-center py-8 border border-dashed border-slate-200 rounded-[2rem] bg-slate-50">
                           <p className="text-sm text-slate-500 font-medium">No document evidence has been filed for this claim.</p>
                         </div>
                       )}
                     </div>
                  </div>
               </div>
            </div>

            {/* ACTION LOG / HISTORY */}
            <div className="bg-slate-950 rounded-[2rem] p-10 text-white shadow-xl shadow-slate-950/10">
               <h3 className="text-xs font-bold uppercase tracking-wider mb-10 text-slate-400">Case History</h3>
               <div className="space-y-10 relative">
                  <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-800" />
                  {[
                    { title: 'Case Filed', desc: 'Dispute initiated by claimant', time: '2 days ago', status: 'Completed', color: 'bg-emerald-500' },
                    { title: 'Mediator Assigned', desc: 'Adv. Rajesh Kumar joined the case', time: '1 day ago', status: 'Completed', color: 'bg-emerald-500' },
                    { title: 'Status Update', desc: 'Case moved to Under Review', time: '5 hours ago', status: 'Active', color: 'bg-blue-500' },
                    { title: 'Proposed Hearing', desc: 'Video hearing scheduled for May 15', time: 'Next step', status: 'Pending', color: 'bg-slate-750' },
                  ].map((step, i) => (
                    <div key={i} className="relative pl-16">
                      <div className={`absolute left-4 top-1 w-4 h-4 rounded-full ring-8 ring-slate-950 z-10 ${step.color}`} />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold tracking-tight text-base mb-1 font-outfit">{step.title}</p>
                          <p className="text-xs font-medium text-slate-450">{step.desc}</p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{step.time}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>

          {/* RIGHT: MEDIATOR CONTROLS */}
          <div className="space-y-10">
            
            {/* USER PROFILE CARD */}
            <div className="premium-card bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm p-8">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">Policy Holder Details</h3>
               <div className="flex items-center gap-6 mb-8">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-xl font-bold text-slate-455/80">
                    {dispute.user?.name?.[0]}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-outfit tracking-tight">{dispute.user?.name}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{dispute.user?.email}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-bold text-slate-650">
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Aadhar Verified</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-550" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-bold text-slate-650">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Age</span>
                    <span>34 Years</span>
                  </div>
               </div>
               <button className="w-full mt-8 py-3.5 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-md shadow-slate-950/10 cursor-pointer">
                 <MessageSquare className="w-4 h-4" /> Message Claimant
               </button>
            </div>

            {/* ACTION CARD */}
            <div className="premium-card bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm p-8 relative overflow-hidden">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8 relative z-10">Resolution Panel</h3>
               
               <div className="space-y-4 relative z-10">
                 {dispute.status !== 'Resolved' ? (
                   <>
                     <button 
                       onClick={() => updateStatus('Under Review')}
                       disabled={dispute.status === 'Under Review'}
                       className="premium-btn-secondary w-full py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl"
                     >
                       <FileText className="w-4 h-4" /> Start Review
                     </button>
                     <button 
                       className="premium-btn-secondary w-full py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl"
                     >
                       <Video className="w-4 h-4" /> Schedule Hearing
                     </button>
                     <button 
                        onClick={() => setShowResolveModal(true)}
                        className="premium-btn-accent w-full py-4 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-3 shadow-md shadow-blue-500/20 rounded-xl"
                     >
                        <Award className="w-4 h-4" /> Issue Final Award
                     </button>
                   </>
                 ) : (
                   <div className="text-center py-6">
                     <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                       <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-pulse" />
                     </div>
                      <h4 className="text-xl font-bold mb-2 text-slate-900 font-outfit">Case Resolved</h4>
                      <p className="text-slate-500 text-sm font-medium mb-6">A final award of ₹{parseFloat(dispute.expected_amount).toLocaleString()} has been issued.</p>
                      
                      {dispute.signature_data && (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-6 inline-block">
                          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-2">Your Digital Signature</p>
                          <img src={dispute.signature_data} alt="Signature" className="h-12 w-auto" />
                        </div>
                      )}

                      <button className="premium-btn-secondary w-full py-3 text-xs font-bold uppercase tracking-wider cursor-pointer border border-slate-200 hover:bg-slate-55/50 rounded-xl">Download Award PDF</button>
                    </div>
                 )}
               </div>
            </div>

          </div>

        </div>
      </div>

      {/* RESOLVE MODAL */}
      <AnimatePresence>
        {showResolveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResolveModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden border border-slate-200"
            >
              <div className="p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-slate-55/50 border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-900 shadow-sm">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-outfit">Final Settlement Award</h2>
                    <p className="text-sm font-semibold text-slate-400 mt-1">Submit your final decision for this dispute.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Resolution Summary</label>
                    <textarea 
                      value={resolutionData.resolution_summary}
                      onChange={(e) => setResolutionData({...resolutionData, resolution_summary: e.target.value})}
                      placeholder="Explain the rationale behind your decision..."
                      className="premium-input w-full min-h-[150px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Awarded Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">₹</span>
                      <input 
                        type="number"
                        value={resolutionData.awarded_amount}
                        onChange={(e) => setResolutionData({...resolutionData, awarded_amount: e.target.value})}
                        className="premium-input !pl-10 text-2xl font-bold text-slate-900 w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mediator Digital Signature</label>
                      <button 
                        onClick={() => sigCanvas.current.clear()}
                        className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-2 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Eraser className="w-3 h-3 shrink-0" /> Clear Signature
                      </button>
                    </div>
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden">
                      <SignatureCanvas 
                        ref={sigCanvas}
                        penColor="#2563EB"
                        canvasProps={{
                          className: "signature-canvas w-full h-40"
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      onClick={() => setShowResolveModal(false)}
                      className="premium-btn-secondary flex-1 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer border border-slate-200 hover:bg-slate-55/60 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleResolve}
                      className="premium-btn-primary flex-[2] py-4 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-3 shadow-md shadow-blue-500/10 rounded-xl"
                    >
                      <FileSignature className="w-4 h-4" /> Sign & Issue Award
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

