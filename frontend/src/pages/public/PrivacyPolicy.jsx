import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 py-10 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Privacy Policy</h1>
            <p className="text-slate-500 font-medium">Last updated: May 2026 &middot; Version 2.0</p>
          </div>
        </div>
      </header>

      <main className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
            
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Enterprise-Grade Protection</h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium mb-6">
                At AccidentAlert, we take your data security with extreme seriousness. Your legal documents, personal ID, and accident reports are protected by AES-256 encryption at rest and TLS 1.3 in transit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'End-to-End Encryption',
                  'Tamper-Proof Audit Logs',
                  'DPDP Act Compliance',
                  'Secure Cloud Storage'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-brand-500" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900">1. Data We Collect</h3>
              <p className="text-slate-500 leading-relaxed">
                To process your insurance claims effectively, we collect:
                - **Personal Information**: Name, Email, Phone Number, Aadhaar (optional).
                - **Vehicle Data**: Registration number, chassis number, insurance policy details.
                - **Accident Evidence**: GPS location, photos, videos, and witness statements.
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900">2. How We Use Your Data</h3>
              <p className="text-slate-500 leading-relaxed">
                Your data is exclusively used to:
                - Facilitate insurance claim filing.
                - Provide neutral mediation in legal disputes.
                - Connect you with emergency services nearby.
                - Detect and prevent fraudulent activities.
              </p>
            </section>

            <section className="p-8 bg-indigo-600 rounded-[2rem] text-white">
              <div className="flex items-center gap-4 mb-4">
                <Lock className="w-6 h-6" />
                <h4 className="text-lg font-black tracking-tight">Your Right to be Forgotten</h4>
              </div>
              <p className="text-indigo-100 text-sm font-bold leading-relaxed">
                In compliance with the DPDP Act, you have the right to request full deletion of your data from our servers at any time. Once requested, your data will be permanently purged within 30 days.
              </p>
            </section>

          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm font-bold">Questions about your privacy? Contact our DPO at <span className="text-brand-600">privacy@accidentalert.com</span></p>
          </div>

        </div>
      </main>
    </div>
  );
}
