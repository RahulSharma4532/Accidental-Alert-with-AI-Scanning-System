import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer';

const FAQS = [
  {
    category: "Claims & Insurance",
    questions: [
      { q: "How long does it take to settle a claim?", a: "Most straightforward claims are settled within 7-14 business days. Complex claims involving severe disputes or bodily injury may take up to 45 days pending investigation." },
      { q: "What documents are required for filing?", a: "You will need the Police FIR, Vehicle RC, Driving License, Insurance Policy document, and photographic evidence of the accident scene." },
      { q: "Is there a deadline to file?", a: "Yes, you must initialize the claim process within 48 hours of the incident. Delaying the report may lead to claim rejection by the insurer." }
    ]
  },
  {
    category: "Legal & Disputes",
    questions: [
      { q: "When is a mediator assigned?", a: "A neutral mediator is assigned automatically if the insurance company disputes your claim amount by more than 20%, or if liability is contested." },
      { q: "Do I need a lawyer for the video hearing?", a: "No, our platform is designed to be accessible. A neutral mediator will guide the process. However, you may choose to have legal representation present." }
    ]
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const [openQ, setOpenQ] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 px-6 lg:px-12 py-6 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 border border-slate-100 hover:bg-slate-950 hover:text-white rounded-xl transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Knowledge Base</h2>
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">FAQ Section</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-slate-950" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-tighter uppercase mb-4">
              Frequent <br /> Inquiries.
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-md mx-auto">
              STANDARDIZED RESPONSES FOR COMMON PROCEDURAL AND LEGAL QUESTIONS.
            </p>
          </div>

          <div className="space-y-12">
            {FAQS.map((category, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-2">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((faq, j) => {
                    const id = `${i}-${j}`;
                    const isOpen = openQ === id;
                    return (
                      <div key={j} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-400 transition-all">
                        <button 
                          onClick={() => setOpenQ(isOpen ? null : id)}
                          className="w-full p-6 text-left flex justify-between items-center"
                        >
                          <span className="text-[13px] font-black text-slate-950 tracking-tight">{faq.q}</span>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-400'}`}>
                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 pb-6"
                            >
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed pt-4 border-t border-slate-50">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
