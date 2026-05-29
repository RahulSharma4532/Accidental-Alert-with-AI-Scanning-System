import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function FileUpload({ 
  onFileSelect, 
  accept = "image/*,application/pdf", 
  maxSize = 10, // MB
  label = "Upload Document",
  multiple = false 
}) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const processFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSize;
    });

    if (multiple) {
      setFiles(prev => [...prev, ...validFiles]);
      onFileSelect?.([...files, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
      onFileSelect?.(validFiles[0]);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [multiple, files]);

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFileSelect?.(multiple ? updated : null);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center text-center group
          ${isDragging ? 'border-slate-900 bg-slate-50 scale-[0.99]' : 'border-slate-100 hover:border-slate-300 bg-white'}
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => processFiles(e.target.files)}
          accept={accept}
          multiple={multiple}
        />
        
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
          <Upload className="w-6 h-6 text-slate-900" />
        </div>
        
        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2">
          {label}
        </h4>
        <p className="text-[10px] text-slate-400 font-medium">
          Drag & drop or click to browse <br />
          <span className="text-[9px] opacity-60">Max {maxSize}MB per file</span>
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {files.map((file, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl animate-in slide-in-from-bottom-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                {file.type.includes('image') ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-900 truncate">{file.name}</p>
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready
                </p>
              </div>
              <button 
                onClick={() => removeFile(idx)}
                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
