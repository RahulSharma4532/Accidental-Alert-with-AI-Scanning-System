import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoGallery({ photos = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!photos.length) return (
    <div className="p-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No photos available</p>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-[1.5rem] bg-slate-100 border border-slate-200"
            onClick={() => setSelectedIndex(idx)}
          >
            <img 
              src={photo.url || photo} 
              alt={`Gallery ${idx}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="text-white w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
            <button 
              className="absolute top-8 right-8 p-4 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              className="absolute left-8 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[90vw] max-h-[80vh] relative"
            >
              <img 
                src={photos[selectedIndex].url || photos[selectedIndex]} 
                alt="Full Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-12 left-0 w-full text-center">
                <p className="text-white text-[10px] font-black uppercase tracking-[0.4em]">
                  Evidence Image {selectedIndex + 1} / {photos.length}
                </p>
              </div>
            </motion.div>

            <button 
              className="absolute right-8 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setSelectedIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
