import { ArrowLeft, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer';

const TEMPLATES = [
  {
    title: "Police FIR Draft",
    desc: "Standardized template for reporting a vehicular collision to the police station.",
    size: "1.2 MB",
    type: "PDF"
  },
  {
    title: "Insurance Demand Letter",
    desc: "Formal legal request for compensation following a vehicle accident.",
    size: "0.8 MB",
    type: "DOCX"
  },
  {
    title: "Third-Party Liability Notice",
    desc: "Legal notice drafted to serve the at-fault party in a collision.",
    size: "1.5 MB",
    type: "PDF"
  },
  {
    title: "Medical Record Release",
    desc: "Authorization form required by insurers to review hospital treatment records.",
    size: "0.5 MB",
    type: "PDF"
  }
];

export default function LegalTemplates() {
  const navigate = useNavigate();

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
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Legal Drafts Section</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="mb-12">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-slate-950" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-tighter uppercase mb-4">
              Legal <br /> Templates.
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-md">
              STANDARDIZED DRAFTS FOR FIR FILING, NOTICES, AND INSURANCE CORRESPONDENCE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map((tpl, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-slate-950 transition-all group flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-lg group-hover:bg-slate-100 transition-all">
                      {tpl.type} &middot; {tpl.size}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight mb-2">{tpl.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-8">{tpl.desc}</p>
                </div>
                
                <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 border border-slate-100 hover:bg-slate-950 hover:text-white hover:border-slate-950 rounded-xl transition-all">
                  <Download className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Download Template</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
