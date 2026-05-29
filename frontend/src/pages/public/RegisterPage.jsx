import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import Logo from '../../assets/icons/LogoAccident.png';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = await register(formData.name, formData.email, formData.phone, formData.password);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-950 font-sans text-zinc-100 mesh-bg-dark dot-grid-dark relative overflow-x-hidden">
      
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 bg-zinc-950/60 border-r border-zinc-900 relative overflow-hidden z-10">
        <div className="relative z-10 space-y-12">
          
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Logo" className="h-8 w-auto bg-white rounded-md p-1" />
              <span className="text-sm font-black tracking-widest uppercase font-outfit text-white">AccidentAlert</span>
            </div>
            
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white font-outfit uppercase">
              Create Your <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Secure Account
              </span>
            </h1>
            <p className="text-zinc-400 max-w-md text-xs font-medium leading-relaxed font-sans">
              Set up your personal account on the AccidentAlert platform. Get instant access to easy accident reports, secure insurance claims, and fast dispute resolution.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3 text-xs font-bold text-zinc-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>END-TO-END DATA ENCRYPTION</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-zinc-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>REAL-TIME DISPATCH & INSURANCE SYNC</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-zinc-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>AUTOMATED FRAUD DETECTION SHIELD</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 text-xs font-bold text-zinc-400 font-sans">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>SOC2 Type II Certified Network</span>
        </div>
      </div>

      {/* Right Column - Registration Portal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md">
          
          <div className="premium-card-dark bg-zinc-900/40 backdrop-blur-xl border border-zinc-850 p-8 sm:p-10 shadow-2xl relative">
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tight mb-2">Create Account</h2>
              <p className="text-xs text-zinc-500 font-medium">Complete the form below to set up your secure account.</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                  <div className="text-rose-400 text-xs font-semibold leading-relaxed">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="premium-input-dark !pl-14"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="premium-input-dark !pl-14"
                    placeholder="e.g. name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Registered Mobile Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    className="premium-input-dark !pl-14"
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="premium-input-dark !pl-14"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="premium-input-dark !pl-14"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full premium-btn-primary bg-white text-zinc-950 hover:bg-zinc-200 mt-6 cursor-pointer">
                {loading ? 'Creating Account...' : 'Register'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 text-center border-t border-zinc-850 pt-6">
              <p className="text-xs text-zinc-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:underline font-bold transition-all">Login</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


