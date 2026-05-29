import { motion } from 'framer-motion';
import { Star, Shield, Award, Lock } from 'lucide-react';

export default function TrustSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Claim Settled: ₹1.2L",
      text: "I was stranded on the highway at 2 AM. Reported the accident on my phone, towing arrived in 20 minutes, and my claim was approved the next day. Unbelievable service.",
      avatar: "R"
    },
    {
      name: "Priya Sharma",
      role: "Claim Settled: ₹45,000",
      text: "The dispute mediation feature saved me months of legal hassle. I spoke directly with the insurer through the platform and got a fair settlement.",
      avatar: "P"
    },
    {
      name: "Amit Patel",
      role: "Claim Settled: ₹2.5L",
      text: "No paperwork! I just uploaded my FIR and photos directly from the app. The real-time tracking gave me so much peace of mind.",
      avatar: "A"
    }
  ];

  return (
    <section className="py-24 bg-slate-100 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Partner Logos Marquee */}
        <div className="mb-24">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by leading insurers and authorities</p>
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all">
                  <span className="text-2xl font-black font-serif text-slate-400">Tata AIG</span>
                  <span className="text-2xl font-black font-sans text-slate-400">HDFC ERGO</span>
                  <span className="text-2xl font-black text-slate-400 italic">ICICI Lombard</span>
                  <span className="text-2xl font-black text-slate-400">Bajaj Allianz</span>
                  <span className="text-2xl font-black text-slate-400">New India</span>
                  <span className="text-2xl font-black text-slate-400">National Ins</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Verified Experiences.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white p-10 rounded-3xl border border-slate-200 relative shadow-xl shadow-slate-200/50"
            >
              <div className="flex text-slate-900 mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-600 text-sm font-medium mb-12 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-8">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 pt-16">
          <div className="flex flex-col items-center text-center gap-3">
            <Shield className="w-10 h-10 text-slate-400 shrink-0" />
            <span className="text-sm font-bold text-slate-600">Govt. Authorized</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Lock className="w-10 h-10 text-slate-400 shrink-0" />
            <span className="text-sm font-bold text-slate-600">256-bit Encryption</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Award className="w-10 h-10 text-slate-400 shrink-0" />
            <span className="text-sm font-bold text-slate-600">ISO 27001 Certified</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Shield className="w-10 h-10 text-slate-400 shrink-0" />
            <span className="text-sm font-bold text-slate-600">IRDAI Compliant</span>
          </div>
        </div>

      </div>
    </section>
  );
}
