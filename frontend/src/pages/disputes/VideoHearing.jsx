import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  ScreenShare, MessageSquare, Users, Settings,
  Maximize2, Shield, Loader2, Monitor, ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function VideoHearing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([
    { name: 'Adv. Rajesh Kumar', role: 'Mediator', status: 'Online' },
    { name: 'HDFC Legal Team', role: 'Insurer', status: 'Online' },
  ]);

  const localVideoRef = useRef(null);

  useEffect(() => {
    if (isJoined && isVideoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        })
        .catch(err => console.error('Error accessing camera', err));
    }
  }, [isJoined, isVideoOn]);

  if (!isJoined) {
    return (
      <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex items-center justify-center p-6 text-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl p-10 text-center border border-slate-200/80 shadow-xl"
        >
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-blue-600 shadow-sm">
            <Shield className="w-10 h-10 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight font-outfit">Video Hearing</h2>
          <p className="text-slate-400 font-bold mb-10">Dispute ID: {id}</p>

          <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 rounded-xl transition-all cursor-pointer border ${
                  isVideoOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-250/60 border-slate-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200'
                }`}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-4 rounded-xl transition-all cursor-pointer border ${
                  isMicOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-250/60 border-slate-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200'
                }`}
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
            </div>
            
            <button 
              onClick={() => setIsJoined(true)}
              className="premium-btn-accent w-full py-4 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Join Video Call
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="premium-btn-secondary w-full py-4 text-xs font-bold uppercase tracking-wider cursor-pointer mt-2"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 mesh-bg-light dot-grid flex flex-col font-sans overflow-hidden text-slate-900">
      
      {/* TOP HEADER */}
      <header className="px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="badge-premium-red">
            <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
            <span>Live Video Call</span>
          </div>
          <h1 className="text-sm font-bold text-slate-750 font-outfit">Mediation Call &middot; {id}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">3 Participants</span>
        </div>
      </header>

      {/* MAIN VIDEO GRID */}
      <main className="flex-1 p-6 relative">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* MEDIATOR VIEW */}
          <div className="relative bg-slate-100/50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-sm z-10">
              <h3 className="text-sm font-bold text-slate-900">Adv. Rajesh Kumar</h3>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Presiding Mediator</p>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-24 h-24 text-slate-300" />
            </div>
          </div>

          {/* INSURER VIEW */}
          <div className="relative bg-slate-100/50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-sm z-10">
              <h3 className="text-sm font-bold text-slate-900">HDFC General Insurance</h3>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Legal Counsel</p>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <Shield className="w-24 h-24 text-slate-300" />
            </div>
          </div>

          {/* LOCAL USER VIEW (Floating or Mini) */}
          <div className="absolute bottom-10 right-10 w-80 aspect-video bg-slate-200 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xl z-20">
            {isVideoOn ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover scale-x-[-1]" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <VideoOff className="w-12 h-12 text-slate-400" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/50">
              <p className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">You (Claimant)</p>
            </div>
          </div>

        </div>
      </main>

      {/* CALL CONTROLS */}
      <footer className="p-8 flex items-center justify-center relative">
        <div className="flex items-center gap-4 bg-white/95 backdrop-blur-md px-8 py-4 rounded-2xl border border-slate-200/80 shadow-xl">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
              isMicOn ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200'
            }`}
          >
            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
              isVideoOn ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200'
            }`}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          <button className="p-3.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-250/60 cursor-pointer">
            <Monitor className="w-6 h-6" />
          </button>

          <button className="p-3.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-250/60 cursor-pointer">
            <MessageSquare className="w-6 h-6" />
          </button>

          <div className="h-8 w-px bg-slate-200 mx-2" />

          <button 
            onClick={() => navigate(-1)}
            className="p-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-all shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </footer>

    </div>
  );
}
