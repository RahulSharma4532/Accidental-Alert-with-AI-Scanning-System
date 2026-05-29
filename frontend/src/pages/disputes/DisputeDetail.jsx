import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, Clock, Scale, MessageSquare, Send, 
  FileText, Download, PhoneCall, Video, User, 
  ShieldCheck, ArrowLeft, MoreVertical, Paperclip, 
  CheckCircle2, Info, Loader2, ChevronRight, History, Award, Share2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function DisputeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchDisputeDetails();
  }, [id]);

  const fetchDisputeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/disputes/${id}`);
      if (response.data) setDispute(response.data);
    } catch (error) {
      console.error('Failed to load dispute', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      const response = await api.post(`/disputes/${id}/messages`, {
        message: newMessage
      });
      setDispute(prev => ({
        ...prev,
        messages: [...(prev.messages || []), response.data]
      }));
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dispute?.messages]);

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
          <h2 className="text-lg font-bold text-slate-900 font-outfit">Dispute & Mediation Details</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/disputes/${id}/hearing`)}
            className="premium-btn-accent py-2.5 px-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Video className="w-4 h-4" /> Join Hearing
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 overflow-hidden flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          
          {/* LEFT: CASE METADATA */}
          <aside className="w-full lg:w-[400px] flex flex-col gap-6 overflow-y-auto pr-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">Dispute Details</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium capitalize">
                Resolution of {dispute?.reason || 'Claim'}.
              </p>
            </div>

            <div className="premium-card relative overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm">
              <div className="absolute top-6 right-6">
                <span className={dispute?.status === 'Resolved' ? 'badge-premium-green' : 'badge-premium-blue'}>
                  {dispute?.status || 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center border border-slate-200/60 shadow-sm">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Adv. Rajesh Kumar</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Lead Mediator Assigned</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 pt-4 mt-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Disputed Amount</p>
                  <p className="text-lg font-bold text-slate-900 font-outfit">₹{parseFloat(dispute?.expected_amount || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Claim Ref</p>
                  <p className="text-sm font-bold text-slate-900 font-outfit mt-1">CLM-{dispute?.claim_id || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div className="premium-card flex-1 bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Timeline</h2>
              <div className="space-y-6 relative">
                <div className="absolute top-2 bottom-0 left-[11px] w-px bg-slate-200/80" />
                {[
                  { title: 'Decision Recorded', date: 'Just now', icon: <CheckCircle2 className="w-3 h-3" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-250/80' },
                  { title: 'Hearing Finalized', date: 'Yesterday', icon: <Video className="w-3 h-3" />, color: 'bg-slate-50 text-slate-600 border-slate-200/80' },
                  { title: 'Evidence Logged', date: '2d ago', icon: <FileText className="w-3 h-3" />, color: 'bg-slate-50 text-slate-600 border-slate-200/80' },
                  { title: 'Dispute Submitted', date: '3d ago', icon: <Plus className="w-3 h-3" />, color: 'bg-slate-50 text-slate-600 border-slate-200/80' },
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border z-10 ${item.color}`}>
                      {item.icon}
                    </div>
                    <h5 className="text-sm font-semibold text-slate-900">{item.title}</h5>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT: THREE-WAY SYNC CHAT */}
          <section className="flex-1 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[500px] animate-subtle-fade">
            <div className="p-4 bg-slate-50/50 border-b border-slate-200/60 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-500 tracking-wide">
                Safe & Secure Chat: Policy Holder / Mediator / Insurance Company
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {dispute?.messages?.length > 0 ? dispute.messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender_type === 'User' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs font-bold text-slate-400 mb-1 px-2 uppercase tracking-wider">
                    {msg.sender_type}
                  </span>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm border ${
                    msg.sender_type === 'User' ? 'bg-blue-600 text-white rounded-tr-none border-blue-600' : 
                    msg.sender_type === 'Mediator' ? 'bg-indigo-50/80 text-indigo-950 rounded-tl-none border-indigo-150/80' : 
                    'bg-slate-50 text-slate-900 border-slate-200/60 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <MessageSquare className="w-12 h-12 text-slate-200" />
                  <p className="text-sm font-semibold">No messages in this thread yet. Send a message to start.</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white/80 border-t border-slate-200/80">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all rounded-xl cursor-pointer">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="p-3 bg-slate-950 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-md shadow-slate-950/10"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
