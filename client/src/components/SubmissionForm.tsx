import { useState, useRef, DragEvent, FormEvent } from 'react';
import { Theme, Status, VendorData } from '../types';

interface Props {
  theme: Theme;
  status: Status;
  vendor: VendorData;
  onSubmit: (file: File) => void;
  onBack: () => void;
  errorMessage: string | null;
}

export default function SubmissionForm({ theme, status, vendor, onSubmit, onBack, errorMessage }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = status === 'submitting';
  const dark = theme === 'dark';

  const ALLOWED_MIME = [
    'application/pdf', 'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  function handleFileSelect(f: File) {
    if (!ALLOWED_MIME.includes(f.type) && !['.pdf', '.txt', '.docx'].some(ext => f.name.endsWith(ext))) {
      setValidationError('Unsupported file type. Please upload a .pdf, .txt, or .docx file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) { setValidationError('File exceeds the 10 MB limit.'); return; }
    setValidationError(null);
    setFile(f);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) { setValidationError('Please upload a compliance document.'); return; }
    setValidationError(null);
    onSubmit(file);
  }

  const displayError = validationError || errorMessage;
  const labelClass = `block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-600'}`;

  return (
    <div className={`w-full max-w-lg rounded-2xl p-8 ${
      dark ? 'bg-slate-800 border border-slate-700 shadow-lg' : 'bg-white border border-slate-200 shadow-sm'
    }`}>
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dark ? '#cbd5e1' : '#1e293b'} strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-xl font-bold tracking-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}>FORTRESS</span>
        </div>
        <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Upload Compliance Document</p>
      </div>

      {/* Vendor summary */}
      <div className={`rounded-lg p-4 mb-6 ${dark ? 'bg-slate-900 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Submission Details</p>
        <p className={`text-sm font-medium ${dark ? 'text-slate-200' : 'text-slate-800'}`}>{vendor.companyName}</p>
        <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{vendor.contactName} · {vendor.contactEmail}</p>
        <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{vendor.jobTitle} · {vendor.hqLocation}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label className={labelClass}>Compliance Document</label>
        <div
          onClick={() => !isSubmitting && fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); if (!isSubmitting) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-lg p-8 text-center cursor-pointer transition-all mb-4 ${
            dark
              ? `border-2 border-dashed bg-slate-900 ${dragOver ? 'border-slate-400' : 'border-slate-600'}`
              : `border-2 border-dashed bg-slate-50 ${dragOver ? 'border-slate-400' : 'border-slate-200'}`
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.txt,.docx"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
            disabled={isSubmitting} className="hidden" />
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dark ? '#94a3b8' : '#475569'} strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className={`text-sm font-medium truncate max-w-[220px] ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{file.name}</span>
              {!isSubmitting && (
                <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                  className={`text-xs ml-1 ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
              )}
            </div>
          ) : (
            <div>
              <svg className="mx-auto mb-3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dark ? '#64748b' : '#94a3b8'} strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" />
                <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
              </svg>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Drag & drop or <span className={`font-medium ${dark ? 'text-slate-200' : 'text-slate-700'}`}>browse</span>
              </p>
              <p className={`text-xs mt-1 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>.pdf, .txt, .docx — max 10 MB</p>
            </div>
          )}
        </div>

        {displayError && (
          <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${
            dark ? 'bg-red-950/50 border border-red-900 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>{displayError}</div>
        )}

        <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 mb-3 ${
          dark ? 'bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-60' : 'bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-60'
        }`}>
          {isSubmitting ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
              </svg>
              Submitting…
            </>
          ) : 'Submit Documentation'}
        </button>

        <button type="button" onClick={onBack} disabled={isSubmitting}
          className={`w-full py-2.5 text-sm transition-colors rounded-lg ${
            dark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
          }`}>
          ← Back
        </button>
      </form>
    </div>
  );
}
