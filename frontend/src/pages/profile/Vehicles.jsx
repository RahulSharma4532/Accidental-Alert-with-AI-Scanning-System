import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Plus, Shield, Calendar, CreditCard, Trash2, Edit3, MoreVertical, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';

const INITIAL_VEHICLES = [
  { id: 1, make: 'Tesla', model: 'Model 3', year: '2023', plate: 'DL 8C AA 1234', color: 'Midnight Silver', status: 'verified', type: 'Electric Sedan' },
  { id: 2, make: 'Toyota', model: 'Fortuner', year: '2021', plate: 'DL 3C CC 5566', color: 'Super White', status: 'pending', type: 'SUV' },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 selection:bg-slate-900 selection:text-white p-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
            My <span className="text-slate-400">Garage</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Manage your registered vehicles and their insurance status. Ensure details are accurate for faster claim processing.
          </p>
        </div>
        
        <Button 
          variant="premium" 
          icon={Plus} 
          onClick={() => setIsAddOpen(true)}
          className="premium-btn-primary cursor-pointer"
        >
          Add New Vehicle
        </Button>
      </div>

      {/* VEHICLE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <motion.div
            key={v.id}
            whileHover={{ y: -4 }}
            className="premium-card group cursor-pointer hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${v.status === 'verified' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                <Car className="w-6 h-6" />
              </div>
              <div>
                {v.status === 'verified' ? (
                  <span className="badge-premium-green">Verified</span>
                ) : (
                  <span className="badge-premium-amber">Pending</span>
                )}
              </div>
            </div>

            <div className="space-y-1 mb-8">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{v.make} {v.model}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{v.type} • {v.year}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Plate Number</p>
                <p className="text-[11px] font-bold text-slate-900">{v.plate}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Color</p>
                <p className="text-[11px] font-bold text-slate-900">{v.color}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Insured</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ADD VEHICLE CARD */}
        <button 
          onClick={() => setIsAddOpen(true)}
          className="premium-card bg-slate-50/50 border-dashed border-slate-200 flex flex-col items-center justify-center text-center hover:bg-white hover:border-slate-400 transition-all duration-300 group cursor-pointer min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 text-slate-900" />
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">Register Vehicle</h4>
          <p className="text-[10px] text-slate-400 font-medium">Add another car to your profile</p>
        </button>
      </div>

      {/* WARNING BOX */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Verification Required</h4>
          <p className="text-[12px] text-blue-700/80 font-semibold leading-relaxed">
            All newly added vehicles must undergo RC verification through our RTO gateway. This typically takes 2-4 hours. Claims can only be filed for "Verified" vehicles.
          </p>
        </div>
      </div>

      {/* ADD MODAL */}
      <Modal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)}
        title="Register New Vehicle"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Make / Manufacturer" placeholder="e.g. BMW, Tesla, Maruti" className="premium-input" />
            <Input label="Model Name" placeholder="e.g. 3 Series, Model X" className="premium-input" />
            <Input label="Registration Plate" placeholder="e.g. DL 00 XX 0000" className="premium-input" />
            <Input label="Manufacture Year" placeholder="e.g. 2024" className="premium-input" />
          </div>
          
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">RC Attachment</h4>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mb-3">Please upload a clear photo of your Registration Certificate.</p>
            <Button variant="outline" size="sm" className="w-full premium-btn-secondary cursor-pointer">Select RC Image</Button>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="premium-btn-secondary cursor-pointer">Cancel</Button>
            <Button variant="premium" className="premium-btn-primary cursor-pointer">Submit for Verification</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
