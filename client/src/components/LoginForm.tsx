import { useState, FormEvent } from 'react';
import { Theme, VendorData } from '../types';

interface Props {
  theme: Theme;
  onNext: (data: VendorData) => void;
}

const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk',
  'hotmail.com', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'protonmail.com', 'proton.me',
  'mail.com', 'ymail.com', 'rocketmail.com',
  'rediffmail.com', 'zoho.com', 'tutanota.com',
  'mailinator.com', 'tempmail.com', '10minutemail.com',
]);

export default function LoginForm({ theme, onNext }: Props) {
  const [form, setForm] = useState<VendorData>({
    companyName: '', website: '', hqLocation: '',
    contactName: '', contactEmail: '', jobTitle: '',
  });
  const [error, setError] = useState<string | null>(null);

  const dark = theme === 'dark';

  function set(field: keyof VendorData, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function validate(): string | null {
    for (const [key, label] of [
      ['companyName', 'Legal Company Name'],
      ['website', 'Corporate Website'],
      ['hqLocation', 'HQ Location'],
      ['contactName', 'Full Name'],
      ['contactEmail', 'Professional Email'],
      ['jobTitle', 'Job Title'],
    ] as [keyof VendorData, string][]) {
      if (!form[key].trim()) return `${label} is required.`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      return 'Please enter a valid email address.';
    }
    const domain = form.contactEmail.split('@')[1]?.toLowerCase();
    if (!import.meta.env.DEV && domain && FREE_DOMAINS.has(domain)) {
      return 'Personal email providers are not accepted. Please use your corporate email address.';
    }
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    onNext(form);
  }

  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors ${
    dark
      ? 'bg-slate-900 border border-slate-600 text-slate-200 placeholder-slate-500 focus:border-slate-400'
      : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
  }`;
  const labelClass = `block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-600'}`;
  const sectionHeading = `text-xs font-semibold uppercase tracking-widest mb-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`;

  return (
    <div className={`w-full max-w-lg rounded-2xl p-8 ${
      dark ? 'bg-slate-800 border border-slate-700 shadow-lg' : 'bg-white border border-slate-200 shadow-sm'
    }`}>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dark ? '#cbd5e1' : '#1e293b'} strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-2xl font-bold tracking-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
            FORTRESS
          </span>
        </div>
        <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          Vendor Compliance Intake Portal
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Company Information */}
        <div>
          <p className={sectionHeading}>Company Information</p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Legal Company Name</label>
              <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)}
                placeholder="Acme Cyber Labs" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Corporate Website URL</label>
              <input type="url" value={form.website} onChange={e => set('website', e.target.value)}
                placeholder="https://www.acmelabs.io" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>HQ Location / Country</label>
              <input type="text" value={form.hqLocation} onChange={e => set('hqLocation', e.target.value)}
                placeholder="India" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${dark ? 'border-slate-700' : 'border-slate-100'}`} />

        {/* Point of Contact */}
        <div>
          <p className={sectionHeading}>Point of Contact</p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" value={form.contactName} onChange={e => set('contactName', e.target.value)}
                placeholder="Jane Leo" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Professional Email</label>
              <input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)}
                placeholder="jane@acmelabs.io" className={inputClass} />
              <p className={`text-xs mt-1 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                Corporate email only — personal providers not accepted
              </p>
            </div>
            <div>
              <label className={labelClass}>Job Title</label>
              <input type="text" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)}
                placeholder="Chief Information Security Officer" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className={`rounded-lg px-4 py-3 text-sm ${
            dark ? 'bg-red-950/50 border border-red-900 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <button type="submit" className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
          dark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-700'
        }`}>
          Continue to Document Upload
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
