import { motion } from 'framer-motion';
import { MapPin, Clock, ShieldAlert, FileKey, Scale, Map } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: "Real-Time Reporting",
      description: "Report accidents instantly from the scene with an intuitive, multi-step interface designed for stress-free data entry.",
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: "GPS-Enabled Nearby Hub",
      description: "Find hospitals, police stations, and towing services near your incident location with one tap.",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: "Secure Document Vault",
      description: "Store your policies, driving license, and FIRs in a highly secure, AES-256 encrypted digital vault.",
      icon: <FileKey className="w-6 h-6" />
    },
    {
      title: "AI Fraud Scoring",
      description: "Proprietary ML models score each claim for fraud probability to protect insurer interests.",
      icon: <ShieldAlert className="w-6 h-6" />
    },
    {
      title: "Legal Dispute Engine",
      description: "Resolve claim rejections via our empaneled mediators in virtual hearing rooms with full legal audit trails.",
      icon: <Scale className="w-6 h-6" />
    },
    {
      title: "Knowledge Hub",
      description: "Interactive checklists and legal templates to educate victims on their insurance and legal rights.",
      icon: <Map className="w-6 h-6" />
    }
  ];

  const stats = [
    { value: "45,000+", label: "Accidents Resolved" },
    { value: "32", label: "Insurance Partners" },
    { value: "28", label: "States Covered" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Statistics Bar */}
        <div className="bg-slate-900 rounded-3xl p-8 lg:p-16 mb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#E5E5EA_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter">{stat.value}</div>
                <div className="text-slate-500 font-black tracking-[0.2em] uppercase text-[10px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">System Infrastructure.</h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            Scalable architecture designed for enterprise-level incident management and legal reconciliation.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">{feature.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
