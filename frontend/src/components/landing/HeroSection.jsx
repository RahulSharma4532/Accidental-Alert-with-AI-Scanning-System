import { motion } from 'framer-motion';
import { ShieldCheck, FileText, ArrowRight, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Professional Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#E5E5EA_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100 -z-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              System Active: 50,000+ Verified Users
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 uppercase">
              Emergency <br /> <span className="text-slate-400">Response.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg font-bold text-slate-500 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed uppercase tracking-wide">
              The professional network for rapid accident reporting and quick insurance claim settlement.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
              <Link to="/report" className="group flex items-center justify-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-800 shadow-2xl shadow-slate-200">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                Report Accident
              </Link>
              <Link to="/knowledge" className="group flex items-center justify-center gap-4 bg-white text-slate-900 border-2 border-slate-900 px-10 py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-50">
                Knowledge Hub
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </motion.div>

            {/* Live Counters */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-200 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                  Daily Payouts
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter">1.2M+</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  Active Users
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter">84.2k</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Content - Animated Geometric Abstract */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative hidden lg:flex items-center justify-center h-[600px] w-full"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Professional Abstract Geometric */}
              <div className="absolute w-[400px] h-[400px] border-[20px] border-slate-900 rounded-3xl opacity-5 -rotate-12" />
              <div className="absolute w-[400px] h-[400px] border-[1px] border-slate-200 rounded-3xl rotate-12" />
              <div className="absolute w-[300px] h-[300px] bg-slate-900 rounded-3xl rotate-45 shadow-2xl flex items-center justify-center">
                <ShieldCheck className="w-32 h-32 text-white opacity-20" />
              </div>
              
              {/* Data Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-xl"
              >
                <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">System Secure</div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
