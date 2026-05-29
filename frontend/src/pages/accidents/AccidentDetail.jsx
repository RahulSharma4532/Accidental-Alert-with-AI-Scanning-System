import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Users, 
  AlertCircle, 
  MessageSquare, 
  FileCheck,
  ChevronLeft,
  Printer,
  Gavel,
  Loader2
} from 'lucide-react';
import api from '../../utils/api';
import StatusBadge from '../../components/ui/StatusBadge';
import PhotoGallery from '../../components/ui/PhotoGallery';
import Timeline from '../../components/ui/Timeline';

export default function AccidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [accident, setAccident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccidentDetails();
  }, [id]);

  const fetchAccidentDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/accidents/${id}`);
      setAccident(res.data);
    } catch (error) {
      console.error('Failed to load accident details', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center mesh-bg-light dot-grid">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!accident) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center mesh-bg-light dot-grid">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-black text-slate-900 mb-2 font-outfit uppercase">Accident Report Not Found</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-sm font-medium">The requested accident details could not be loaded from the server.</p>
        <button onClick={() => navigate(-1)} className="premium-btn-primary cursor-pointer">Go Back</button>
      </div>
    );
  }

  // Map backend photos to actual asset URLs
  const photosList = accident.photos && accident.photos.length > 0 
    ? accident.photos.map(p => ({
        url: p.file_path.startsWith('http') 
          ? p.file_path 
          : `http://localhost:8000/storage/${p.file_path}`
      }))
    : [
        { url: 'https://images.unsplash.com/photo-1594912920236-4702130327f4?auto=format&fit=crop&q=80&w=800' }
      ];

  // Dynamically build process timeline
  const timelineItems = [
    { 
      title: 'Accident Reported', 
      date: new Date(accident.created_at).toLocaleDateString(), 
      description: 'Incident report submitted digitally via AccidentAlert.', 
      status: 'completed' 
    },
    { 
      title: 'AI Authenticity Vetting', 
      date: 'Completed', 
      description: `AI fraud score calculated: ${accident.fraud_score ?? 0}%. GPS coordinate match verified.`, 
      status: (accident.fraud_score || 0) < 50 ? 'completed' : 'processing' 
    },
    { 
      title: 'Insurer Verification', 
      date: accident.claims && accident.claims.length > 0 ? 'Active Claim Linked' : 'Awaiting Claim Action', 
      description: accident.claims && accident.claims.length > 0 
        ? `Linked to claim CLM-${accident.claims[0].id}` 
        : 'User has not yet linked this incident to an active insurance policy.',
      status: accident.claims && accident.claims.length > 0 ? 'completed' : 'pending' 
    }
  ];

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'badge-premium-red';
      case 'medium':
      case 'moderate':
        return 'badge-premium-amber';
      case 'low':
      case 'minor':
      default:
        return 'badge-premium-blue';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 mesh-bg-light dot-grid relative overflow-x-hidden">
      
      {/* Top Header */}
      <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-base font-black font-outfit uppercase tracking-tight text-slate-900">Accident Log Detail</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.print()}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 rounded-xl text-slate-500 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          {(!accident.claims || accident.claims.length === 0) && (
            <button 
              onClick={() => navigate(`/claims/new?accident_id=${accident.id}`)}
              className="premium-btn-accent px-4 py-2.5 text-[10px] cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 mr-1.5" /> File New Claim
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* ACCIDENT OVERVIEW CARD */}
              <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <StatusBadge status={accident.claims && accident.claims.length > 0 ? 'claimed' : 'investigating'} className="mb-4" />
                    <h1 className="text-3xl font-black font-outfit uppercase tracking-tight text-slate-900">
                      {accident.report_id || `ACC-${accident.id}`}
                    </h1>
                  </div>
                  <div className="flex items-center gap-8 border-l border-slate-200 pl-8">
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Severity</p>
                      <span className={getSeverityBadgeClass(accident.severity)}>
                        {accident.severity || 'Medium'}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Vehicles</p>
                      <p className="text-[13px] font-black text-slate-900 font-mono">{accident.number_of_vehicles || 1}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-all duration-300">
                    <Calendar className="w-5 h-5 text-blue-500 mb-4" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Filing Date</p>
                    <p className="text-[13px] font-bold text-slate-950">{new Date(accident.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-all duration-300">
                    <Clock className="w-5 h-5 text-purple-500 mb-4" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Weather</p>
                    <p className="text-[13px] font-bold text-slate-950 capitalize">{accident.weather_conditions || 'Clear'}</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-all duration-300">
                    <MapPin className="w-5 h-5 text-emerald-500 mb-4" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">GPS Location</p>
                    <p className="text-[11px] font-bold text-slate-950 leading-tight">
                      {accident.address || `Lat: ${accident.latitude}, Lng: ${accident.longitude}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Incident Narrative</h4>
                  <p className="text-[13px] text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    Reported collision at {accident.address}. Road category identified as {accident.road_type || 'standard road'}. 
                    {accident.has_injuries ? ' Casualties / injuries were logged at the scene.' : ' No physical injuries were reported.'}
                    {accident.is_hit_and_run ? ' Identified as a potential hit-and-run incident.' : ''}
                  </p>
                </div>
              </div>

              {/* TABS FOR DETAILS */}
              <div className="space-y-6">
                <div className="flex items-center gap-8 border-b border-slate-200">
                  {['overview', 'evidence', 'legal'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative bg-transparent border-0 cursor-pointer
                        ${activeTab === tab ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-600'}
                      `}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-950 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <Car className="w-5 h-5 text-blue-500" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Primary Incident Details</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Accident Type</p>
                          <p className="text-[13px] font-bold text-slate-900 capitalize">{accident.accident_type || 'Collision'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Accident Report Status</p>
                          <span className="badge-premium-green">Live Secured</span>
                        </div>
                      </div>
                    </div>

                    <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <Users className="w-5 h-5 text-purple-500" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Other Driver Details</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Driver Name</p>
                          <p className="text-[13px] font-bold text-slate-900">{accident.other_driver_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Vehicle Info</p>
                          <p className="text-[13px] font-bold text-slate-900">
                            {accident.other_vehicle_number ? `Plate: ${accident.other_vehicle_number}` : 'N/A'}
                            {accident.other_driver_phone ? ` | Contact: ${accident.other_driver_phone}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'evidence' && (
                  <div className="space-y-6">
                    <PhotoGallery photos={photosList} />
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
                      <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-1">Forensic Analysis</h4>
                        <p className="text-[13px] text-blue-600/80 font-medium leading-relaxed">
                          All uploaded media undergoes cryptographic hash verification and GPS checking. Cognitive AI vetting flags discrepancy checks automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'legal' && (
                  <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl hover:bg-slate-100/50 transition-all duration-300">
                    <Gavel className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2 font-outfit">Legal Dispute Channel</h4>
                    <p className="text-xs text-slate-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                      If there is an insurance coverage mismatch or a liability dispute, you can file a formal Dispute through our platform.
                    </p>
                    <button 
                      onClick={() => navigate(`/disputes/new?accident_id=${accident.id}`)}
                      className="premium-btn-secondary px-6 py-3.5 text-xs uppercase cursor-pointer"
                    >
                      Start Mediation
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR - TIMELINE & ACTIONS */}
            <div className="space-y-8">
              
              <div className="premium-card bg-white/95 backdrop-blur-xl border border-slate-200/80 p-6 shadow-sm">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-8">Process Timeline</h4>
                <Timeline items={timelineItems} />
              </div>

              <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <MessageSquare className="w-8 h-8 text-blue-600 mb-6 relative z-10" />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-950 mb-2 relative z-10 font-outfit">Need Assistance?</h4>
                <p className="text-xs text-slate-550 font-medium mb-8 leading-relaxed relative z-10">
                  Our legal mediators are available 24/7 to guide you through the reporting process.
                </p>
                <button 
                  onClick={() => navigate('/disputes')}
                  className="premium-btn-primary w-full cursor-pointer relative z-10"
                >
                  Open Dispute & Mediation
                </button>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

