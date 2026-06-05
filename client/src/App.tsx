import { useState } from 'react';
import { Status, Theme, Page, VendorData } from './types';
import { submitCompliance } from './api/complianceApi';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import SubmissionForm from './components/SubmissionForm';
import SuccessCard from './components/SuccessCard';
import StepIndicator from './components/StepIndicator';

export default function App() {
  const [theme, setTheme]           = useState<Theme>('dark');
  const [page, setPage]             = useState<Page>('landing');
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [status, setStatus]         = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  function handleEnter() {
    setPage('login');
  }

  function handleLogin(data: VendorData) {
    setVendorData(data);
    setPage('submit');
    setStatus('idle');
    setErrorMessage(null);
  }

  function handleBack() {
    setPage('login');
    setStatus('idle');
    setErrorMessage(null);
  }

  async function handleSubmit(file: File) {
    if (!vendorData) return;
    setStatus('submitting');
    setErrorMessage(null);
    try {
      await submitCompliance(vendorData, file);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    }
  }

  function handleClose() {
    setPage('landing');
    setVendorData(null);
    setStatus('idle');
    setErrorMessage(null);
  }

  const dark = theme === 'dark';

  // Landing page takes full screen with its own layout
  if (page === 'landing') {
    return <LandingPage theme={theme} onToggle={toggleTheme} onEnter={handleEnter} />;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-colors duration-300 ${
      dark ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {page === 'submit' && status === 'success' ? (
        <SuccessCard theme={theme} onClose={handleClose} />
      ) : (
        <>
          <StepIndicator
            theme={theme}
            currentStep={page === 'login' ? 1 : 2}
          />

          {page === 'login' && (
            <div className="animate-fade-up w-full max-w-lg">
              <LoginForm theme={theme} onNext={handleLogin} />
            </div>
          )}

          {page === 'submit' && vendorData && (
            <div className="animate-fade-up w-full max-w-lg">
              <SubmissionForm
                theme={theme}
                status={status}
                vendor={vendorData}
                onSubmit={handleSubmit}
                onBack={handleBack}
                errorMessage={errorMessage}
              />
            </div>
          )}
        </>
      )}

      <p className={`mt-6 text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
        Fortress Vendor Compliance Portal · Secured by AI
      </p>
    </div>
  );
}
