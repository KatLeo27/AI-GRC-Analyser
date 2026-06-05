import { Theme } from '../types';
import ThemeToggle from './ThemeToggle';

interface Props {
  theme: Theme;
  onToggle: () => void;
  onEnter: () => void;
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: 'Region-Aware Policies',
    desc: 'Checks against DPDP Act 2023, GDPR, HIPAA, CERT-In, RBI Framework and more — automatically applied based on your region.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Instant AI Analysis',
    desc: 'Your compliance document is scored by an AI Chief Information Security Officer in seconds — no manual review queues.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    title: 'Salesforce Integrated',
    desc: 'Every review syncs directly to your Salesforce CRM — accounts, contacts, and compliance records created automatically.',
  },
];

export default function LandingPage({ theme, onToggle, onEnter }: Props) {
  const dark = theme === 'dark';

  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-300 ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>

      {/* Animated grid background */}
      <div
        className="absolute inset-0 pointer-events-none animate-grid"
        style={{
          backgroundImage: dark
            ? 'linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)'
            : 'linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={dark ? '#cbd5e1' : '#1e293b'} strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-lg font-bold tracking-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
            FORTRESS
          </span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">

        {/* Eyebrow */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 animate-fade-up ${
          dark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white text-slate-500 border border-slate-200 shadow-sm'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Enterprise Vendor Compliance
        </div>

        {/* Heading */}
        <h1 className={`text-4xl sm:text-5xl font-bold leading-tight tracking-tight max-w-3xl mb-5 animate-fade-up ${
          dark ? 'text-slate-100' : 'text-slate-900'
        }`} style={{ animationDelay: '0.05s' }}>
          AI-Powered Compliance Screening.{' '}
          <span className={dark ? 'text-slate-400' : 'text-slate-500'}>
            Built for Security Teams.
          </span>
        </h1>

        {/* Subtext */}
        <p className={`text-base sm:text-lg max-w-xl mb-10 leading-relaxed animate-fade-up ${
          dark ? 'text-slate-400' : 'text-slate-500'
        }`} style={{ animationDelay: '0.1s' }}>
          Fortress automates third-party vendor security reviews — analysing documentation
          against regional regulations and your internal policies in seconds.
        </p>

        {/* CTA */}
        <button
          onClick={onEnter}
          className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] animate-fade-up ${
            dark
              ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'
          }`}
          style={{ animationDelay: '0.15s' }}
        >
          Begin Vendor Submission
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Feature chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl w-full animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-xl p-5 text-left transition-colors ${
                dark
                  ? 'bg-slate-800/80 border border-slate-700 hover:border-slate-600'
                  : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className={`mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {f.icon}
              </div>
              <p className={`text-sm font-semibold mb-1 ${dark ? 'text-slate-200' : 'text-slate-800'}`}>
                {f.title}
              </p>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6">
        <p className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          Fortress Vendor Compliance Portal · Secured by AI
        </p>
      </footer>
    </div>
  );
}
