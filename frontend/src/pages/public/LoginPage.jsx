import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, Fingerprint, ArrowRight, ShieldCheck, ArrowLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';
import Logo from '../../assets/icons/LogoAccident.png';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('otp'); // 'otp' or 'email'
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [twilioConfigured, setTwilioConfigured] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const { user, loginWithOtp, loginWithEmail, sendOtp, loginWithGoogle, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated && user) {
      const finalRedirect = user.role === 'admin' ? '/admin' : redirectPath;
      navigate(finalRedirect, { replace: true });
    }
  }, [isAuthenticated, user, navigate, redirectPath]);

  useEffect(() => {
    // Fetch google client ID from backend
    api.get('/auth/google/config')
      .then(res => {
        if (res.data.client_id) {
          setGoogleClientId(res.data.client_id);
        }
      })
      .catch(err => console.error("Error fetching Google config", err));
  }, []);

  useEffect(() => {
    if (!googleClientId) return;
    
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          setError('');
          const res = await loginWithGoogle(response.credential);
          if (res.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setError(res.error);
      }
    }
  });
  const btn = document.getElementById("google-signin-btn");
  if (btn) {
    window.google.accounts.id.renderButton(
      btn,
      { theme: "outline", size: "large", width: "100%" }
    );
  }
};
document.body.appendChild(script);

