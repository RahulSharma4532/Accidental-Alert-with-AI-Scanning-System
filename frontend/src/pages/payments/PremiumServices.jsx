import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Gavel, Scale, FileSearch, Sparkles, 
  ArrowRight, Check, Zap, HelpCircle, Download, ExternalLink,
  CreditCard, Smartphone, Landmark
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CheckoutOverlay from '../../components/payments/CheckoutOverlay';

const plans = [
  {
    id: 'premium_dispute',
    name: 'Expert Dispute Resolution',
    price: 4999,
    tagline: 'Win your case with experts.',
    icon: <Scale className="w-8 h-8" />,
    color: 'bg-brand-500',
    features: [
      'Empaneled High-Court Mediator',
      'Priority Video Hearing slot',
      'Legal brief preparation assistance',
      'Guaranteed 7-day resolution window',
      'Direct chat with legal experts'
    ],
    popular: true
  },
  {
    id: 'legal_consultation',
    name: 'Legal Consultation',
    price: 1499,
    tagline: 'Professional legal advice.',
    icon: <Gavel className="w-8 h-8" />,
    color: 'bg-blue-600',
    features: [
      '30-minute private video call',
      'Case strength assessment',
      'Document review by specialists',
      'Step-by-step MACT filing guide',
      'Post-call summary report'
    ]
  },
  {
    id: 'priority_claim',
    name: 'Priority Processing',
    price: 999,
    tagline: 'Skip the insurance queue.',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-amber-500',
    features: [
      '48-hour claim status update',
      'Direct surveyor contact info',
      'Automated follow-ups with insurer',
      'Real-time WhatsApp alerts',
      'Zero-processing fee guarantee'
    ]
  },
  {
    id: 'doc_verification',
    name: 'Certified Verification',
    price: 499,
    tagline: 'Ironclad document proof.',
    icon: <ShieldCheck className="w-8 h-8" />,
    color: 'bg-emerald-600',
    features: [
      'Manual Aadhaar/PAN verification',
      'Police FIR authenticity check',
      'Digital verification certificate',
      'Tamper-proof blockchain hash',
      'One-click sharing with insurers'
    ]
  }
];

export default function PremiumServices() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex flex-col text-slate-900 font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="badge-premium-blue flex items-center gap-1.5 mb-4 mx-auto w-max"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Upgrade Your Experience
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-none"
            >
              Expert Legal Support. <br />
              <span className="text-blue-650">Faster Payouts.</span>
            </motion.h1>
            <p className="text-slate-500 text-lg mt-6 font-medium leading-relaxed">
              Empower your claim with professional legal services and priority processing tools designed to maximize your settlement value.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group premium-card p-8 flex flex-col transition-all duration-300 cursor-pointer ${
                  plan.popular ? 'border-blue-600 ring-2 ring-blue-600/10 shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm shadow-blue-500/20">
                    Most Popular
                  </div>
                )}

                <div className={`w-14 h-14 ${plan.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  {plan.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-450 font-semibold mb-6 uppercase tracking-wider">{plan.tagline}</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">₹{plan.price.toLocaleString()}</span>
                  <span className="text-slate-450 font-semibold text-xs uppercase tracking-wider">/service</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1 border-t border-slate-50 pt-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-xs font-semibold text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className={`premium-btn-primary w-full py-3 flex items-center justify-center gap-3 cursor-pointer text-xs uppercase tracking-wider font-bold ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-md text-white' 
                      : 'bg-slate-950 text-white hover:bg-slate-900'
                  }`}
                >
                  Buy Now <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 border-t border-slate-200/80 pt-16">
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-200/80 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Secure Payments</h4>
              <p className="text-xs text-slate-500 font-semibold">256-bit AES encrypted transactions via Razorpay.</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-200/80 mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Instant GST Invoices</h4>
              <p className="text-xs text-slate-500 font-semibold">Download automated tax invoices for all purchases.</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-200/80 mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Refund Guarantee</h4>
              <p className="text-xs text-slate-500 font-semibold">100% money back if resolution isn't provided in 14 days.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* Checkout Overlay */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutOverlay 
            plan={selectedPlan} 
            onClose={() => setIsCheckoutOpen(false)} 
            onSuccess={() => {
              setIsCheckoutOpen(false);
              alert('Payment Successful!');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
