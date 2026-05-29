import { PhoneCall, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-2 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & SOS */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-white" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">AccidentAlert</span>
            </div>
            <a href="tel:18001234567" className="text-[9px] font-black text-blue-500 hover:text-blue-400 transition-colors tracking-widest">
              1800-123-4567
            </a>
          </div>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/report" className="text-slate-600 hover:text-white transition-colors text-[7px] font-black uppercase tracking-widest">Report</Link>
            <Link to="/claims" className="text-slate-600 hover:text-white transition-colors text-[7px] font-black uppercase tracking-widest">My Claims</Link>
            <Link to="/nearby" className="text-slate-600 hover:text-white transition-colors text-[7px] font-black uppercase tracking-widest">Nearby</Link>
            <Link to="/privacy" className="text-slate-600 hover:text-white transition-colors text-[7px] font-black uppercase tracking-widest">Privacy</Link>
          </div>

          {/* Contact & Apps */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a href="mailto:ops@accidentalert.in" className="text-slate-600 hover:text-white transition-colors text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-2.5 h-2.5 shrink-0" /> Email
              </a>
            </div>
            <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-2.5 filter invert" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-2.5" />
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
