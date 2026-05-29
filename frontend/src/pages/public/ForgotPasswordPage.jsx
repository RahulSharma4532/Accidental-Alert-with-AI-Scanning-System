import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import Logo from '../../assets/icons/LogoAccident.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-950 font-sans text-zinc-100 mesh-bg-dark dot-grid-dark relative overflow-x-hidden">
      
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 bg-zinc-950/60 border-r border-zinc-900 relative overflow-hidden z-10">
        <div className="relative z-10 space-y-12">
          <Link to="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-all uppercase tracking-widest text-[10px] font-black border border-zinc-800 px-4 py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Logo" className="h-8 w-auto bg-white rounded-md p-1" />
              <span className="text-sm font-black tracking-widest uppercase font-outfit text-white">AccidentAlert</span>
            </div>
            
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white font-outfit uppercase">
              Account <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Recovery Portal
              </span>
            </h1>
            <p className="text-zinc-400 max-w-md text-xs font-medium leading-relaxed font-sans">
              Access to accounts requires secure verification. Request a password reset link to reset your credentials and regain access to the platform.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 text-xs font-bold text-zinc-400 font-sans">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>SOC2 Type II Certified Network</span>
        </div>
      </div>

      {/* Right Column - Recovery Portal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md">
          
          <div className="premium-card-dark bg-zinc-900/40 backdrop-blur-xl border border-zinc-850 p-8 sm:p-10 shadow-2xl relative">
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tight mb-2">Forgot Password</h2>
              <p className="text-xs text-zinc-500 font-medium">Enter your email to receive password reset instructions.</p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="recovery-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="premium-input-dark !pl-14"
                        placeholder="e.g. name@example.com"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full premium-btn-primary bg-white text-zinc-950 hover:bg-zinc-200 mt-6 cursor-pointer">
                    {isLoading ? 'Sending...' : 'Send Reset Link'} <KeyRound className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-xl text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-black font-outfit uppercase text-white mb-2">Link Sent Successfully</h3>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-6">
                    If <strong className="text-white">{email}</strong> exists in our system, you will receive a secure recovery link shortly.
                  </p>
                  <Link to="/login" className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Return to Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSubmitted && (
              <div className="mt-8 text-center border-t border-zinc-850 pt-6">
                <p className="text-xs text-zinc-500 font-medium">
                  Remember your password?{' '}
                  <Link to="/login" className="text-white hover:underline font-bold transition-all">Login</Link>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


