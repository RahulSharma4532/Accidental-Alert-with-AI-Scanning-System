import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Shield, CreditCard, Smartphone, Landmark, 
  ChevronRight, ArrowLeft, CheckCircle2, Lock,
  AlertCircle, Info, Receipt
} from 'lucide-react';
import axios from 'axios';

export default function CheckoutOverlay({ plan, onClose, onSuccess }) {
  const [step, setStep] = useState('methods');
  const [method, setMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!plan) return null;

  const totalAmount = plan.price;
  const gst = totalAmount * 0.18;
  const grandTotal = totalAmount + gst;

  const handlePay = async () => {
    setIsProcessing(true);
    
    // Simulate Order Creation & Verification
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      // 1. Create Order
      const orderRes = await axios.post('http://localhost:8000/api/payments/create-order', {
        service_type: plan.id,
        amount: totalAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Simulate Payment Delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 3. Verify Payment
      const verifyRes = await axios.post('http://localhost:8000/api/payments/verify', {
        order_id: orderRes.data.order_id,
        payment_id: 'pay_' + Math.random().toString(36).substr(2, 9),
        service_type: plan.id,
        amount: totalAmount,
        metadata: { plan_name: plan.name }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (verifyRes.data.success) {
        setIsDone(true);
        setTimeout(() => {
          onSuccess(verifyRes.data);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const methods = [
    { id: 'upi', label: 'UPI (GPay, PhonePe)', icon: <Smartphone className="w-5 h-5" />, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', label: 'Cards', icon: <CreditCard className="w-5 h-5" />, desc: 'Visa, Mastercard, RuPay' },
    { id: 'nb', label: 'Net Banking', icon: <Landmark className="w-5 h-5" />, desc: 'SBI, HDFC, ICICI, etc.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Secure Checkout</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by AccidentAlert Pay</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full max-h-[70vh] overflow-y-auto">
          {/* Summary Sidebar */}
          <div className="w-full md:w-56 bg-slate-50/50 p-8 border-r border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Summary</div>
            <h4 className="font-bold text-slate-900 mb-1">{plan.name}</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">{plan.tagline}</p>
            
            <div className="space-y-3 py-6 border-t border-dashed border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Price</span>
                <span className="font-bold text-slate-900">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST (18%)</span>
                <span className="font-bold text-slate-900">₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-slate-200">
                <span className="font-black text-slate-900">Total</span>
                <span className="font-black text-brand-600">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Lock className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Security</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Your payment data is fully encrypted and never stored on our servers.</p>
            </div>
          </div>

          {/* Payment Interaction Area */}
          <div className="flex-1 p-8">
            <AnimatePresence mode="wait">
              {isDone ? (
                <motion.div 
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h3>
                  <p className="text-slate-500 mb-6">Thank you for your purchase. <br />Your invoice has been generated.</p>
                  <div className="inline-flex items-center gap-2 text-xs font-black text-brand-600 bg-brand-50 px-4 py-2 rounded-full uppercase tracking-widest">
                    Unlocking Service...
                  </div>
                </motion.div>
              ) : isProcessing ? (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin mb-6" />
                  <h3 className="text-xl font-black text-slate-900 mb-2">Processing Payment</h3>
                  <p className="text-slate-500">Connecting to secure gateway. <br />Please do not refresh the page.</p>
                </motion.div>
              ) : step === 'methods' ? (
                <motion.div 
                  key="methods"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black text-slate-900 mb-6">Select Payment Method</h3>
                  <div className="grid gap-4">
                    {methods.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setMethod(m); setStep('details'); }}
                        className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-brand-500 group-hover:bg-white transition-colors shadow-sm shrink-0">
                            {m.icon}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-slate-900">{m.label}</div>
                            <div className="text-xs text-slate-400">{m.desc}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button onClick={() => setStep('methods')} className="flex items-center gap-3 text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 shrink-0" /> Back to methods
                  </button>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-500 shadow-sm border border-slate-100 shrink-0">
                        {method.icon}
                      </div>
                      <div className="font-bold text-slate-900">{method.label}</div>
                    </div>
                    
                    {method.id === 'upi' ? (
                      <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Enter VPA / UPI ID</label>
                        <input type="text" placeholder="username@upi" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Card Details</label>
                        <div className="space-y-3">
                          <input type="text" placeholder="Card Number" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-500" />
                          <div className="flex gap-3">
                            <input type="text" placeholder="MM/YY" className="w-1/2 px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-500" />
                            <input type="password" placeholder="CVV" className="w-1/2 px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-500" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handlePay}
                    className="w-full py-5 bg-brand-500 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-brand-500/30 hover:bg-brand-600 hover:-translate-y-1 transition-all"
                  >
                    Pay ₹{grandTotal.toLocaleString()}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Transaction is safe & secure</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
