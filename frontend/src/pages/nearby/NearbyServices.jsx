import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Clock, Navigation, Search, 
  Hospital, Shield, Truck, Fuel, Star, ExternalLink,
  ChevronRight, Map as MapIcon, List, Filter, Crosshair,
  Loader2, ShieldAlert, ArrowLeft, Landmark, Gavel, FileText
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix for Leaflet default icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const icons = {
  hospital: createCustomIcon('#18181b'), // zinc-900
  police: createCustomIcon('#27272a'), // zinc-800
  towing: createCustomIcon('#3f3f46'), // zinc-700
  fuel: createCustomIcon('#52525b'), // zinc-600
};

const defaultServices = [
  { id: 'm1', type: 'hospital', name: 'Metropolis Trauma Center', address: 'Sector 12, Central Hub', lat: 18.9647, lng: 72.8258, distance: '1.2 km', phone: '102', rating: 4.8, status: 'Open 24/7' },
  { id: 'm2', type: 'police', name: 'District Police HQ', address: 'Station Road, North Div', lat: 18.9747, lng: 72.8358, distance: '2.5 km', phone: '100', rating: 4.2, status: 'Operational' },
  { id: 'm3', type: 'towing', name: 'Rapid Recovery', address: 'Highway Exit 4', lat: 18.9547, lng: 72.8158, distance: '3.8 km', phone: '1800-419-7777', rating: 4.5, status: 'Active' },
];

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 14, { animate: true });
  }, [coords, map]);
  return null;
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

export default function NearbyServices() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState([18.9647, 72.8258]); 
  const [locationName, setLocationName] = useState('Detecting...');
  const [isLocating, setIsLocating] = useState(false);
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(true);

  const fetchNearbyData = async (lat, lon) => {
    setLoading(true);
    try {
      const query = `[out:json];(node["amenity"="hospital"](around:5000,${lat},${lon});node["amenity"="police"](around:5000,${lat},${lon});node["amenity"="fuel"](around:5000,${lat},${lon});node["amenity"="clinic"](around:5000,${lat},${lon}););out center;`;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      const mapped = data.elements.map(el => {
        const type = el.tags.amenity === 'hospital' || el.tags.amenity === 'clinic' ? 'hospital' : el.tags.amenity === 'police' ? 'police' : 'fuel';
        const latitude = el.lat || el.center.lat;
        const longitude = el.lon || el.center.lon;
        return {
          id: el.id, type, name: el.tags.name || `${type} Center`, address: el.tags['addr:full'] || 'Local Area',
          lat: latitude, lng: longitude, distance: `${calculateDistance(lat, lon, latitude, longitude)} km`,
          phone: el.tags.phone || (type === 'police' ? '100' : '102'), rating: (4 + Math.random() * 0.9).toFixed(1), status: 'Active'
        };
      });
      mapped.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setServices(mapped);
    } catch (error) { setServices(defaultServices); } finally { setLoading(false); }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLocationName('Live Location');
        setIsLocating(false);
        fetchNearbyData(latitude, longitude);
      }, () => { setLoading(false); setIsLocating(false); }, { timeout: 10000 });
    } else { fetchNearbyData(18.9647, 72.8258); }
  }, []);

  const filters = [
    { id: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
    { id: 'hospital', label: 'Trauma', icon: <Hospital className="w-4 h-4" /> },
    { id: 'police', label: 'Police', icon: <Shield className="w-4 h-4" /> },
    { id: 'fuel', label: 'Logistics', icon: <Fuel className="w-4 h-4" /> },
  ];

  const filteredServices = services.filter(s => (activeFilter === 'all' || s.type === activeFilter) && s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0 z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-lg font-bold text-slate-950">Emergency Services</h2>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-150/50 p-1 rounded-xl border border-slate-200/60 shadow-sm">
          <button 
            onClick={() => setViewMode('list')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${viewMode === 'list' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'}`}
          >
            <List className="w-4 h-4 shrink-0" /> List
          </button>
          <button 
            onClick={() => setViewMode('map')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${viewMode === 'map' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'}`}
          >
            <MapIcon className="w-4 h-4 shrink-0" /> Map
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 premium-card p-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search nearby services..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              {filters.map(f => (
                <button 
                  key={f.id} 
                  onClick={() => setActiveFilter(f.id)} 
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    activeFilter === f.id ? 'bg-slate-950 text-white border-slate-950 shadow-sm' : 'bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-slate-350 animate-spin mb-4" />
                <h3 className="text-sm font-semibold text-slate-500">Searching Nearby Services...</h3>
              </div>
            ) : viewMode === 'list' ? (
              <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service, i) => (
                  <div key={i} className="premium-card flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${service.type === 'hospital' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-450 border border-slate-100'}`}>
                          {service.type === 'hospital' ? <Hospital className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </div>
                        <div className="text-right">
                          <span className="badge-premium-blue">{service.distance}</span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-2.5 justify-end">
                            <Star className="w-3.5 h-3.5 fill-current" /> {service.rating}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                      <p className="text-xs text-slate-450 font-medium line-clamp-1 mb-6">{service.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                      <a href={`tel:${service.phone}`} className="premium-btn-primary w-full flex justify-center items-center gap-2 cursor-pointer text-center text-xs py-2.5">
                        <Phone className="w-4 h-4" /> Call
                      </a>
                      <button className="premium-btn-secondary w-full flex justify-center items-center gap-2 cursor-pointer text-xs py-2.5">
                        <Navigation className="w-4 h-4" /> Map
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="map" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-md h-[600px] relative z-0">
                <MapContainer center={userLocation} zoom={14} className="w-full h-full z-0">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <RecenterMap coords={userLocation} />
                  <Marker position={userLocation} />
                  {filteredServices.map(s => (
                    <Marker key={s.id} position={[s.lat, s.lng]} icon={icons[s.type] || icons.hospital}>
                      <Popup>
                        <div className="p-1 min-w-[150px] font-sans">
                          <h4 className="font-bold text-slate-900 text-xs mb-1">{s.name}</h4>
                          <p className="text-[10px] text-slate-500 mb-2">{s.address}</p>
                          <a href={`tel:${s.phone}`} className="block w-full bg-slate-950 text-white text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer hover:bg-slate-900 transition-colors">Call Now</a>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/80 px-4 py-2.5 rounded-2xl flex items-center gap-4 shadow-lg z-[10]">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {locationName}
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <button onClick={() => setIsLocating(true)} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">Recenter Map</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
