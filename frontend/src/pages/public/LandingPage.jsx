import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, ArrowRight, Zap, Activity, Navigation, 
  Gavel, Layers, ShieldCheck, FileText, HeartPulse, 
  Scale, Landmark, ChevronRight, CheckSquare, 
  Lock, Clock, UserCheck, Star, HelpCircle, 
  ChevronDown, Phone, ShieldAlert, Cpu, ArrowUpRight, Check, Play
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function LandingPage() {
  const [activeHeroTab, setActiveHeroTab] = useState('scan');
  const [faqOpen, setFaqOpen] = useState({});
  const [selectedStatute, setSelectedStatute] = useState('samaritan');
  const [selectedScenario, setSelectedScenario] = useState('highway');

  // Simulator Interactive States
  const [simDamageScanActive, setSimDamageScanActive] = useState(false);
  const [simSosAlertActive, setSimSosAlertActive] = useState(false);
  const [simClaimPayoutActive, setSimClaimPayoutActive] = useState(false);
  const [simScanProgress, setSimScanProgress] = useState(0);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  const handleSimulateScan = () => {
    setSimDamageScanActive(true);
    setSimScanProgress(0);
    const interval = setInterval(() => {
      setSimScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleSimulateSos = () => {
    setSimSosAlertActive(true);
  };

  const handleSimulateClaim = () => {
    setSimClaimPayoutActive(true);
  };

  const resetSimulator = () => {
    setSimDamageScanActive(false);
    setSimSosAlertActive(false);
    setSimClaimPayoutActive(false);
    setSimScanProgress(0);
  };

  const features = [
    { 
      title: 'AI Visual Scan', 
      desc: 'Real-time vehicle visual scans to estimate damage severity and repair costs.', 
      icon: <Cpu className="w-5 h-5" />, 
      link: '/report',
      span: 'lg:col-span-2 lg:row-span-2',
      customGraphic: (
        <div className="mt-6 relative h-48 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1))] pointer-events-none" />
          <svg className="w-48 h-auto opacity-30 text-blue-500" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 50 C40 30, 60 30, 80 40 C100 50, 120 70, 140 60 C160 50, 180 50, 190 55 L180 75 L40 75 Z" />
            <circle cx="60" cy="75" r="10" />
            <circle cx="140" cy="75" r="10" />
          </svg>
          <motion.div 
            animate={{ y: [-70, 70, -70] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_12px_#3b82f6] z-10 animate-laser"
          />
          <div className="absolute bottom-4 left-4 font-mono text-[9px] text-blue-400/80 bg-zinc-900/90 px-2 py-1 rounded border border-zinc-800">
            SCANNING BUMPER: DEEP DENT [₹18,500]
          </div>
        </div>
      )
    },
    { 
      title: 'SOS Emergency Broadcast', 
      desc: 'Instant alert dispatching to family contacts, police, and rescuers.', 
      icon: <Zap className="w-5 h-5" />, 
      link: '/report',
      span: 'col-span-1',
      customGraphic: (
        <div className="mt-4 flex items-center justify-center h-24">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-rose-400 opacity-20"></span>
            <span className="animate-pulse absolute inline-flex h-10 w-10 rounded-full bg-rose-400 opacity-40"></span>
            <div className="relative w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg">
              <Phone className="w-5 h-5" />
            </div>
          </div>
        </div>
      )
    },
    { 
      title: 'Legal Compliance Guide', 
      desc: 'Guidance under the Motor Vehicles Act 1988 to assert your rights.', 
      icon: <Gavel className="w-5 h-5" />, 
      link: '/knowledge/rights',
      span: 'col-span-1',
      customGraphic: (
        <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 text-[9px] font-mono text-slate-500 space-y-1">
          <div className="flex justify-between border-b pb-1 font-bold text-slate-700">
            <span>Act Provision</span>
            <span>Right / Immunity</span>
          </div>
          <div className="flex justify-between"><span>Sec 134A</span><span className="text-blue-600 font-bold">Good Samaritan Protection</span></div>
          <div className="flex justify-between"><span>Sec 161</span><span className="text-blue-600 font-bold">Hit & Run Solatium Fund</span></div>
        </div>
      )
    },
    { 
      title: 'Verified Providers Network', 
      desc: 'Connecting users directly with RTOs, verified insurers, and repair network garages.', 
      icon: <Layers className="w-5 h-5" />, 
      link: '/nearby',
      span: 'lg:col-span-2',
      customGraphic: (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { name: 'National RTO', stat: 'Connected', col: 'emerald' },
            { name: 'IRDAI Insurers', stat: 'Verified API', col: 'blue' },
            { name: 'Network Garages', stat: 'Cashless Active', col: 'indigo' }
          ].map((prov, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-slate-800">{prov.name}</p>
              <span className={`inline-block mt-1 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-${prov.col}-50 text-${prov.col}-600 border border-${prov.col}-100`}>
                {prov.stat}
              </span>
            </div>
          ))}
        </div>
      )
    },
    { 
      title: 'Instant Claim Locker', 
      desc: 'Filing verification documents and policy claims securely.', 
      icon: <ShieldCheck className="w-5 h-5" />, 
      link: '/claims',
      span: 'col-span-1',
      customGraphic: (
        <div className="mt-4 flex flex-col gap-1.5">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div animate={{ width: ['0%', '100%', '100%'] }} transition={{ repeat: Infinity, duration: 4 }} className="h-full bg-emerald-500" />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-slate-400">
            <span>KYC UPLOAD</span>
            <span className="font-bold text-emerald-600">AADHAAR SECURED</span>
          </div>
        </div>
      )
    },
    { 
      title: 'Good Samaritan Safeguards', 
      desc: 'Immunity guarantees and legal support for medical responders.', 
      icon: <Scale className="w-5 h-5" />, 
      link: '/knowledge/rights',
      span: 'col-span-1',
      customGraphic: (
        <div className="mt-4 bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 text-center flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <div className="text-left">
            <p className="text-[9px] font-bold text-blue-900">CIVIL PROTECTION</p>
            <p className="text-[8px] text-blue-500 font-mono">SUPREME COURT IMMUNITY</p>
          </div>
        </div>
      )
    },
    { 
      title: 'Golden Hour Trauma Routing', 
      desc: 'Dynamic routing mapping to direct emergency teams within the critical 60-minute window.', 
      icon: <HeartPulse className="w-5 h-5" />, 
      link: '/nearby',
      span: 'col-span-1',
      customGraphic: (
        <div className="mt-4 relative h-20 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <div className="text-left font-mono text-[9px]">
              <p className="font-bold text-slate-800">AMBULANCE_ROUTE</p>
              <p className="text-blue-600">ETA 8 MINS &middot; NH-48</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      title: 'Secure Policy Locker', 
      desc: 'Encrypted local document storage with quick RTO credential retrieval.', 
      icon: <Landmark className="w-5 h-5" />, 
      link: '/vault',
      span: 'col-span-1',
      customGraphic: (
        <div className="mt-4 flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" />
            <span className="text-[9px] font-mono text-slate-600 font-bold">DIGITAL_LOCKER.AES</span>
          </div>
          <span className="text-[8px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">LOCKED</span>
        </div>
      )
    }
  ];

  const statutoryGuides = {
    samaritan: {
      title: "Good Samaritan Protection",
      law: "Section 134A, Motor Vehicles Act (2019 Amendment)",
      desc: "Complete civil and criminal immunity for any bystander who assists a road victim in good faith during emergency situations.",
      points: [
        "No liability for civil damage, negligence or criminal action.",
        "Completely voluntary police interrogation. You cannot be forced to give statements.",
        "Zero hospital deposit demands. Hospitals are legally barred from detaining you or requesting payment for victims.",
        "No identity disclosure required. You may remain completely anonymous."
      ]
    },
    hitrun: {
      title: "Hit & Run Compensation Scheme",
      law: "Section 161, Motor Vehicles Act 1988 (Solatium Scheme)",
      desc: "Statutory funds established by the Central Government to provide rapid financial relief to victims of hit-and-run accidents where the vehicle cannot be identified.",
      points: [
        "In case of death: Payout of ₹2,00,000 (increased from ₹25,000).",
        "In case of grievous hurt: Payout of ₹50,000 (increased from ₹12,500).",
        "Claims dossier generated automatically by AccidentAlert.",
        "Disputed cases mediated directly through the SDM tribunal interface."
      ]
    },
    thirdparty: {
      title: "Third-Party Insurance Liability",
      law: "Section 146 & 166, Motor Vehicles Act 1988",
      desc: "Compulsory insurance coverage required for all motor vehicles in India to satisfy claims arising out of bodily injury, death, or third-party property damage.",
      points: [
        "No limit on liability for personal injury or death claims in the Tribunal.",
        "Property damage liability covered up to ₹7,500,000 (for commercial/private).",
        "Direct RTO API lookup to fetch the opposing vehicle's policy status.",
        "Automated MACT (Motor Accidents Claims Tribunal) petition filings."
      ]
    }
  };

  const scenarioTimeline = {
    highway: [
      { step: "01", action: "Distress Telemetry Locked", desc: "GPS pins NH-44 highway location. App queries RTO databases to fetch active insurance policies and vehicle details instantly." },
      { step: "02", action: "SOS Dispatch & Patrol Link", desc: "SOS transmission dispatched to local police, NHAI 1033 patrol center, and personal emergency contacts." },
      { step: "03", action: "AI Damage Visual Docket", desc: "The user scans vehicle deformation. Computer vision computes severity and generates repair quotes for insurance." },
      { step: "04", action: "Cashless Settlement Dossier", desc: "Verified collision dossier and vehicle metadata uploaded to cashless insurer network for rapid deposit." }
    ],
    minor: [
      { step: "01", action: "Aadhaar Digital Handshake", desc: "Both drivers confirm identities securely using Aadhaar-linked OTPs to avoid false identity disputes." },
      { step: "02", action: "Accident Scene Verification", desc: "Photos of both vehicles and RTO registration numbers verified by the platform's geolocation engine." },
      { step: "03", action: "Pre-Settlement Estimator", desc: "Visual scanning estimates bumper/paint repair costs. Both parties view neutral RTO-compliant market rates." },
      { step: "04", action: "Amicable Digital Sign-Off", desc: "Mutual liability release signed in-app, bypassing long police reports and immediately initiating claim filings." }
    ],
    bystander: [
      { step: "01", action: "Golden Hour Dispatch", desc: "Bystander flags emergency. App triggers trauma dispatch routing within the critical 60-minute window." },
      { step: "02", action: "Good Samaritan Immunity Brief", desc: "Digital immunity certificate showing Section 134A guidelines issued to bystander to protect them from liability." },
      { step: "03", action: "Police/Hospital Zero-Harass Link", desc: "Bystander's contact details hidden behind anonymous token proxy. Direct medical advisory coordinates hospital admission." },
      { step: "04", action: "Victim Telemetry Logged", desc: "Victim's vehicle details mapped to insurance policy to dispatch emergency claims immediately." }
    ]
  };

  const systemTicker = [
    { loc: "KA-03 Collision", amount: "₹42,500 settled", speed: "1.2 hrs", type: "Comprehensive" },
    { loc: "MH-12 Highway SOS", amount: "Ambulance Dispatched", speed: "8 mins ETA", type: "NH-48" },
    { loc: "DL-01 Hit & Run", amount: "₹2,00,000 claim approved", speed: "Solatium Fund", type: "Tribunal" },
    { loc: "HR-26 Minor Scratch", amount: "₹12,400 mutual sign-off", speed: "18 mins", type: "Third-Party" },
    { loc: "TN-05 Collision", amount: "₹68,000 settled", speed: "2.4 hrs", type: "Cashless Garage" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-body selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden mesh-bg-light dot-grid">
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[130px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[130px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 text-left space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider"
              >
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                Indian Road Infrastructure Core
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight font-outfit"
              >
                We handle the <br /> 
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  aftermath.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl"
              >
                Incident reporting, automated damage estimation, and direct claims settlement. Engineered for Indian roads, compliant with RTO and IRDAI guidelines.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <Link to="/register" className="premium-btn-primary">
                  Create Locker Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/knowledge" className="premium-btn-secondary">
                  Browse statutory guides
                </Link>
              </motion.div>
            </div>

            {/* Right Interactive Simulator - Double Device Mockup */}
            <div className="lg:col-span-6 relative mt-6 lg:mt-0 flex flex-col md:flex-row gap-6 items-center">
              
              {/* Device 1: Mobile App Frame */}
              <div className="w-full max-w-[280px] bg-slate-950 border-[6px] border-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden aspect-[9/18] flex flex-col justify-between shrink-0">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-b-xl z-35 flex items-center justify-center">
                  <div className="w-12 h-1.5 bg-slate-800 rounded-full mb-1" />
                </div>

                {/* Mobile screen content */}
                <div className="p-4 pt-8 flex-1 flex flex-col justify-between text-white font-mono text-[10px]">
                  
                  {/* Header info */}
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-[8px] font-bold text-slate-400">ACCIDENTALERT MOBILE</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>

                  {/* Dynamic Mobile Simulator View */}
                  <div className="my-3 flex-1 flex flex-col justify-between">
                    
                    {/* Simulated Camera Window */}
                    <div className="h-28 bg-zinc-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-zinc-800">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15))] pointer-events-none" />
                      
                      {simDamageScanActive ? (
                        <>
                          {simScanProgress < 100 ? (
                            <div className="text-center space-y-2">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
                              <p className="text-[8px] text-blue-400 animate-pulse">SCANNING: {simScanProgress}%</p>
                            </div>
                          ) : (
                            <div className="text-center space-y-1">
                              <Check className="w-6 h-6 mx-auto text-emerald-400" />
                              <p className="text-[8px] text-emerald-400">SCAN COMPLETED</p>
                              <p className="text-[7px] text-slate-500">FRONT BUMPER / RADIATOR</p>
                            </div>
                          )}
                          <motion.div 
                            animate={{ y: [-50, 50, -50] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute left-0 right-0 h-[1.5px] bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                          />
                        </>
                      ) : simSosAlertActive ? (
                        <div className="text-center space-y-2">
                          <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-rose-500 opacity-20"></span>
                          <Phone className="w-6 h-6 text-rose-500 mx-auto animate-bounce" />
                          <p className="text-[8px] text-rose-500 font-extrabold uppercase animate-pulse">SOS ACTIVE &bull; 1033 CONNECTED</p>
                        </div>
                      ) : simClaimPayoutActive ? (
                        <div className="text-center space-y-1">
                          <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                          <p className="text-[8px] text-emerald-400 font-bold">LEDGER UPDATED</p>
                          <p className="text-[7px] text-slate-400">CLAIM VERIFIED ✓</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2 text-slate-500">
                          <Activity className="w-8 h-8 mx-auto" />
                          <p className="text-[8px]">WAITING FOR TELEMETRY INPUT</p>
                        </div>
                      )}
                    </div>

                    {/* Stats Logs */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 space-y-1 text-[8px] text-zinc-400">
                      <div className="flex justify-between"><span>DEVICE_GPS:</span><span className="text-white">NH-44 KM-92</span></div>
                      <div className="flex justify-between"><span>AADHAAR_KYC:</span><span className="text-emerald-400 font-bold">VERIFIED</span></div>
                      <div className="flex justify-between"><span>RTO_DB_SYNC:</span><span className={simDamageScanActive || simSosAlertActive ? "text-emerald-400" : "text-zinc-500"}>{simDamageScanActive || simSosAlertActive ? "LINKED" : "PENDING"}</span></div>
                    </div>

                    {/* Simulation triggers */}
                    <div className="grid grid-cols-1 gap-1.5 pt-2">
                      <button 
                        onClick={handleSimulateScan}
                        disabled={simDamageScanActive}
                        className={`w-full py-2 rounded-lg text-[8px] uppercase tracking-wider font-extrabold border transition-all ${simDamageScanActive ? 'bg-blue-950 border-blue-900 text-blue-400' : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500'}`}
                      >
                        1. Run AI Damage Scan
                      </button>
                      <button 
                        onClick={handleSimulateSos}
                        disabled={simSosAlertActive}
                        className={`w-full py-2 rounded-lg text-[8px] uppercase tracking-wider font-extrabold border transition-all ${simSosAlertActive ? 'bg-rose-955 border-rose-900 text-rose-400' : 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500'}`}
                      >
                        2. Deploy SOS Dispatch
                      </button>
                      <button 
                        onClick={handleSimulateClaim}
                        disabled={simClaimPayoutActive}
                        className={`w-full py-2 rounded-lg text-[8px] uppercase tracking-wider font-extrabold border transition-all ${simClaimPayoutActive ? 'bg-emerald-950 border-emerald-900 text-emerald-400' : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'}`}
                      >
                        3. File Payout Claim
                      </button>
                    </div>

                  </div>

                  {/* Reset Option */}
                  <button 
                    onClick={resetSimulator} 
                    className="border border-zinc-800 hover:border-zinc-700 py-1.5 rounded-lg text-[8px] text-zinc-500 hover:text-white uppercase transition-colors"
                  >
                    Clear Simulator
                  </button>
                </div>
              </div>

              {/* Device 2: Desktop Claims Browser Console Mockup */}
              <div className="flex-1 w-full bg-white border border-slate-200 rounded-3xl shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                
                {/* Browser Tab Bar */}
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-white border border-slate-150 rounded-md px-3 py-0.5 text-[8px] font-mono text-slate-400 flex items-center gap-1.5 w-60 select-none">
                    <Lock className="w-2.5 h-2.5 text-emerald-500" />
                    <span>claims.accidentalert.in/docket/901</span>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-5 flex-1 flex flex-col justify-between text-slate-800 font-mono text-[9px]">
                  
                  {/* Console Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                    <span className="font-bold text-slate-900 uppercase">Claims Control Ledger</span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">IRDAI-API SECURED</span>
                  </div>

                  {/* Live updating interface */}
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {simDamageScanActive ? (
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold text-slate-900 border-b pb-1">
                          <span>AI SCAN PARTS ASSESSMENT</span>
                          <span className="text-blue-600 animate-pulse">{simScanProgress < 100 ? 'ANALYSIS IN PROGRESS...' : 'VERIFIED DONE'}</span>
                        </div>
                        {simScanProgress >= 25 && (
                          <div className="flex justify-between"><span>FRONT_BUMPER (DENT)</span><span className="font-bold text-slate-900">₹18,500</span></div>
                        )}
                        {simScanProgress >= 50 && (
                          <div className="flex justify-between"><span>RADIATOR_CORE (LEAK)</span><span className="font-bold text-slate-900">₹6,200</span></div>
                        )}
                        {simScanProgress >= 75 && (
                          <div className="flex justify-between border-t pt-1 font-bold text-slate-900">
                            <span>TOTAL REPAIR NET VALUE</span>
                            <span className="text-emerald-600">₹24,700</span>
                          </div>
                        )}
                      </div>
                    ) : simSosAlertActive ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-slate-900 border-b pb-1">
                          <span>SOS TELEMETRY INCOMING</span>
                          <span className="text-rose-600 animate-pulse">TRANSMITTING LOGS</span>
                        </div>
                        <div className="text-[8px] text-slate-500 space-y-0.5 font-mono">
                          <p>&bull; [0.2s] Signal verified from Aadhaar UID: ******7041</p>
                          <p>&bull; [1.1s] Coordinates mapped to NH-44 Expressway</p>
                          <p>&bull; [2.4s] NHAI Highway patrol alerted: Dispatch 1033</p>
                          <p>&bull; [3.5s] ETA tracking: Emergency ambulance dispatched</p>
                        </div>
                      </div>
                    ) : simClaimPayoutActive ? (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-400">CLAIM REFERENCE</span>
                          <span className="font-bold text-slate-800">#CLM-401206</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">NET SETTLEMENT PAYOUT</span>
                          <span className="font-bold text-slate-900">₹24,700</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-400">TRANSFER STATUS</span>
                          <span className="bg-emerald-500 text-white font-extrabold uppercase text-[7px] px-2 py-0.5 rounded">DEPOSITED (UPI/IMPS)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400">
                        <Activity className="w-6 h-6 mx-auto mb-2 text-slate-300 animate-pulse" />
                        <p>Interact with the smartphone simulator to see real-time claims logic processing.</p>
                      </div>
                    )}
                  </div>

                  {/* Browser Footer info */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[7px] text-slate-400">
                    <span>SYS_UPTIME: 99.99%</span>
                    <span>LEDGER_BLOCK: #41029</span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* TICKER LEDGER */}
      <section className="bg-slate-900 text-white py-3 overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[9px] font-mono whitespace-nowrap">
          <div className="flex items-center gap-2 font-bold text-blue-400 uppercase shrink-0">
            <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>Live Ticker:</span>
          </div>
          <div className="flex gap-12 animate-[marquee_25s_linear_infinite] overflow-x-hidden w-full pl-8">
            {systemTicker.map((tick, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="text-slate-400">{tick.loc}</span>
                <span className="font-bold text-white">{tick.amount}</span>
                <span className="text-slate-500">({tick.speed})</span>
                <span className="text-blue-500 text-[8px] uppercase tracking-wider font-extrabold">{tick.type}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS SHOWCASE */}
      <section id="network" className="py-32 bg-white relative border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col items-center text-center mb-20 space-y-4">
            <span className="badge-premium-blue">Core Infrastructure</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-outfit uppercase">
              The Three Pillars of Safety.
            </h2>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              An integrated framework connecting drivers, emergency teams, and cashless insurance pathways.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* PILLAR 1: AI Visual Assessor */}
            <div className="premium-card flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center mb-6 border border-slate-100">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit uppercase mb-2">1. AI Visual Assessor</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Estimate vehicle repair costs according to standard Indian market rates, parts catalogs, and part depreciation rules.
                </p>

                {/* Car Parts selector interactive */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3 font-mono text-[9px]">
                  <div className="flex justify-between border-b pb-1 font-bold text-slate-700">
                    <span>SECTOR TARGET</span>
                    <span>EST. PARTS VALUE</span>
                  </div>
                  <div className="flex justify-between"><span>Front Fender Bumper</span><span className="font-bold text-slate-950">₹18,500</span></div>
                  <div className="flex justify-between"><span>Left LED Headlight</span><span className="font-bold text-slate-950">₹6,200</span></div>
                  <div className="flex justify-between"><span>Engine Hood/Radiator</span><span className="font-bold text-slate-950">₹14,000</span></div>
                </div>
              </div>
              
              <Link to="/report" className="font-extrabold text-[10px] text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-2 mt-6">
                Try scanning tool <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>

            {/* PILLAR 2: Indian Statute Explorer */}
            <div className="premium-card flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center mb-6 border border-slate-100">
                  <Gavel className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit uppercase mb-2">2. Statutory Legal Guide</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Understand your legal rights, bystander immunity rules, and compensation funds under the Motor Vehicles Act 1988.
                </p>

                {/* Statute Toggles */}
                <div className="flex border border-slate-100 rounded-xl p-1 mb-4 bg-slate-50">
                  {Object.keys(statutoryGuides).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStatute(key)}
                      className={`flex-1 py-1.5 text-[8px] font-extrabold uppercase rounded-lg transition-colors ${selectedStatute === key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-[9px] min-h-[140px] flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{statutoryGuides[selectedStatute].title}</h4>
                    <p className="text-[8px] text-slate-400 mb-2">{statutoryGuides[selectedStatute].law}</p>
                    <p className="text-slate-500 leading-relaxed mb-2">{statutoryGuides[selectedStatute].desc}</p>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2 space-y-1 text-slate-600">
                    {statutoryGuides[selectedStatute].points.slice(0, 2).map((pt, i) => (
                      <p key={i} className="flex gap-1"><span className="text-blue-500 font-bold">&bull;</span> {pt}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link to="/knowledge/rights" className="font-extrabold text-[10px] text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-2 mt-6">
                Read full statutes <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>

            {/* PILLAR 3: Emergency Dispatch Coordination */}
            <div className="premium-card flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center mb-6 border border-slate-100">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit uppercase mb-2">3. Emergency Help Map</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Pinpoint nearby emergency clinics, RTO police stations, and cashless garages on your route.
                </p>

                {/* Map list mock */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2 text-[9px] font-mono">
                  <div className="flex justify-between items-center p-1.5 bg-white border border-slate-100 rounded-lg">
                    <span className="font-bold text-slate-800">City Trauma Center</span>
                    <span className="text-blue-600">3.4 KM &middot; ETA 7M</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-white border border-slate-100 rounded-lg">
                    <span className="font-bold text-slate-800">RTO Cashless Garage</span>
                    <span className="text-emerald-600">Active Network</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-white border border-slate-100 rounded-lg">
                    <span className="font-bold text-slate-800">NHAI Patrol Unit</span>
                    <span className="text-slate-500">Connected Dispatch</span>
                  </div>
                </div>
              </div>
              
              <Link to="/nearby" className="font-extrabold text-[10px] text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-2 mt-6">
                Search nearby aid <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* CORE CAPABILITIES BENTO GRID */}
      <section className="py-32 bg-slate-50 relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col items-center text-center mb-24 space-y-4">
            <span className="badge-premium-blue">Unified Suite Capabilities</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-outfit uppercase">
              Engineered for road safety.
            </h2>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              Everything you need to handle road incidents, compile legal dossiers, and secure payouts.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {features.map((feature, i) => (
              <Link 
                key={i} 
                to={feature.link}
                className={`bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-slate-900 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between ${feature.span}`}
              >
                <div>
                  <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-950 group-hover:text-white transition-colors border border-slate-100">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tight flex items-center gap-1.5 font-outfit">
                    {feature.title}
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-plus-jakarta">{feature.desc}</p>
                </div>
                {feature.customGraphic}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ROAD SCENARIO SIMULATOR TIMELINE */}
      <section className="py-32 bg-white border-t border-slate-150 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Sticky info */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <span className="badge-premium-blue">Operational Sequence</span>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-outfit uppercase">Scenario Walker.</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Select a common road scenario to simulate how AccidentAlert coordinates with RTO databases, insurers, and rescuers:
              </p>
              
              <div className="flex flex-col gap-2 pt-2">
                {[
                  { key: 'highway', label: 'Highway Collision (NH-44)' },
                  { key: 'minor', label: 'Minor City Fender-Bender' },
                  { key: 'bystander', label: 'Bystander Responding to Victim' }
                ].map((scen) => (
                  <button
                    key={scen.key}
                    onClick={() => setSelectedScenario(scen.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all border ${selectedScenario === scen.key ? 'bg-slate-950 border-slate-950 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-350'}`}
                  >
                    {scen.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="lg:col-span-8 space-y-6">
              {scenarioTimeline[selectedScenario].map((item, i) => (
                <div key={i} className="flex gap-6 sm:gap-8 items-start p-6 bg-slate-50 border border-slate-150 rounded-2xl">
                  <span className="text-3xl font-black text-blue-100 shrink-0 font-outfit mt-1">{item.step}</span>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 uppercase font-outfit">{item.action}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-plus-jakarta">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* METRICS PLATFORM LEDGER */}
      <section className="py-24 bg-slate-50 border-y border-slate-150">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'System Uptime', val: '99.99%', sub: 'High Availability Core' },
              { label: 'Claim Payout Speed', val: '1.8 hrs', sub: 'Median Settlement Duration' },
              { label: 'Legal Accuracy Record', val: '100%', sub: 'Verified Motor Vehicle Acts' },
              { label: 'Secure Storage Encryption', val: 'AES-256', sub: 'Hardware Security Level' }
            ].map((stat, i) => (
              <div key={i} className="text-center lg:text-left space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-extrabold text-slate-950 tracking-tight uppercase font-outfit">{stat.val}</p>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest font-plus-jakarta">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL FEED */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col items-center text-center mb-24 space-y-4">
            <span className="badge-premium-blue">Endorsements</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-outfit uppercase">Trusted by Professionals.</h2>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
              Hear what legal practitioners, medical officers, and policy holders say about the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                user: 'Advocate Rahul Sharma',
                role: 'High Court Litigator',
                quote: 'The MACT jurisdictional guides and legal templates correspond exactly to statutory codes. It streamlines dispute auditing significantly.',
                stars: 5
              },
              {
                user: 'Dr. Vaibhav Kumar',
                role: 'Trauma Specialist',
                quote: 'Integrating the Golden Hour guidelines directly into a roadside reporting sequence saves critical lives by coordinating response times.',
                stars: 5
              },
              {
                user: 'Mongeral. Viraj Suman',
                role: 'Policyholder',
                quote: 'The claim appeal draft saved me ₹35,000 in repair charges after my own-damage claim was wrongfully rejected. Incredibly helpful.',
                stars: 5
              }
            ].map((rev, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-150 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(rev.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 font-medium italic leading-relaxed">"{rev.quote}"</p>
                </div>
                
                <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {rev.user[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 font-outfit">{rev.user}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="py-32 bg-slate-50 border-t border-slate-150">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-20 space-y-4">
            <span className="badge-premium-blue">Support Desk</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-outfit uppercase">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {Object.keys(statutoryGuides).map((key, i) => {
              const isOpen = faqOpen[i];
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }))}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 font-outfit uppercase tracking-tight">{statutoryGuides[key].title} - statutory rights?</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-800' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 pt-0 border-t border-slate-100 text-xs text-slate-500 leading-relaxed font-plus-jakarta">
                          {statutoryGuides[key].desc} Let AccidentAlert assist you with resolving this under {statutoryGuides[key].law}.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* GLOBAL FOOTER CALL-TO-ACTION */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Radial Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500 blur-[150px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_#ffffff_1px,_transparent_0)] bg-[size:32px_32px] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center space-y-10">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">SECURED GATEWAY ENTRY</span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] font-outfit uppercase">
            Simplify Your <br className="sm:hidden" />
            <span className="text-slate-400">Road Claims.</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-plus-jakarta leading-relaxed">
            Create a secure locker profile and register your insurance policies to protect yourself and your passengers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              Create Locker Account
            </Link>
            <button 
              onClick={() => window.location.href = 'mailto:resolve359@gmail.com'}
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Get Support
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
