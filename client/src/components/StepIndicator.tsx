import { Theme } from '../types';

interface Props {
  currentStep: 1 | 2;
  theme: Theme;
}

const steps = ['Company Details', 'Upload Document', 'Confirmed'];

export default function StepIndicator({ currentStep, theme }: Props) {
  const dark = theme === 'dark';

  return (
    <div className="flex items-center gap-0 mb-6 w-full max-w-lg">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone    = stepNum < currentStep;
        const isActive  = stepNum === currentStep;
        const isFuture  = stepNum > currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDone
                  ? 'bg-emerald-500 text-white'
                  : isActive
                    ? dark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                    : dark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
              }`}>
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : stepNum}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${
                isActive
                  ? dark ? 'text-slate-200' : 'text-slate-800'
                  : dark ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mx-2 mb-4 transition-colors ${
                isDone
                  ? 'bg-emerald-500'
                  : dark ? 'bg-slate-700' : 'bg-slate-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
