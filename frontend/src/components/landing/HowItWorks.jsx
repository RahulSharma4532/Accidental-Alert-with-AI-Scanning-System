import { motion } from 'framer-motion';
import { Camera, FileUp, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Report Accident",
      description: "Immediate incident capture with photos and precise location reporting.",
      icon: <Camera className="w-8 h-8 text-white" />,
      color: "bg-slate-900",
      delay: 0.1
    },
    {
      id: 2,
      title: "File Claim",
      description: "Verify documents and automatically link with your active insurance policy.",
      icon: <FileUp className="w-8 h-8 text-white" />,
      color: "bg-slate-700",
      delay: 0.3
    },
    {
      id: 3,
      title: "Settlement",
      description: "Real-time verification and quick payout/approval from your insurance company.",
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      color: "bg-slate-500",
      delay: 0.5
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed"
          >
            Simple 3-step process to report accidents and claim insurance.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 border-t-2 border-dashed border-slate-300" />

          {steps.map((step) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay, duration: 0.6 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className={`w-24 h-24 rounded-2xl ${step.color} shadow-2xl flex items-center justify-center mb-10 transform group-hover:-translate-y-1 transition-all duration-500 z-10 ring-8 ring-slate-100`}>
                {step.icon}
              </div>
              
              <div className="bg-white p-10 rounded-3xl border border-slate-200 w-full h-full shadow-xl shadow-slate-200/50">
                <div className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.3em]">Step {step.id}</div>
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
