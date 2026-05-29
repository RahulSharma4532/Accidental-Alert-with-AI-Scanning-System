import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Gavel, Scale, AlertCircle, FileText, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';

const RIGHTS = [
  {
    title: 'Right to Fair Investigation',
    icon: Shield,
    desc: 'You have the right to an impartial investigation of the accident scene, including evidence from both parties.',
    details: 'The insurer cannot reject a claim based on unverified or hearsay evidence. Our platform ensures all evidence is cryptographically signed.'
  },
  {
    title: 'Statutory Claim Timeline',
    icon: CheckCircle2,
    desc: 'Insurers are legally obligated to acknowledge and respond to claims within specific timeframes.',
    details: 'Under regulatory guidelines, claims must be settled or rejected within 30 days of receiving all necessary documents.'
  },
  {
    title: 'Legal Representation',
    icon: Gavel,
    desc: 'You have the right to legal counsel during mediation or in the Motor Accident Claims Tribunal (MACT).',
    details: 'Our platform provides templates for legal notices if you choose to pursue a dispute independently.'
  },
  {
    title: 'Privacy and Data Protection',
    icon: FileText,
    desc: 'Your personal and medical data shared during the report is protected under the Digital Personal Data Protection Act.',
    details: 'Data is only shared with authorized insurers and legal entities strictly for claim processing.'
  }
];

export default function KnowYourRights() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-900 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Legal Empowerment
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-zinc-900">
          Know Your Rights
        </h1>
        <p className="text-sm text-zinc-500 max-w-2xl mx-auto mt-2">
          Understanding your legal standing is the first step toward a fair settlement. 
          The AccidentAlert platform is built on the foundation of consumer protection law.
        </p>
      </div>

      {/* RIGHTS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RIGHTS.map((right, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="card-standard group flex flex-col justify-between h-full"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <right.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{right.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                {right.desc}
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <p className="text-sm text-zinc-600 font-medium italic">
                "{right.details}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMERGENCY ADVICE */}
      <div className="p-8 bg-zinc-900 rounded-xl text-white flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-zinc-800 rounded-lg shrink-0 border border-zinc-700">
          <AlertCircle className="w-8 h-8 text-blue-400" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-lg font-semibold mb-2">Immediate Legal Advice</h4>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-3xl">
            Never sign a settlement release form at the scene of the accident without fully understanding the extent of vehicle damage or personal injury.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button variant="primary" className="bg-white text-zinc-900 hover:bg-zinc-100">Contact Mediator</Button>
            <Button variant="secondary" className="text-white border-zinc-700 hover:bg-zinc-800">Read Case Laws</Button>
          </div>
        </div>
      </div>

    </div>
  );
}
