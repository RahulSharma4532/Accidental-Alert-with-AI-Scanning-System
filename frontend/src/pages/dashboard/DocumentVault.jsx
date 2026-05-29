import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Shield, CreditCard, User, Plus, Search, 
  Filter, Download, Trash2, Clock, MoreVertical, CheckCircle2, ArrowLeft, UploadCloud, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const DOC_TYPES = [
  { id: 'fir', label: 'FIR Copy', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'medical_report', label: 'Medical Report', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'repair_invoice', label: 'Repair Invoice', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'other_document', label: 'Other Evidence', icon: Shield, color: 'text-zinc-600', bg: 'bg-zinc-100' },
];

export default function DocumentVault() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Upload form state
  const [selectedClaimId, setSelectedClaimId] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('other_document');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocumentsAndClaims();
  }, []);

  const fetchDocumentsAndClaims = async () => {
    try {
      setLoading(true);
      const docsRes = await api.get('/documents');
      const claimsRes = await api.get('/claims');
      
      setDocs(docsRes.data || []);
      setClaims(claimsRes.data || []);
      if (claimsRes.data && claimsRes.data.length > 0) {
        setSelectedClaimId(claimsRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to retrieve documents & claims', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedClaimId) {
      alert('Please select a file and link it to an active claim.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('claim_id', selectedClaimId);
    formData.append('doc_type', selectedDocType);
    formData.append('document', selectedFile);

    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Reset form
      setSelectedFile(null);
      setIsUploadOpen(false);
      // Refresh list
      fetchDocumentsAndClaims();
    } catch (error) {
      console.error('Upload failed', error);
      alert('File upload failed. Ensure the file is less than 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await api.get(`/claims/${doc.claim_id}/documents/${doc.id}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determine extension from type/path or default
      const filename = doc.file_path.split('/').pop() || `${doc.doc_type}_document.enc`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to retrieve and decrypt file. Please verify auth token permissions.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this document? This action is immutable.')) {
      return;
    }

    try {
      await api.delete(`/documents/${id}`);
      setDocs(docs.filter(d => d.id !== id));
    } catch (error) {
      console.error('Failed to delete document', error);
      alert('Deletion failed. Try again later.');
    }
  };

  const filteredDocs = filter === 'all' 
    ? docs 
    : docs.filter(d => d.doc_type === filter);

  return (
    <div className="min-h-screen mesh-bg-light dot-grid bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0 z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-lg font-bold text-slate-950">Uploaded Documents</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="badge-premium-blue flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            End-to-End Encrypted
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
      
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Uploaded Documents</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Manage your legal documents, insurance policies, and identity proofs securely.
              </p>
            </div>
            
            <button 
              disabled={claims.length === 0}
              onClick={() => setIsUploadOpen(!isUploadOpen)} 
              className={`premium-btn-primary flex items-center gap-2 cursor-pointer ${claims.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={claims.length === 0 ? 'File a claim before uploading documents' : ''}
            >
              <Plus className="w-4 h-4" /> Upload New Document
            </button>
          </div>

          {/* Upload Area */}
          <AnimatePresence>
            {isUploadOpen && claims.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleUploadSubmit} className="premium-card bg-white/95 backdrop-blur-md border-2 border-dashed border-slate-350 p-6 mb-8 space-y-6 shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Link to Claim</label>
                      <select 
                        value={selectedClaimId}
                        onChange={(e) => setSelectedClaimId(e.target.value)}
                        className="premium-input w-full bg-white"
                        required
                      >
                        {claims.map((claim) => (
                          <option key={claim.id} value={claim.id}>
                            CLM-{(claim.claim_id || claim.id.toString()).slice(0, 8)} ({claim.accident?.accident_type || 'Claim'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Document Category</label>
                      <select 
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="premium-input w-full bg-white"
                      >
                        {DOC_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 hover:bg-slate-100/80 transition-all duration-300 relative cursor-pointer group">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      required
                    />
                    <UploadCloud className="w-10 h-10 text-slate-400 mb-3 group-hover:scale-105 transition-transform" />
                    <span className="text-sm font-semibold text-slate-700">
                      {selectedFile ? selectedFile.name : 'Select files to encrypt & store'}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</span>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsUploadOpen(false)} 
                      className="premium-btn-secondary cursor-pointer"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="premium-btn-primary flex items-center gap-2 cursor-pointer"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                        </>
                      ) : (
                        'Upload Document'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters & Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`premium-card py-4 text-left transition-all duration-350 cursor-pointer flex flex-col justify-between ${
                filter === 'all' 
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md -translate-y-0.5' 
                  : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-350 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">All Files</span>
              </div>
              <p className={`text-2xl font-black ${filter === 'all' ? 'text-white' : 'text-slate-900'}`}>{docs.length}</p>
            </button>

            {DOC_TYPES.map((type) => {
              const count = docs.filter(d => d.doc_type === type.id).length;
              return (
                <button
                  key={type.id}
                  onClick={() => setFilter(type.id)}
                  className={`premium-card py-4 text-left transition-all duration-350 cursor-pointer flex flex-col justify-between ${
                    filter === type.id 
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md -translate-y-0.5' 
                      : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-350 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 truncate">
                    <type.icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider truncate">{type.label}</span>
                  </div>
                  <p className={`text-2xl font-black ${filter === type.id ? 'text-white' : 'text-slate-900'}`}>{count}</p>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-slate-350" />
            </div>
          ) : (
            /* Document Table */
            <div className="premium-card p-0 overflow-hidden border border-slate-200/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                  <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Document Name</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Date Uploaded</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => {
                          const typeInfo = DOC_TYPES.find(t => t.id === doc.doc_type) || {
                            label: 'Other Report', icon: FileText, color: 'text-zinc-600', bg: 'bg-zinc-100'
                          };
                          const TypeIcon = typeInfo.icon;
                          const name = doc.file_path.split('/').pop() || 'document.enc';
                          
                          return (
                            <motion.tr 
                              key={doc.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeInfo.bg} ${typeInfo.color}`}>
                                    <TypeIcon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-800 block truncate max-w-xs group-hover:text-blue-600 transition-colors">{name}</span>
                                    <span className="text-[10px] text-slate-450 font-mono font-medium block">
                                      Linked to CLM-{(doc.claim?.claim_id || doc.claim_id.toString()).slice(0, 8)}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-700">{typeInfo.label}</td>
                              <td className="px-6 py-4 text-slate-450 font-medium">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={doc.verified ? 'badge-premium-green' : 'badge-premium-amber'}>
                                  {doc.verified ? 'Verified' : 'Pending Review'}
                                </span>
                              </td>
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => handleDownload(doc)}
                                    className="text-slate-400 hover:text-blue-600 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer" 
                                    title="Decrypt & Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(doc.id)}
                                    className="text-slate-400 hover:text-rose-600 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer" 
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                            <FileText className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                            <p>No documents found matching this filter.</p>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
