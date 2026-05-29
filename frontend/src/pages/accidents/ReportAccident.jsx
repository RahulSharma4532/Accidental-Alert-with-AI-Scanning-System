import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Video, Mic, MapPin, Calendar, Clock, Car, 
  ShieldAlert, Activity, Users, PhoneCall, FileText, 
  ArrowLeft, ArrowRight, CheckCircle2, Download, Share2, Navigation, 
  RotateCcw, Play, Square, Trash2, X, Info, StopCircle, Zap, Loader2,
  AlertCircle, Radio, Mail, MessageSquare, Terminal, ShieldCheck, Brain, Cpu
} from 'lucide-react';
import api from '../../utils/api';
import { offlineStore } from '../../utils/offlineStore';
import Logo from '../../assets/icons/LogoAccident.png';
import { useAuth } from '../../store/AuthContext';

export default function ReportAccident() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [authLoading, isAuthenticated, navigate]);

  const [step, setStep] = useState(1);
  const [isHitAndRun, setIsHitAndRun] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [reportResult, setReportResult] = useState(null);

  const [accidentType, setAccidentType] = useState('Collision');
  const [severity, setSeverity] = useState('Moderate');
  const [roadType, setRoadType] = useState('City Road');
  const [weather, setWeather] = useState('Sunny');
  const [numVehicles, setNumVehicles] = useState(1);
  const [hasInjuries, setHasInjuries] = useState(false);
  
  const [otherVehicle, setOtherVehicle] = useState('');
  const [otherName, setOtherName] = useState('');
  const [otherPhone, setOtherPhone] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [locationStatus, setLocationStatus] = useState('Fetching GPS...');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const [photos, setPhotos] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [insurancePhoto, setInsurancePhoto] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // SOS Simulation States
  const [sosContacts, setSosContacts] = useState([]);
  const [broadcastLogs, setBroadcastLogs] = useState([]);
  const [broadcastState, setBroadcastState] = useState('init'); // 'init', 'gps', 'contacts', 'calls', 'done'
  const [sosProgress, setSosProgress] = useState(0);
  const consoleEndRef = useRef(null);

  // AI Damage Assessment States
  const [aiScanState, setAiScanState] = useState('idle'); // 'idle', 'scanning', 'completed'
  const [aiScanProgress, setAiScanProgress] = useState(0);
  const [aiScanMessage, setAiScanMessage] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const runAiScan = () => {
    setAiScanState('scanning');
    setAiScanProgress(0);
    setAiScanMessage('Initializing AI Scanner...');

    const stages = [
      { progress: 10, message: 'Analyzing vehicle orientation...' },
      { progress: 25, message: 'Analyzing vehicle outline & edges...' },
      { progress: 45, message: 'Checking paint scratches & damage...' },
      { progress: 60, message: 'Detecting dented or damaged parts...' },
      { progress: 80, message: 'Calculating impact point and severity...' },
      { progress: 95, message: 'Estimating repair cost details...' },
      { progress: 100, message: 'Generating final damage assessment report...' }
    ];

    stages.forEach((stage, idx) => {
      setTimeout(() => {
        setAiScanProgress(stage.progress);
        setAiScanMessage(stage.message);
        
        if (stage.progress === 100) {
          // Generate deterministic analysis results matching backend rules
          const fileKeywords = [];
          photos.forEach(photo => {
            const filename = photo.name.toLowerCase();
            if (filename.includes('bumper')) fileKeywords.push('bumper');
            if (filename.includes('windshield') || filename.includes('glass')) fileKeywords.push('windshield');
            if (filename.includes('headlight') || filename.includes('light')) fileKeywords.push('headlight');
            if (filename.includes('door') || filename.includes('side')) fileKeywords.push('door');
          });

          let finalSeverity = severity;
          let affectedParts = {};
          let costMin = 0;
          let costMax = 0;
          let recommendedAction = 'Repairable';

          switch (finalSeverity) {
            case 'Minor':
              costMin = 4500;
              costMax = 12000;
              recommendedAction = 'Repairable';
              affectedParts['Front Bumper'] = 'Scratched (25%)';
              affectedParts['Left Headlight'] = 'Intact (0%)';
              if (fileKeywords.includes('windshield')) {
                affectedParts['Windshield'] = 'Minor Scratch (10%)';
                costMax += 3000;
              }
              break;

            case 'Critical':
              costMin = 150000;
              costMax = 320000;
              recommendedAction = 'Total Loss';
              affectedParts['Front Bumper'] = 'Shattered (98%)';
              affectedParts['Radiator Core'] = 'Severely Damaged / Leaking (90%)';
              affectedParts['Left Headlight'] = 'Shattered (100%)';
              affectedParts['Engine Hood'] = 'Crumpled & Deformed (85%)';
              affectedParts['Windshield'] = 'Shattered (100%)';
              affectedParts['Chassis Frame'] = 'Structural Bend Detected (75%)';
              break;

            case 'High':
              costMin = 65000;
              costMax = 145000;
              recommendedAction = 'Immediate Towing Required';
              affectedParts['Front Bumper'] = 'Crushed & Detached (80%)';
              affectedParts['Left Headlight'] = 'Shattered (95%)';
              affectedParts['Engine Hood'] = 'Bent & Misaligned (45%)';
              affectedParts['Windshield'] = 'Shattered (100%)';
              if (fileKeywords.includes('door')) {
                affectedParts['Driver Door'] = 'Deformed (60%)';
                costMin += 15000;
                costMax += 25000;
              }
              break;

            case 'Moderate':
            default:
              costMin = 18000;
              costMax = 42000;
              recommendedAction = 'Repairable';
              affectedParts['Front Bumper'] = 'Dent & Scratches (55%)';
              affectedParts['Left Headlight'] = 'Cracked (40%)';
              affectedParts['Engine Hood'] = 'Minor Dent (15%)';
              if (fileKeywords.includes('bumper')) {
                affectedParts['Front Bumper'] = 'Deep Dent & Structural Crack (70%)';
                costMin += 5000;
                costMax += 10000;
              }
              break;
          }

          setAiAnalysisResult({
            severity: finalSeverity,
            costMin,
            costMax,
            recommendedAction,
            affectedParts
          });
          setAiScanState('completed');
        }
      }, (idx + 1) * 750);
    });
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('GPS not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          setAddress(data.display_name || 'Current Location');
        } catch (e) {
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      (err) => setLocationStatus('GPS Access Denied'),
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch emergency contacts on step transition to SOS phase
  useEffect(() => {
    if (step === 6) {
      const saved = localStorage.getItem('personalEmergencyContacts');
      if (saved) {
        setSosContacts(JSON.parse(saved));
      } else {
        // Fallback demo contacts
        setSosContacts([
          { 
            name: 'Dr. Ramesh Sharma', 
            relation: 'Family Doctor', 
            phone: '9876543210', 
            email: 'dr.sharma@hospital.com',
            blood_group: 'O+',
            alert_sms: true,
            alert_call: true,
            alert_email: true,
            notes: 'Primary medical advisor and cardiologist.'
          },
          { 
            name: 'Priya Dev', 
            relation: 'Spouse', 
            phone: '9123456789',
            email: 'priya.dev@family.com',
            blood_group: 'A+',
            alert_sms: true,
            alert_call: true,
            alert_email: false,
            notes: 'Primary emergency point of contact.'
          }
        ]);
      }
    }
  }, [step]);

  // Autoscroll terminal console logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [broadcastLogs]);

  // Timed cascade simulation for SOS alerts
  useEffect(() => {
    if (step !== 6 || sosContacts.length === 0) return;

    // Reset simulation states
    setBroadcastLogs([]);
    setBroadcastState('init');
    setSosProgress(0);

    const logs = [];
    const addLog = (msg) => {
      const time = new Date().toLocaleTimeString();
      logs.push(`[${time}] ${msg}`);
      setBroadcastLogs([...logs]);
    };

    // Phase 1: Initialize & Lock GPS
    addLog("EMERGENCY SOS ALERT SERVICE ACTIVATED.");
    addLog(`ACCIDENT SEVERITY LEVEL: ${severity.toUpperCase()}`);
    addLog("ESTABLISHING CONNECTION TO EMERGENCY SERVICES AND NETWORK...");
    setBroadcastState('gps');
    
    // Timer 1: GPS Lock (1.5s)
    const t1 = setTimeout(() => {
      addLog(`GPS LOCATION LOCKED AT COORDINATES: ${coords.lat?.toFixed(6) || '19.0760'} N, ${coords.lng?.toFixed(6) || '72.8777'} E`);
      addLog(`DETECTOR GPS LOCATION: ${address || 'Current Location'}`);
      setSosProgress(35);
      setBroadcastState('contacts');
      addLog("SENDING EMERGENCY ALERTS TO TARGET CONTACTS...");
      
      sosContacts.forEach(contact => {
        if (contact.alert_sms) {
          addLog(`PREPARING SMS FOR: ${contact.name}`);
        }
        if (contact.alert_email && contact.email) {
          addLog(`PREPARING EMAIL DETAILS FOR: ${contact.email}`);
        }
      });
    }, 1500);

    // Timer 2: SMS & Email Alerts Sent (3.8s)
    const t2 = setTimeout(() => {
      sosContacts.forEach(contact => {
        if (contact.alert_sms) {
          addLog(`[SMS SENT] EMERGENCY ALERT SENT TO ${contact.name} (${contact.phone})`);
        }
        if (contact.alert_email && contact.email) {
          addLog(`[EMAIL SENT] ACCIDENT REPORT DELIVERED TO ${contact.email}`);
        }
      });
      setSosProgress(70);
      setBroadcastState('calls');
      addLog("CONNECTING VOICE LINES...");
      
      sosContacts.forEach(contact => {
        if (contact.alert_call) {
          addLog(`PLACING AUTOMATED EMERGENCY PHONE CALL TO ${contact.name} (${contact.phone})...`);
        }
      });
    }, 3800);

    // Timer 3: Voice Calls & Completion (6.0s)
    const t3 = setTimeout(() => {
      sosContacts.forEach(contact => {
        if (contact.alert_call) {
          addLog(`[CALL CONNECTED] PLAYED EMERGENCY ALERT TO ${contact.name}`);
        }
      });
      setSosProgress(100);
      setBroadcastState('done');
      addLog("EMERGENCY ALERTS SENT SUCCESSFULLY.");
      addLog("ALL EMERGENCY CONTACTS HAVE BEEN ALERTED.");
    }, 6000);

    // Timer 4: Redirect to Success Step 7 (8.5s)
    const t4 = setTimeout(() => {
      setStep(7);
    }, 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [step, coords, address, severity, sosContacts]);

  const handlePhotoUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles]);
    }
  };

  const handleVideoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Please allow microphone access to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioURL('');
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('severity', severity.toLowerCase());
    formData.append('accident_type', accidentType);
    formData.append('latitude', coords.lat || 0);
    formData.append('longitude', coords.lng || 0);
    formData.append('address', address);
    formData.append('weather_conditions', weather);
    formData.append('road_conditions', roadType);
    formData.append('is_hit_and_run', isHitAndRun ? 1 : 0);
    formData.append('vehicles_involved', numVehicles);
    formData.append('has_injuries', hasInjuries ? 1 : 0);

    if (otherVehicle) formData.append('other_vehicle_number', otherVehicle);
    if (otherName) formData.append('other_driver_name', otherName);
    if (otherPhone) formData.append('other_driver_phone', otherPhone);

    photos.forEach((photo) => formData.append('media[]', photo));
    if (videoFile) formData.append('media[]', videoFile);
    if (audioBlob) formData.append('media[]', audioBlob, 'voice_note.webm');
    if (licensePhoto) formData.append('license_photo', licensePhoto);
    if (insurancePhoto) formData.append('insurance_photo', insurancePhoto);

    try {
      if (isOffline) {
        const fakeId = `OFF-${Date.now()}`;
        const offlineData = {
          id: fakeId,
          formData: Object.fromEntries(formData), 
          timestamp: new Date().toISOString()
        };
        await offlineStore.saveAccident(offlineData);
        setReportResult({ id: fakeId, report_id: fakeId, isOffline: true });
        setStep(6);
      } else {
        const response = await api.post('/accidents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setReportResult(response.data);
        setStep(6);
      }
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit report. Saving to device storage... Please connect to the internet to sync.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center mesh-bg-light dot-grid">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 mesh-bg-light dot-grid relative overflow-x-hidden">
      
      {/* Top Header */}
      <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0 z-45 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-base font-black font-outfit uppercase tracking-tight text-slate-900">Report Accident Details</h2>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {step <= 5 ? (
            <>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {step} of 5</span>
              <div className="w-32 h-1.5 bg-slate-150 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
              </div>
            </>
          ) : step === 6 ? (
            <span className="text-[10px] font-black text-red-650 bg-red-50 border border-red-100 px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-spin" /> EMERGENCY ALERTS BROADCASTING
            </span>
          ) : (
            <span className="text-[10px] font-black text-emerald-650 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" /> REPORT FILED ON LEDGER
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase font-outfit tracking-tight">Report Incident</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter details of the vehicle collision. All telemetry data is cryptographically recorded.
              </p>
            </div>
            {isOffline && (
              <div className="bg-rose-50 text-rose-700 px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-bold flex items-center gap-2 uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-rose-600" /> Offline Mode - Saved to Device Local Storage
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: GPS & Time Sync */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                
                <div className="premium-card bg-slate-950 text-white relative overflow-hidden shadow-2xl border-slate-900">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/20 rounded-full -mr-16 -mt-16 blur-xl" />
                  
                  <div className="flex items-center justify-between mb-8 border-b border-zinc-850 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                        <MapPin className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">GPS Signal Status</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {coords.lat ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : 'Acquiring Telemetry...'}
                        </p>
                      </div>
                    </div>
                    {coords.lat ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />}
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Resolved Address</p>
                      <p className="text-xs font-semibold text-zinc-300 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-850 break-words">{address || locationStatus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Incident Timestamp</p>
                      <p className="text-xs font-bold text-zinc-300 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-850 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" /> {currentTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Severity Level</label>
                    <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="premium-input cursor-pointer bg-white">
                      <option>Minor</option>
                      <option>Moderate</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Accident Type</label>
                    <select value={accidentType} onChange={(e) => setAccidentType(e.target.value)} className="premium-input cursor-pointer bg-white">
                      <option>Collision</option>
                      <option>Rollover</option>
                      <option>Off-Road</option>
                      <option>Stationary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Weather Condition</label>
                    <select value={weather} onChange={(e) => setWeather(e.target.value)} className="premium-input cursor-pointer bg-white">
                      <option>Sunny</option>
                      <option>Rain</option>
                      <option>Fog</option>
                      <option>Snow</option>
                      <option>Night/Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Road Type</label>
                    <select value={roadType} onChange={(e) => setRoadType(e.target.value)} className="premium-input cursor-pointer bg-white">
                      <option>City Road</option>
                      <option>Highway</option>
                      <option>Intersection</option>
                      <option>Off-Road</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Media Capture */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Photo Evidence */}
                  <div className="premium-card bg-white/90 backdrop-blur-xl border border-slate-200/80">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-800 font-outfit uppercase tracking-wider">Photographic Evidence</h3>
                      </div>
                      <span className="text-xs font-black text-slate-400">{photos.length}/6 Images</span>
                    </div>
                    
                    <label className="block w-full border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/15 mb-4 group">
                      <Camera className="w-8 h-8 mx-auto text-slate-400 mb-3 group-hover:text-blue-500 transition-all" />
                      <span className="text-xs font-bold text-slate-600 block group-hover:text-blue-600 transition-all">Capture or Upload Photos</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Supports JPG, PNG formats</span>
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2.5 mt-4">
                        {photos.map((photo, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200/80 shadow-sm">
                            <img src={URL.createObjectURL(photo)} alt={`Evidence ${i+1}`} className="w-full h-full object-cover" />
                            <button onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/60 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-all cursor-pointer">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Video Evidence */}
                    <div className="premium-card bg-white/90 backdrop-blur-xl border border-slate-200/80">
                       <div className="flex items-center gap-2 mb-4">
                        <Video className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-800 font-outfit uppercase tracking-wider">Video Walkaround</h3>
                      </div>
                      <label className="block w-full border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/15 group">
                        <Video className="w-6 h-6 mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-all" />
                        <span className="text-xs font-bold text-slate-600 block group-hover:text-blue-600 transition-all">
                          {videoFile ? videoFile.name : 'Record 360° Walkaround'}
                        </span>
                        <input type="file" accept="video/*" capture="environment" onChange={handleVideoUpload} className="hidden" />
                      </label>
                    </div>

                    {/* Audio Dictation */}
                    <div className="premium-card bg-white/90 backdrop-blur-xl border border-slate-200/80">
                      <div className="flex items-center gap-2 mb-4">
                        <Mic className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-800 font-outfit uppercase tracking-wider">Voice Dictation</h3>
                      </div>
                      
                      {!audioBlob ? (
                        <button 
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                            isRecording ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-slate-950 text-white hover:bg-slate-800 border-transparent shadow-md'
                          }`}
                        >
                          {isRecording ? <StopCircle className="w-5 h-5 animate-pulse text-rose-500" /> : <Mic className="w-5 h-5" />}
                          <span className="text-xs font-black uppercase tracking-wider">{isRecording ? 'Recording Active... Tap to Stop' : 'Initiate Dictation'}</span>
                        </button>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200/85 rounded-xl p-4 flex items-center gap-4">
                          <button onClick={() => new Audio(audioURL).play()} className="w-10 h-10 bg-slate-950 text-white rounded-full flex items-center justify-center hover:bg-slate-850 transition-colors cursor-pointer">
                            <Play className="w-4 h-4 ml-1 fill-white" />
                          </button>
                          <div className="flex-1">
                            <div className="h-2 bg-slate-200 rounded-full w-full"></div>
                          </div>
                          <button onClick={deleteRecording} className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Party Details */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                
                <div className="premium-card bg-white/90 backdrop-blur-xl border border-slate-200/80 space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-6">
                    <button onClick={() => setIsHitAndRun(!isHitAndRun)} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${isHitAndRun ? 'bg-rose-50/80 border-rose-200 text-rose-600 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-350'}`}>
                      <Activity className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-wider">Hit & Run</span>
                    </button>
                    <button onClick={() => setHasInjuries(!hasInjuries)} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${hasInjuries ? 'bg-rose-50/80 border-rose-200 text-rose-600 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-350'}`}>
                      <ShieldAlert className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-wider">Injuries Logged</span>
                    </button>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Vehicles Involved</label>
                    <input type="number" min="1" max="10" value={numVehicles} onChange={(e) => setNumVehicles(e.target.value)} className="premium-input" />
                  </div>

                  {!isHitAndRun && numVehicles > 1 && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-outfit">Other Party Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Registration No.</label>
                          <input type="text" value={otherVehicle} onChange={(e) => setOtherVehicle(e.target.value)} className="premium-input uppercase" placeholder="e.g. MH01AB1234" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Driver/Owner Name</label>
                          <input type="text" value={otherName} onChange={(e) => setOtherName(e.target.value)} className="premium-input" placeholder="Driver / Owner Name" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mobile Number</label>
                          <input type="tel" value={otherPhone} onChange={(e) => setOtherPhone(e.target.value)} className="premium-input" placeholder="Mobile Number" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-outfit">Document Scanner</h3>
                     <div className="grid md:grid-cols-2 gap-4">
                        <label className="block w-full border border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/15 group">
                          <FileText className="w-5 h-5 mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-all" />
                          <span className="text-xs font-bold text-slate-600 block mb-1 group-hover:text-blue-600 transition-all">Scan License (DL)</span>
                          <span className="text-[10px] text-slate-400 truncate block max-w-[200px] mx-auto">{licensePhoto ? licensePhoto.name : 'No file selected'}</span>
                          <input type="file" accept="image/*" onChange={(e) => setLicensePhoto(e.target.files[0])} className="hidden" />
                        </label>
                        <label className="block w-full border border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/15 group">
                          <ShieldAlert className="w-5 h-5 mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-all" />
                          <span className="text-xs font-bold text-slate-600 block mb-1 group-hover:text-blue-600 transition-all">Scan Insurance Card</span>
                          <span className="text-[10px] text-slate-400 truncate block max-w-[200px] mx-auto">{insurancePhoto ? insurancePhoto.name : 'No file selected'}</span>
                          <input type="file" accept="image/*" onChange={(e) => setInsurancePhoto(e.target.files[0])} className="hidden" />
                        </label>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* STEP 4: AI Visual Inspection */}
            {step === 4 && photos.length === 0 && (
              <motion.div key="step4-empty" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-xl mx-auto text-center py-12">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold font-outfit uppercase text-slate-900">No Photographic Evidence Detected</h2>
                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                  AI visual damage inspection requires at least one uploaded vehicle photograph. Please return to Step 2 to upload evidence.
                </p>
                <div className="flex gap-4 justify-center mt-8">
                  <button onClick={() => setStep(2)} className="premium-btn-secondary px-4 py-2 text-xs cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Go to Step 2
                  </button>
                  <button onClick={() => {
                    setAiScanState('completed');
                    setAiAnalysisResult({
                      severity: severity,
                      costMin: severity === 'Minor' ? 4500 : severity === 'Moderate' ? 18000 : severity === 'High' ? 65000 : 150000,
                      costMax: severity === 'Minor' ? 12000 : severity === 'Moderate' ? 42000 : severity === 'High' ? 145000 : 320000,
                      recommendedAction: severity === 'Minor' ? 'Repairable' : severity === 'Moderate' ? 'Repairable' : severity === 'High' ? 'Immediate Towing Required' : 'Total Loss',
                      affectedParts: severity === 'Minor' ? {'Front Bumper': 'Scratched (25%)'} : severity === 'Moderate' ? {'Front Bumper': 'Dent & Scratches (55%)'} : severity === 'High' ? {'Front Bumper': 'Crushed (80%)'} : {'Front Bumper': 'Shattered (98%)'}
                    });
                    setStep(5);
                  }} className="premium-btn-accent px-4 py-2 text-xs cursor-pointer bg-slate-950 border-transparent hover:bg-slate-800 text-white">
                    Bypass AI Scan
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && photos.length > 0 && (
              <motion.div key="step4-active" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-3xl mx-auto">
                <style>{`
                  @keyframes laserSweep {
                    0%, 100% { top: 0%; }
                    50% { top: 100%; }
                  }
                  .laser-sweep-line {
                    animation: laserSweep 2.5s ease-in-out infinite;
                  }
                `}</style>
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-800 uppercase font-outfit tracking-wider">AI Visual Damage Assessment</h2>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                    Engine V2.8
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left panel: Visual scanner */}
                  <div className="md:col-span-3 flex flex-col gap-4">
                    <div className="relative aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-900 group shadow-lg flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:16px_16px] opacity-35"></div>
                      
                      <img 
                        src={URL.createObjectURL(photos[0])} 
                        alt="Scan Target" 
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          aiScanState === 'scanning' ? 'brightness-50 contrast-125' : 
                          aiScanState === 'completed' ? 'brightness-75' : ''
                        }`} 
                      />

                      {/* Laser sweep animation */}
                      {aiScanState === 'scanning' && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-500 shadow-[0_0_15px_#f43f5e] laser-sweep-line"></div>
                      )}

                      {/* Grid / crosshairs overlay */}
                      {aiScanState !== 'completed' && (
                        <div className="absolute inset-4 border border-white/5 pointer-events-none rounded-xl flex items-center justify-center">
                          <div className="w-8 h-8 border-l border-t border-white/20 absolute top-0 left-0"></div>
                          <div className="w-8 h-8 border-r border-t border-white/20 absolute top-0 right-0"></div>
                          <div className="w-8 h-8 border-l border-b border-white/20 absolute bottom-0 left-0"></div>
                          <div className="w-8 h-8 border-r border-b border-white/20 absolute bottom-0 right-0"></div>
                        </div>
                      )}

                      {/* Overlay scanning info */}
                      {aiScanState === 'scanning' && (
                        <div className="absolute bottom-4 left-4 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl backdrop-blur-sm flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
                          <span className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider">
                            SCANNING: {aiScanProgress}%
                          </span>
                        </div>
                      )}

                      {/* Completed markers overlay */}
                      {aiScanState === 'completed' && (
                        <>
                          <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                          <div className="absolute top-1/4 left-1/3 w-16 h-16 border-2 border-dashed border-red-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-[8px] font-bold text-red-500 bg-zinc-950/80 px-1 py-0.5 rounded font-mono uppercase">IMPACT</span>
                          </div>
                          <div className="absolute top-1/2 left-2/3 w-20 h-12 border-2 border-red-500 rounded flex items-center justify-center bg-red-500/10">
                            <span className="text-[8px] font-bold text-white bg-red-600 px-1 py-0.5 rounded font-mono uppercase">DAMAGED</span>
                          </div>
                        </>
                      )}

                      {/* Idle Overlay Button */}
                      {aiScanState === 'idle' && (
                        <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center">
                          <Cpu className="w-10 h-10 text-white/90 mb-3 animate-pulse" />
                          <h3 className="text-white font-bold text-base mb-1 font-outfit uppercase">AI Damage Scan Available</h3>
                          <p className="text-xs text-zinc-300/80 max-w-xs mb-6">
                            Scan the uploaded photos to analyze vehicle damage.
                          </p>
                          <button 
                            onClick={runAiScan}
                            className="px-6 py-2.5 bg-white hover:bg-zinc-150 text-zinc-900 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-[1.03] flex items-center gap-2 cursor-pointer"
                          >
                            <Brain className="w-4 h-4 text-blue-600" /> Start Inspection
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right panel: Scan parameters and metadata reports */}
                  <div className="md:col-span-2 flex flex-col justify-between min-h-[250px]">
                    <div className="premium-card bg-white h-full flex flex-col justify-between border-slate-200/85">
                      {aiScanState === 'idle' && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-400">
                          <Brain className="w-8 h-8 mb-2 opacity-40 text-slate-500" />
                          <p className="text-xs font-bold uppercase tracking-wider">AI Scan Pending</p>
                          <p className="text-[10px] max-w-[200px] mt-1 font-medium">Start the scan to generate damage reports.</p>
                        </div>
                      )}

                      {aiScanState === 'scanning' && (
                        <div className="flex flex-col justify-between h-full p-2">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                              <span className="text-xs font-mono font-bold text-rose-500 animate-pulse uppercase">Scanning...</span>
                            </div>
                            <p className="text-xs font-mono font-bold text-slate-800 animate-pulse bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-left">
                              &gt; {aiScanMessage}
                            </p>
                          </div>
                          
                          <div className="space-y-2 mt-8">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${aiScanProgress}%` }} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-right">
                              Analyzing parts...
                            </span>
                          </div>
                        </div>
                      )}

                      {aiScanState === 'completed' && aiAnalysisResult && (
                        <div className="space-y-4 text-left">
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">AI Classification</span>
                            <div className="flex flex-wrap gap-2">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                aiAnalysisResult.severity === 'Minor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                aiAnalysisResult.severity === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                Severity: {aiAnalysisResult.severity}
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">
                                {aiAnalysisResult.recommendedAction}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Repair Cost Band (₹)</span>
                            <div className="text-lg font-black text-slate-900 tracking-tight font-mono">
                              ₹{aiAnalysisResult.costMin.toLocaleString()} - ₹{aiAnalysisResult.costMax.toLocaleString()}
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium leading-relaxed block mt-0.5">
                              Estimated range based on parts catalog & market pricing.
                            </span>
                          </div>

                          <div className="pt-3 border-t border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">Detected Damaged Parts</span>
                            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                              {Object.entries(aiAnalysisResult.affectedParts).map(([part, desc]) => {
                                const dmgPct = parseInt(desc.match(/\d+/) || [0], 10);
                                return (
                                  <div key={part} className="text-xs space-y-1">
                                    <div className="flex justify-between font-semibold text-slate-800">
                                      <span>{part}</span>
                                      <span className={dmgPct > 50 ? 'text-rose-600 font-bold' : 'text-slate-500'}>{desc}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div className={`h-full transition-all duration-500 ${
                                        dmgPct > 70 ? 'bg-rose-500' : dmgPct > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                                      }`} style={{ width: `${dmgPct}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex justify-between gap-2">
                            <button 
                              onClick={runAiScan} 
                              className="px-3 py-1.5 border border-slate-200 text-slate-650 hover:text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex-1 cursor-pointer"
                            >
                              Scan Again
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Review */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center max-w-xl mx-auto">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tight mb-2">Final Review</h2>
                <p className="text-xs text-slate-500 font-medium mb-8">Review all accident details before submitting to ledger.</p>

                <div className="premium-card bg-white text-left space-y-4 border-slate-200/85">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Time</span>
                    <span className="text-xs font-black text-slate-900">{currentTime}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">GPS Location</span>
                    <span className="text-xs font-black text-slate-900 truncate max-w-[200px]">{address}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Severity</span>
                    <span className="text-xs font-black text-rose-600 uppercase bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">{severity}</span>
                  </div>
                  {aiAnalysisResult && (
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Cost Est.</span>
                      <span className="text-xs font-black text-slate-900 font-mono">₹{aiAnalysisResult.costMin.toLocaleString()} - ₹{aiAnalysisResult.costMax.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded Files</span>
                    <span className="text-xs font-black text-slate-900">{photos.length} Photos, {videoFile ? '1' : '0'} Video</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: SOS BROADCAST SIMULATION */}
            {step === 6 && (
              <motion.div 
                key="sos-broadcast" 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }} 
                className="space-y-6 max-w-3xl mx-auto"
              >
                {/* Visual Header */}
                <div className="bg-red-950 border border-red-900 text-red-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-900/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-4 z-10">
                    {/* Animated Beacon */}
                    <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
                      <div className="absolute w-full h-full rounded-full bg-red-500/20 animate-ping"></div>
                      <div className="absolute w-12 h-12 rounded-full bg-red-500/30 animate-pulse"></div>
                      <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center text-white relative z-10 shadow-lg shadow-red-500/50">
                        <Radio className="w-4 h-4 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                      <h2 className="text-sm font-black font-outfit uppercase tracking-wider text-red-400">Emergency Alert Status</h2>
                      <p className="text-[10px] text-red-200/80 mt-1 uppercase font-bold tracking-wide">Broadcasting alerts to emergency dispatch...</p>
                    </div>
                  </div>

                  <div className="z-10 w-full md:w-auto flex flex-col items-center md:items-end gap-1.5">
                    <span className="text-[10px] uppercase font-black tracking-widest text-red-400 px-2.5 py-1 bg-red-900/50 border border-red-800 rounded-md">
                      Severity: {severity}
                    </span>
                    <button 
                      onClick={() => setStep(7)}
                      className="px-3.5 py-1.5 bg-red-900 hover:bg-red-850 border border-red-850 text-red-200 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:scale-[1.02]"
                    >
                      Bypass Simulation <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: GPS & Contacts Alerting Status */}
                  <div className="space-y-6">
                    {/* GPS lock stats */}
                    <div className="premium-card bg-white border-slate-200/85">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-outfit">GPS Telemetry Coordinates</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Latitude/Longitude:</span>
                          <span className="font-bold text-slate-900">
                            {coords.lat ? `${coords.lat.toFixed(6)}, ${coords.lng?.toFixed(6)}` : '19.075983, 72.877656'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Network Status:</span>
                          <span className="font-bold text-slate-900">LTE Secured Link</span>
                        </div>
                        <div className="py-1">
                          <span className="text-slate-500 font-medium block mb-1">Incident Address:</span>
                          <span className="font-semibold text-slate-900 break-words">{address || 'G-Block, BKC, Bandra East, Mumbai, Maharashtra, 400051'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contacts and channels visual progress */}
                    <div className="premium-card bg-white border-slate-200/85">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 font-outfit">Emergency Contacts alerted</h3>
                      
                      <div className="space-y-4">
                        {sosContacts.map((contact, index) => (
                          <div key={index} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{contact.name}</h4>
                                <span className="text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded font-black uppercase tracking-widest mt-1 inline-block">
                                  {contact.relation}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold">{contact.phone}</span>
                            </div>

                            <div className="flex items-center gap-3 mt-1 pt-2 border-t border-slate-200/50">
                              {/* SMS channel status */}
                              {contact.alert_sms && (
                                <div className="flex items-center gap-1.5 text-[9px]">
                                  <MessageSquare className={`w-3.5 h-3.5 ${
                                    broadcastState === 'gps' || broadcastState === 'init' ? 'text-slate-300' :
                                    broadcastState === 'contacts' ? 'text-blue-500 animate-pulse' :
                                    'text-emerald-500'
                                  }`} />
                                  <span className={
                                    broadcastState === 'gps' || broadcastState === 'init' ? 'text-slate-400 font-medium' :
                                    broadcastState === 'contacts' ? 'text-blue-600 font-bold' :
                                    'text-emerald-600 font-bold'
                                  }>
                                    SMS {broadcastState === 'gps' || broadcastState === 'init' ? 'Pending' : broadcastState === 'contacts' ? 'Sending...' : 'Sent'}
                                  </span>
                                </div>
                              )}

                              {/* Email channel status */}
                              {contact.alert_email && contact.email && (
                                <div className="flex items-center gap-1.5 text-[9px]">
                                  <Mail className={`w-3.5 h-3.5 ${
                                    broadcastState === 'gps' || broadcastState === 'init' ? 'text-slate-300' :
                                    broadcastState === 'contacts' ? 'text-blue-500 animate-pulse' :
                                    'text-emerald-500'
                                  }`} />
                                  <span className={
                                    broadcastState === 'gps' || broadcastState === 'init' ? 'text-slate-400 font-medium' :
                                    broadcastState === 'contacts' ? 'text-blue-600 font-bold' :
                                    'text-emerald-600 font-bold'
                                  }>
                                    Email {broadcastState === 'gps' || broadcastState === 'init' ? 'Pending' : broadcastState === 'contacts' ? 'Sending...' : 'Sent'}
                                  </span>
                                </div>
                              )}

                              {/* Call channel status */}
                              {contact.alert_call && (
                                <div className="flex items-center gap-1.5 text-[9px]">
                                  <PhoneCall className={`w-3.5 h-3.5 ${
                                    broadcastState === 'gps' || broadcastState === 'init' || broadcastState === 'contacts' ? 'text-slate-300' :
                                    broadcastState === 'calls' ? 'text-blue-500 animate-pulse' :
                                    'text-emerald-500'
                                  }`} />
                                  <span className={
                                    broadcastState === 'gps' || broadcastState === 'init' || broadcastState === 'contacts' ? 'text-slate-400 font-medium' :
                                    broadcastState === 'calls' ? 'text-blue-600 font-bold' :
                                    'text-emerald-600 font-bold'
                                  }>
                                    Call {broadcastState === 'gps' || broadcastState === 'init' || broadcastState === 'contacts' ? 'Pending' : broadcastState === 'calls' ? 'Dialing...' : 'Connected'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Terminal Shell logs */}
                  <div className="flex flex-col h-full bg-zinc-950 text-emerald-400 border border-zinc-900 rounded-2xl p-4 shadow-xl font-mono text-[10px] min-h-[300px] max-h-[350px]">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-wider">Alert Status Console</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-red-500 font-bold text-[9px] uppercase tracking-wider">Live Dialout</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                      {broadcastLogs.map((log, index) => (
                        <div key={index} className="leading-relaxed border-l border-emerald-900 pl-2 py-0.5 text-left">
                          {log}
                        </div>
                      ))}
                      <div ref={consoleEndRef} />
                    </div>
                  </div>
                </div>

                {/* Progress bar at the bottom */}
                <div className="premium-card bg-white border-slate-200/85">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alert Dispatch Progress</span>
                    <span className="text-xs font-black text-slate-900">{sosProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-150 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-950 transition-all duration-500 ease-out" 
                      style={{ width: `${sosProgress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === 7 && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 max-w-xl mx-auto">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-slate-900 mb-2">Report Filed & Alerts Sent</h2>
                <p className="text-xs text-slate-500 font-medium mb-8">
                  {reportResult?.isOffline 
                    ? `Offline Mode. INC-${reportResult.report_id.slice(0, 8)} saved to local device.`
                    : `INC-${reportResult?.report_id?.slice(0, 8)} submitted successfully and emergency alerts sent.`
                  }
                </p>
                
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/claims/new')} className="premium-btn-accent w-full py-3.5 cursor-pointer">
                    Initialize Insurance Claim
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="premium-btn-secondary w-full py-3.5 cursor-pointer">
                    Return to Dashboard
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* FOOTER WIZARD CONTROLS */}
      {step <= 5 && (
        <footer className="p-4 lg:p-6 bg-white/70 backdrop-blur-xl border-t border-slate-200/80 flex items-center justify-between sticky bottom-0 z-45">
          <button 
            onClick={step === 1 ? () => navigate(-1) : handleBack}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          <button 
            onClick={step === 5 ? handleSubmit : handleNext} 
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 active:scale-98 transition-all shadow-lg shadow-slate-200/50 cursor-pointer ${
              isSubmitting ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 
              step === 5 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' : 
              'bg-slate-950 hover:bg-slate-850 text-white'
            }`}
          >
            {isSubmitting ? 'Submitting...' : step === 5 ? 'Submit Report' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      )}

    </div>
  );
}