return () => {
  document.body.removeChild(script);
};
  }, [googleClientId]);

  const handleSendOtp = async (e) => {
e.preventDefault();
if (phone.length === 10) {
  setError('');
  const res = await sendOtp(phone);
  if (res.success) {
    setOtpSent(true);
    setDemoOtp(res.otp);
    setTwilioConfigured(res.twilio_configured);
    setSmsSent(res.sms_sent);
  } else {
    setError(res.error);
  }
} else {
  setError('Please enter a valid 10-digit mobile number');
}
  };

  const handleOtpLogin = async (e) => {
e.preventDefault();
setError('');
const res = await loginWithOtp(phone, otp);
if (res.success) {
  navigate(redirectPath, { replace: true });
} else {
  setError(res.error);
}
  };

  const handleEmailLogin = async (e) => {
e.preventDefault();
setError('');
const res = await loginWithEmail(email, password);
if (res.success) {
  const finalRedirect = res.user?.role === 'admin' ? '/admin' : redirectPath;
  navigate(finalRedirect, { replace: true });
} else {
  setError(res.error);
}
  };

  const handleGoogleLoginSelect = async (account) => {
setShowGoogleModal(false);
setError('');
const res = await loginWithGoogle(account.email, account.name, account.googleId, account.avatar);
if (res.success) {
  const finalRedirect = res.user?.role === 'admin' ? '/admin' : redirectPath;
  navigate(finalRedirect, { replace: true });
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
              Smart Accident <br /> Reports & <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Insurance Claims
              </span>
            </h1>
            <p className="text-zinc-400 max-w-md text-xs font-medium leading-relaxed font-sans">
              Securely log in to access your personal dashboard locker. Submit automated visual incident reports, review active payouts, resolve mediator disputes, and manage your vehicle telemetry profile from a single encrypted terminal.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 text-xs font-bold text-zinc-400 font-sans">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>SOC2 Type II Certified Network</span>
        </div>
      </div>

      {/* Right Column - Login Portal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md">
          
          <div className="premium-card-dark bg-zinc-900/40 backdrop-blur-xl border border-zinc-850 p-8 sm:p-10 shadow-2xl relative">
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tight mb-2">Welcome Back</h2>
              <p className="text-xs text-zinc-500 font-medium">Please enter your credentials to authorize login access.</p>
            </div>

            {/* Auth Tabs */}
            <div className="flex bg-zinc-950/80 rounded-xl p-1.5 mb-8 border border-zinc-850">
              <button
                onClick={() => { setActiveTab('otp'); setError(''); }}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${activeTab === 'otp' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                OTP Access
              </button>
              <button
                onClick={() => { setActiveTab('email'); setError(''); }}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${activeTab === 'email' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Password Login
              </button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                  <div className="text-rose-400 text-xs font-semibold leading-relaxed">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {activeTab === 'email' ? (
              <form onSubmit={handleEmailLogin} className="space-y-5">
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
                      placeholder="e.g. admin@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">Password</label>
                    <Link to="/forgot-password" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-wider">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="premium-input-dark !pl-14"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full premium-btn-primary bg-white text-zinc-950 hover:bg-zinc-200 mt-6 cursor-pointer">
                  {loading ? 'Authenticating...' : 'Authorize Login'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Registered Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type="tel"
                      required
                      disabled={otpSent}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="premium-input-dark !pl-14 disabled:opacity-50"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                {otpSent && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 mt-5">One-Time Passcode</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center">
                        <Fingerprint className="w-4.5 h-4.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="premium-input-dark !pl-14"
                        placeholder="000000"
                      />
                    </div>
                    {demoOtp && (
                      <div className="mt-3 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg flex items-center justify-between">
                        <span>Local verification OTP code:</span>
                        <span className="font-mono bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded font-black">{demoOtp}</span>
                      </div>
                    )}
                    {otpSent && twilioConfigured && smsSent && (
                      <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 text-left font-semibold">
                        <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-2"></span>
                        OTP Code Dispatched to Twilio Node.
                      </div>
                    )}
                    {otpSent && !twilioConfigured && (
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] text-amber-400 text-left leading-relaxed font-medium">
                        ⚠️ Twilio SMS node is offline. Real-time phone dispatch requires active Twilio API credentials in the backend environment dossier.
                      </div>
                    )}
                    <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-bold text-zinc-500 hover:text-white mt-3 inline-block transition-colors uppercase tracking-wider">Change mobile number?</button>
                  </motion.div>
                )}

                <button type="submit" disabled={loading} className="w-full premium-btn-primary bg-white text-zinc-950 hover:bg-zinc-200 mt-6 cursor-pointer">
                  {loading ? 'Requesting...' : otpSent ? 'Verify Passcode' : 'Generate SMS OTP'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* OR Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-zinc-900 px-3 text-zinc-500">Or Access via</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            {googleClientId ? (
              <div className="space-y-4">
                <div id="google-signin-btn" className="w-full flex justify-center"></div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 text-left font-semibold">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-2"></span>
                  Active Google OIDC Gateway verified.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button 
                  type="button" 
                  onClick={() => setShowGoogleModal(true)} 
                  className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-zinc-800 flex justify-center items-center gap-3 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.68,16.5,12,16.5c-3.03,0-5.61-2.08-6.53-4.88c-0.24-0.72-0.38-1.5-0.38-2.3 c0-0.8,0.14-1.58,0.38-2.3c0.92-2.8,3.5-4.88,6.53-4.88c1.64,0,3.12,0.61,4.28,1.62l3.02-3.02C17.38,1.4,14.88,0.5,12,0.5 C7.02,0.5,2.7,3.37,0.5,7.56c-0.3,0.57-0.56,1.18-0.77,1.8C-0.51,10.22-0.51,11.12-0.27,12c0.21,0.62,0.47,1.23,0.77,1.8 c2.2,4.19,6.52,7.06,11.5,7.06c2.93,0,5.65-0.95,7.74-2.58l-3.32-2.58c-1.12,0.75-2.56,1.21-4.42,1.21c-3.03,0-5.61-2.08-6.53-4.88 c-0.24-0.72-0.38-1.5-0.38-2.3c0-0.8,0.14-1.58,0.38-2.3c0.92-2.8,3.5-4.88,6.53-4.88c1.64,0,3.12,0.61,4.28,1.62l3.02-3.02 C17.38,1.4,14.88,0.5,12,0.5c-0.64,0-1.27,0.05-1.9,0.15l2.45,2.45c1.44-0.08,2.78,0.4,3.77,1.27l3.02-3.02 C17.38,1.4,14.88,0.5,12,0.5c-4.98,0-9.3,2.87-11.5,7.06L3,9.88c0.92-2.8,3.5-4.88,6.53-4.88c1.64,0,3.12,0.61,4.28,1.62 l3.02-3.02C17.38,1.4,14.88,0.5,12,0.5c-0.64,0-1.27,0.05-1.9,0.15l2.45,2.45c1.44-0.08,2.78,0.4,3.77,1.27l3.02-3.02 C17.38,1.4,14.88,0.5,12,0.5" fill="none"/>
                      <path d="M23.52,12.27c0-0.81-0.07-1.6-0.2-2.36H12v4.47h6.46c-0.28,1.47-1.11,2.71-2.36,3.55v2.95h3.82 C22.16,18.4,23.52,15.6,23.52,12.27z" fill="#4285F4"/>
                      <path d="M12,24c3.24,0,5.97-1.08,7.96-2.91l-3.82-2.95c-1.06,0.71-2.42,1.13-4.14,1.13c-3.18,0-5.88-2.15-6.84-5.05H1.24v3.05 C3.22,21.28,7.31,24,12,24z" fill="#34A853"/>
                      <path d="M5.16,14.22c-0.25-0.75-0.39-1.55-0.39-2.37c0-0.82,0.14-1.62,0.39-2.37V6.43H1.24C0.45,8.02,0,9.8,0,11.75 c0,1.95,0.45,3.73,1.24,5.32L5.16,14.22z" fill="#FBBC05"/>
                      <path d="M12,4.77c1.76,0,3.34,0.61,4.59,1.8l3.43-3.43C17.97,1.21,15.24,0,12,0C7.31,0,3.22,2.72,1.24,6.43l3.92,3.05 C6.12,6.92,8.82,4.77,12,4.77z" fill="#EA4335"/>
                    </g>
                  </svg>
                  Sign in with Google
                </button>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] text-amber-400 text-left leading-relaxed font-medium">
                  ⚠️ Google OAuth clientId requires registration in the platform configuration. Click to invoke simulated provider accounts.
                </div>
              </div>
            )}

            {/* Google Accounts Chooser Modal */}
            {showGoogleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-zinc-100 relative">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57C21.35,18.36,22.56,15.56,22.56,12.25Z" fill="#4285F4"/>
                        <path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98,.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z" fill="#34A853"/>
                        <path d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43,.35-2.09V7.06H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.94l3.66-2.85Z" fill="#FBBC05"/>
                        <path d="M12,5.38c1.62,0,3.06,.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.06L5.84,9.91C6.71,7.31,9.14,5.38,12,5.38Z" fill="#EA4335"/>
                      </svg>
                      <span className="font-black text-[10px] uppercase tracking-widest text-zinc-400">Select Google Identity</span>
                    </div>
                    <button onClick={() => setShowGoogleModal(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-base font-black text-white mb-1 uppercase font-outfit">Choose simulated account</h3>
                  <p className="text-[10px] font-bold text-zinc-500 mb-4 border-b border-zinc-800 pb-3 uppercase tracking-wider">to continue to AccidentAlert</p>
                  
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {[
                      { name: 'Arjun Dev (User)', email: 'victim@gmail.com', googleId: '109283749283749283748', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80' },
                      { name: 'Insurance Desk (Insurer)', email: 'insurer@company.com', googleId: '209384729384729384729', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80' },
                      { name: 'Sanjay Kumar (Arbitrator)', email: 'mediator@gmail.com', googleId: '309485730948573094857', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80' },
                      { name: 'System Admin', email: 'admin@accidentalert.com', googleId: '409586740958674095867', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80' }
                    ].map((account) => (
                      <button
                        key={account.email}
                        onClick={() => handleGoogleLoginSelect(account)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/80 border border-zinc-800/50 hover:border-zinc-700 text-left transition-all duration-200 cursor-pointer"
                      >
                        <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{account.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate font-mono">{account.email}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-650" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center border-t border-zinc-850 pt-6">
              <p className="text-xs text-zinc-550 font-medium">
                Don't have an active account?{' '}
                <Link to="/register" className="text-white hover:underline font-bold">Register Profile</Link>
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}


