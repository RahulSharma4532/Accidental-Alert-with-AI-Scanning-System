import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckSquare, Square, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer';

const CHECKLIST = [
  { id: 1, text: "Copy of the First Information Report (FIR)", req: true },
  { id: 2, text: "Original Vehicle Registration Certificate (RC)", req: true },
  { id: 3, text: "Valid Driving License of the driver", req: true },
  { id: 4, text: "Photographic Evidence of the Accident Scene", req: true },
  { id: 5, text: "Copy of Insurance Policy Document", req: true },
  { id: 6, text: "Estimated Repair Cost from Authorized Garage", req: false },
  { id: 7, text: "Medical Bills (if injuries occurred)", req: false },
];

export default function DocumentChecklist() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState([]);

  const toggleCheck = (id) => {
    if (checked.includes(id)) {
      setChecked(checked.filter(c => c !== id));
    } else {
      setChecked([...checked, id]);
    }
  };

  const progress = Math.round((checked.length / CHECKLIST.length) * 100);

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
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Checklist: Claim Preparation</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-slate-950" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-tighter uppercase mb-4">
              Document <br /> Checklist.
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-md mx-auto">
              ENSURE ALL REQUIRED ACCIDENT DATA AND LEGAL DOCUMENTS ARE READY FOR CLAIM SUBMISSION.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-widest">Document Readiness</h3>
              <span className="text-2xl font-black text-slate-950">{progress}%</span>
            </div>
            
            <div className="w-full bg-slate-50 h-2 rounded-full mb-8 overflow-hidden border border-slate-100">
              <motion.div 
                className="bg-slate-950 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="space-y-3">
              {CHECKLIST.map((item) => {
                const isChecked = checked.includes(item.id);
                return (
                  <button 
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      isChecked 
                        ? 'bg-slate-50 border-slate-950' 
                        : 'bg-white border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-6 h-6 flex items-center justify-center rounded transition-all ${isChecked ? 'text-slate-950' : 'text-slate-300'}`}>
                        {isChecked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                      </div>
                      <span className={`text-[12px] font-bold ${isChecked ? 'text-slate-950 line-through decoration-slate-300' : 'text-slate-700'}`}>
                        {item.text}
                      </span>
                    </div>
                    {item.req && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[7px] font-black uppercase tracking-widest">Required</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
