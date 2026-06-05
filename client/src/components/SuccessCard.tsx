import { Theme } from '../types';

interface Props {
  theme: Theme;
  onClose: () => void;
}

export default function SuccessCard({ theme, onClose }: Props) {
  const dark = theme === 'dark';

  return (
    <div className={`w-full max-w-lg rounded-2xl p-8 text-center ${
      dark
        ? 'bg-slate-800 border border-slate-700 shadow-lg'
        : 'bg-white border border-slate-200 shadow-sm'
    }`}>
      {/* Emerald checkmark — animated scale-in */}
      <div className="flex justify-center mb-6">
        <div className="animate-scale-in w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h2 className={`text-xl font-bold mb-4 ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
        Documentation Ingested Successfully
      </h2>

      {/* Body */}
      <p className={`text-sm leading-relaxed mb-8 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        Thank you for submitting your security documentation. Your compliance files have been
        successfully registered to our secure intake repository. No further action is required
        at this time. Our corporate vendor management team will evaluate your profile against
        standard guidelines and connect with your account executive regarding next steps.
      </p>

      {/* Close button */}
      <button
        onClick={onClose}
        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          dark
            ? 'border border-slate-600 text-slate-400 hover:bg-slate-700'
            : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
        }`}
      >
        Close Portal
      </button>
    </div>
  );
}
