import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Car, Shield, PhoneCall, Bell, Trash2, Camera, Plus, 
  Settings, LogOut, FileText, Activity, ArrowLeft, LayoutDashboard,
  ShieldCheck, Landmark, Zap, Clock, AlertTriangle, CheckCircle2, Cloud, AlignLeft, Loader2
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import Logo from '../../assets/icons/LogoAccident.png';

export default function Profile() {
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [authLoading, isAuthenticated, navigate]);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setAvatarPreview(localStorage.getItem(`userAvatar_${user.id}`) || null);
    }
  }, [user]);
  
  // Emergency Contacts States
  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    const saved = localStorage.getItem('personalEmergencyContacts');
    return saved ? JSON.parse(saved) : [
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
    ];
  });
  const [newEmergencyContact, setNewEmergencyContact] = useState({ 
    name: '', 
    relation: 'Spouse', 
    phone: '', 
    email: '',
    blood_group: 'Unknown',
    alert_sms: true,
    alert_call: false,
    alert_email: false,
    notes: ''
  });
  const [showAddEmergencyForm, setShowAddEmergencyForm] = useState(false);

  const handleAddEmergencyContact = (e) => {
    e.preventDefault();
    if (!newEmergencyContact.name || !newEmergencyContact.phone) return;
    const updated = [...emergencyContacts, newEmergencyContact];
    setEmergencyContacts(updated);
    localStorage.setItem('personalEmergencyContacts', JSON.stringify(updated));
    setNewEmergencyContact({ 
      name: '', 
      relation: 'Spouse', 
      phone: '', 
      email: '',
      blood_group: 'Unknown',
      alert_sms: true,
      alert_call: false,
      alert_email: false,
      notes: ''
    });
    setShowAddEmergencyForm(false);
  };

  const handleDeleteEmergencyContact = (index) => {
    const updated = emergencyContacts.filter((_, i) => i !== index);
    setEmergencyContacts(updated);
    localStorage.setItem('personalEmergencyContacts', JSON.stringify(updated));
  };
  
  // Form States
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (tabParam && ['personal', 'vehicles', 'policies', 'emergency', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true);
    const res = await updateProfile(profileName, profileEmail);
    setIsUpdatingProfile(false);
    if (!res.success) {
      alert(res.error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using canvas to fit in localStorage
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarPreview(compressedDataUrl);
          try {
            if (user?.id) {
              localStorage.setItem(`userAvatar_${user.id}`, compressedDataUrl);
            }
          } catch (e) {
            console.error('LocalStorage quota exceeded');
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    if (user?.id) {
      localStorage.removeItem(`userAvatar_${user.id}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [activeTab, isAuthenticated]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'vehicles') {
        const res = await api.get('/vehicles');
        setVehicles(res.data);
      } else if (activeTab === 'policies') {
        const res = await api.get('/policies');
        setPolicies(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'vehicles') {
        await api.post('/vehicles', formData);
      } else if (activeTab === 'policies') {
        await api.post('/policies', formData);
      }
      setShowAddForm(false);
      setFormData({});
      fetchProfileData();
    } catch (err) {
      alert("Submission failed. Check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User className="w-5 h-5" /> },
    { id: 'vehicles', label: 'My Vehicles', icon: <Car className="w-5 h-5" /> },
    { id: 'policies', label: 'Insurance Policies', icon: <Shield className="w-5 h-5" /> },
    { id: 'emergency', label: 'Emergency Contacts', icon: <PhoneCall className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(-1);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex mesh-bg-light dot-grid bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar - Premium Light Theme */}
      <aside className="hidden lg:flex flex-col w-64 bg-white text-slate-700 border-r border-slate-200/80 z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <img src={Logo} alt="Logo" className="h-6 w-auto mr-3" />
          <span className="text-slate-900 font-bold tracking-tight text-sm">AccidentAlert</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors group mb-1 cursor-pointer text-slate-500 hover:text-slate-900"
          >
            <Home className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            <span className="font-semibold text-sm transition-colors">Go Back</span>
          </button>
          
          

          <div className="text-xs font-bold text-slate-400 mb-3 px-2 uppercase tracking-wider">Account Settings</div>
          
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { 
                setActiveTab(tab.id); 
                setShowAddForm(false); 
                setSearchParams({ tab: tab.id });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-blue-50/80 text-blue-600 font-bold border-l-4 border-blue-600' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-950 transition-colors'}>
                {tab.icon}
              </div>
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors cursor-pointer font-semibold">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header - White */}
        <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Platform Settings</h2>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  <div className="premium-card">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Personal Profile</h3>
                    
                    {/* Photo Edit & Upload Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                      <div className="relative group cursor-pointer shrink-0">
                        <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-slate-400">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                              {getInitials(user?.name)}
                            </span>
                          )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-slate-800 transition-all border-2 border-white hover:scale-105">
                          <Camera className="w-4 h-4" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                      </div>
                      <div className="text-center sm:text-left pt-2">
                        <h4 className="text-sm font-bold text-slate-900">Profile Visuals</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Upload JPEG, PNG (Max 5MB)</p>
                        <button 
                          onClick={handleRemovePhoto}
                          className={`mt-3 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${!avatarPreview ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50' : 'text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                          disabled={!avatarPreview}
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1.5">Full Name</label>
                        <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="premium-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1.5">Email Address</label>
                        <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="premium-input" />
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <button onClick={handleProfileUpdate} disabled={isUpdatingProfile} className="premium-btn-primary w-full sm:w-auto cursor-pointer">
                          {isUpdatingProfile ? 'Saving...' : 'Save Profile Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {activeTab === 'vehicles' && (
                <motion.div key="vehicles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">My Vehicles</h3>
                    <button 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="premium-btn-secondary flex items-center gap-3 text-xs py-2.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" /> {showAddForm ? 'Cancel' : 'Add Vehicle'}
                    </button>
                  </div>

                  {showAddForm && (
                    <div className="premium-card bg-slate-50/50 border-dashed">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Add New Vehicle</h4>
                      <form onSubmit={handleAddSubmit} className="grid md:grid-cols-3 gap-4">
                        <input type="text" placeholder="License Plate (e.g. MH01AB1234)" onChange={e => setFormData({...formData, registration_number: e.target.value})} className="premium-input" required />
                        <input type="text" placeholder="Make/Model" onChange={e => setFormData({...formData, model: e.target.value})} className="premium-input" required />
                        <input type="number" placeholder="Year" onChange={e => setFormData({...formData, year: e.target.value})} className="premium-input" required />
                        <div className="md:col-span-3">
                          <button type="submit" disabled={isSubmitting} className="premium-btn-primary w-full sm:w-auto cursor-pointer">
                            {isSubmitting ? 'Saving...' : 'Save Vehicle'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300 w-8 h-8" /></div>
                  ) : vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicles.map((v, i) => (
                        <div key={i} className="premium-card hover:-translate-y-1 group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                              <Car className="w-5 h-5" />
                            </div>
                            <span className="badge-premium-green">Active</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900">{v.registration_number}</h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">{v.year} {v.model}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 premium-card border-dashed">
                      <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-base font-bold text-slate-900 mb-1">No Vehicles Added</h4>
                      <p className="text-sm text-slate-500 font-medium">Add a vehicle to enable accident reporting.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'policies' && (
                <motion.div key="policies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">Insurance Policies</h3>
                    <button 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="premium-btn-secondary flex items-center gap-3 text-xs py-2.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" /> {showAddForm ? 'Cancel' : 'Add Policy'}
                    </button>
                  </div>

                  {showAddForm && (
                    <div className="premium-card bg-slate-50/50 border-dashed">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Add New Policy</h4>
                      <form onSubmit={handleAddSubmit} className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Policy Number" onChange={e => setFormData({...formData, policy_number: e.target.value})} className="premium-input" required />
                        <input type="text" placeholder="Provider Name" onChange={e => setFormData({...formData, provider_name: e.target.value})} className="premium-input" required />
                        <div className="md:col-span-2">
                          <button type="submit" disabled={isSubmitting} className="premium-btn-primary w-full sm:w-auto cursor-pointer">
                            {isSubmitting ? 'Saving...' : 'Save Policy'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300 w-8 h-8" /></div>
                  ) : policies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {policies.map((p, i) => (
                        <div key={i} className="premium-card hover:-translate-y-1 group relative overflow-hidden">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                              <Shield className="w-5 h-5" />
                            </div>
                            <span className="badge-premium-green flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900">{p.policy_number}</h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">{p.provider_name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 premium-card border-dashed">
                      <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-base font-bold text-slate-900 mb-1">No Policies Added</h4>
                      <p className="text-sm text-slate-500 font-medium">Add an insurance policy to enable online claims.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'emergency' && (
                <motion.div
                  key="emergency"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 animate-subtle-fade"
                >
                  {/* Top Notification Banner */}
                  <div className="bg-rose-50 border border-rose-100 text-rose-900 rounded-2xl p-5 flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-sm">Emergency Helpline Numbers</h4>
                      <p className="text-xs text-rose-700 mt-1 leading-relaxed font-medium">
                        These numbers are for immediate life-saving services. Personal contacts listed below will also receive SMS alerts and location coordinates automatically if you submit an Accident Report.
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Government Emergency Helplines */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                           <ShieldCheck className="w-5 h-5 text-slate-700" />
                          Emergency Helplines (National & Regional)
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Government operated emergency response lines</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* 112 - National Emergency */}
                      <div className="premium-card border-rose-200/80 bg-gradient-to-br from-white to-rose-50/20 hover:border-rose-400 group relative hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="badge-premium-red">
                            All-In-One
                          </span>
                          <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                            <PhoneCall className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-rose-700 tracking-tight">112</h4>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">National Emergency Number</h5>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                          Primary helpline for Police, Fire, Ambulance, and disaster response nationwide.
                        </p>
                        <div className="mt-4">
                          <a
                            href="tel:112"
                            className="w-full premium-btn-danger cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Hotline
                          </a>
                        </div>
                      </div>

                      {/* 1033 - NHAI Road Accidents */}
                      <div className="premium-card hover:border-amber-400/80 bg-gradient-to-br from-white to-amber-50/10 group relative hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="badge-premium-amber">
                            Highway
                          </span>
                          <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                            <Car className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-amber-600 tracking-tight">1033</h4>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">National Highways Helpline</h5>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                          Dedicated reporting and ambulance requests for accidents on national expressways.
                        </p>
                        <div className="mt-4">
                          <a
                            href="tel:1033"
                            className="w-full premium-btn-primary cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Hotline
                          </a>
                        </div>
                      </div>

                      {/* 102 - Ambulance */}
                      <div className="premium-card hover:border-emerald-400/80 bg-gradient-to-br from-white to-emerald-50/10 group relative hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="badge-premium-green">
                            Medical
                          </span>
                          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                            <Activity className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-emerald-600 tracking-tight">102</h4>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">Ambulance Services</h5>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                          Direct dispatcher link for government/free district-level hospital ambulances.
                        </p>
                        <div className="mt-4">
                          <a
                            href="tel:102"
                            className="w-full premium-btn-primary cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Hotline
                          </a>
                        </div>
                      </div>

                      {/* 100 - Police */}
                      <div className="premium-card hover:border-blue-400/80 bg-gradient-to-br from-white to-blue-50/10 group relative hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="badge-premium-blue">
                            Security
                          </span>
                          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <Shield className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-blue-600 tracking-tight">100</h4>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">Police Dispatch</h5>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                          Immediate police response for emergency situations, security threats, or crime scenes.
                        </p>
                        <div className="mt-4">
                          <a
                            href="tel:100"
                            className="w-full premium-btn-primary cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Hotline
                          </a>
                        </div>
                      </div>

                      {/* 101 - Fire */}
                      <div className="premium-card hover:border-rose-400/80 bg-gradient-to-br from-white to-rose-50/10 group relative hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="badge-premium-red font-extrabold">
                            Fire Force
                          </span>
                          <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                            <Zap className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-rose-600 tracking-tight">101</h4>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">Fire Rescue Services</h5>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                          Direct alert routing to the nearest regional fire station control room.
                        </p>
                        <div className="mt-4">
                          <a
                            href="tel:101"
                            className="w-full premium-btn-primary cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Hotline
                          </a>
                        </div>
                      </div>

                      {/* 1078 - Disaster Management */}
                      <div className="premium-card hover:border-violet-400/80 bg-gradient-to-br from-white to-violet-50/10 group relative hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="badge-premium-blue bg-indigo-50 text-indigo-600 border-indigo-100">
                            NDMA
                          </span>
                          <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            <Cloud className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-purple-600 tracking-tight">1078</h4>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">National Disaster Response</h5>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                          Disaster control room (NDMA) helpline for severe weather, floods, or earthquakes.
                        </p>
                        <div className="mt-4">
                          <a
                            href="tel:1078"
                            className="w-full premium-btn-primary cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Hotline
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Personal SOS Contacts */}
                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <User className="w-5 h-5 text-slate-700" />
                          Personal Emergency Contacts
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Contacts notified during emergency alerts</p>
                      </div>
                      <button
                        onClick={() => setShowAddEmergencyForm(!showAddEmergencyForm)}
                        className="premium-btn-secondary flex items-center gap-3 text-xs py-2.5 self-start sm:self-auto cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0" /> {showAddEmergencyForm ? 'Cancel' : 'Add Contact'}
                      </button>
                    </div>

                    {/* Add Form Container */}
                    <AnimatePresence>
                      {showAddEmergencyForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mb-6"
                        >
                          <form onSubmit={handleAddEmergencyContact} className="premium-card bg-slate-50/50 border-dashed grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
                              <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={newEmergencyContact.name}
                                onChange={e => setNewEmergencyContact({...newEmergencyContact, name: e.target.value})}
                                className="premium-input"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Relationship *</label>
                              <select
                                value={newEmergencyContact.relation}
                                onChange={e => setNewEmergencyContact({...newEmergencyContact, relation: e.target.value})}
                                className="premium-input"
                                required
                              >
                                <option value="Spouse">Spouse</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Child">Child</option>
                                <option value="Friend">Friend</option>
                                <option value="Family Doctor">Family Doctor</option>
                                <option value="Insurance Agent">Insurance Agent</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number *</label>
                              <input
                                type="tel"
                                placeholder="10-digit number"
                                pattern="[0-9]{10}"
                                value={newEmergencyContact.phone}
                                onChange={e => setNewEmergencyContact({...newEmergencyContact, phone: e.target.value})}
                                className="premium-input"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                              <input
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={newEmergencyContact.email}
                                onChange={e => setNewEmergencyContact({...newEmergencyContact, email: e.target.value})}
                                className="premium-input"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Blood Group</label>
                              <select
                                value={newEmergencyContact.blood_group}
                                onChange={e => setNewEmergencyContact({...newEmergencyContact, blood_group: e.target.value})}
                                className="premium-input"
                              >
                                <option value="Unknown">Unknown</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Active Alert Channels</label>
                              <div className="flex items-center gap-4 py-2.5 text-slate-700">
                                <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={newEmergencyContact.alert_sms}
                                    onChange={e => setNewEmergencyContact({...newEmergencyContact, alert_sms: e.target.checked})}
                                    className="rounded border-slate-300 text-slate-900 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                                  />
                                  SMS
                                </label>
                                <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={newEmergencyContact.alert_call}
                                    onChange={e => setNewEmergencyContact({...newEmergencyContact, alert_call: e.target.checked})}
                                    className="rounded border-slate-300 text-slate-900 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                                  />
                                  Call
                                </label>
                                <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={newEmergencyContact.alert_email}
                                    onChange={e => setNewEmergencyContact({...newEmergencyContact, alert_email: e.target.checked})}
                                    className="rounded border-slate-300 text-slate-900 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                                  />
                                  Email
                                </label>
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <label className="block text-xs font-bold text-slate-600 mb-1">Medical Notes & Alert Instructions</label>
                              <input
                                type="text"
                                placeholder="e.g. Diabetic, penicillin allergy, call immediately"
                                value={newEmergencyContact.notes}
                                onChange={e => setNewEmergencyContact({...newEmergencyContact, notes: e.target.value})}
                                className="premium-input"
                              />
                            </div>

                            <div className="md:col-span-3 pt-2">
                              <button type="submit" className="premium-btn-primary w-full sm:w-auto cursor-pointer">
                                Add Contact
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Contact Cards List */}
                    {emergencyContacts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {emergencyContacts.map((contact, index) => (
                          <div key={index} className="premium-card group hover:-translate-y-1 flex flex-col justify-between transition-all">
                            <div>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                    <User className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{contact.name}</h4>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <span className="badge-premium-blue">
                                        {contact.relation}
                                      </span>
                                      {contact.blood_group && contact.blood_group !== 'Unknown' && (
                                        <span className="badge-premium-red">
                                          Blood: {contact.blood_group}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={`tel:${contact.phone}`}
                                    className="p-2 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-colors"
                                    title="Call Contact"
                                  >
                                    <PhoneCall className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteEmergencyContact(index)}
                                    className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                                    title="Remove Contact"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                                <div className="flex justify-between text-slate-500 font-medium">
                                  <span>Phone:</span>
                                  <span className="font-bold text-slate-800">{contact.phone}</span>
                                </div>
                                {contact.email && (
                                  <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Email:</span>
                                    <span className="font-bold text-slate-800 break-all">{contact.email}</span>
                                  </div>
                                )}
                                {contact.notes && (
                                  <div className="text-slate-500 bg-slate-50 p-2.5 rounded-xl mt-2 border border-slate-100 text-[11px] italic font-medium">
                                    "{contact.notes}"
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 border-t border-slate-100 pt-3">
                              {/* Alert channels pills */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-400 font-bold mr-1">Alert Trigger:</span>
                                {contact.alert_sms && (
                                  <span className="badge-premium-green">
                                    SMS Coords
                                  </span>
                                )}
                                {contact.alert_call && (
                                  <span className="badge-premium-blue">
                                    Voice Call
                                  </span>
                                )}
                                {contact.alert_email && (
                                  <span className="badge-premium-blue bg-indigo-50 text-indigo-600 border-indigo-100">
                                    Email PDF
                                  </span>
                                )}
                                {!contact.alert_sms && !contact.alert_call && !contact.alert_email && (
                                  <span className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-full">
                                    Disabled
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 premium-card border-dashed">
                        <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-base font-bold text-slate-900 mb-1">No Emergency Contacts Added</h4>
                        <p className="text-sm text-slate-500 font-medium">Add family, friends, or medical professionals to notify them during an emergency.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 premium-card border-dashed">
                  <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-base font-bold text-slate-900 mb-1">Settings Panel Inactive</h4>
                  <p className="text-sm text-slate-500 font-medium">This settings panel is under maintenance.</p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

