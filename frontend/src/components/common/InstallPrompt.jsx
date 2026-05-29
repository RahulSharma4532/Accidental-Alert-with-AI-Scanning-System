import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Sparkles, ShieldCheck } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the custom prompt after 10 seconds of user activity
      setTimeout(() => setIsVisible(true), 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[60] md:left-auto md:right-12 md:bottom-12 md:w-[400px]"
        >
          <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-slate-800 relative overflow-hidden group">
            {/* Minimal Background Polish */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-700" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-8 shadow-xl shadow-white/5">
                <Smartphone className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                <Sparkles className="w-3 h-3 shrink-0" />
                Mobile App Installation
              </div>

              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Install <br /> <span className="text-slate-500">AccidentAlert App.</span></h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-10">
                OFFLINE ACCIDENT REPORTING AND REAL-TIME EMERGENCY HELPLINES.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={handleInstall}
                  className="flex-1 py-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5"
                >
                  <Download className="w-4 h-4" /> Install Application
                </button>
                <div className="flex items-center gap-3 px-6 py-2 rounded-xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
