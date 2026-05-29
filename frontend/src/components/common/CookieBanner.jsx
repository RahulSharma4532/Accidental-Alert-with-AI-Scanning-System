import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-2xl"
        >
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-8 backdrop-blur-2xl bg-slate-900/95">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
              <Shield className="w-8 h-8 text-slate-900" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">Privacy & Cookies</h4>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                We use cookies to ensure you have a secure and smooth experience. Please review our <Link to="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={accept}
                className="flex-1 md:flex-none px-10 py-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 whitespace-nowrap"
              >
                Accept
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
