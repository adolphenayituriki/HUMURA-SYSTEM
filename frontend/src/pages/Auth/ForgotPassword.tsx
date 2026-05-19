import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';

export default function ForgotPassword() {
  const { t } = useI18nStore();
  const trans = t();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError(trans.auth.forgotPasswordError); return; }
    setSuccess(true);
    setError('');
  };

  return (
    <div>
      <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors mb-5 sm:mb-6">
        <ArrowLeft size={14} /> {trans.auth.signInLink}
      </Link>

      <div className="mb-6 sm:mb-7">
        <h2 className="text-xl sm:text-[26px] font-bold text-ink-900 tracking-[-.02em] leading-tight">{trans.auth.forgotPasswordTitle}</h2>
        <p className="text-xs sm:text-sm text-ink-400 mt-1.5">{trans.auth.forgotPasswordSubtitle}</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 sm:px-3.5 py-2.5 mb-4 sm:mb-5 leading-relaxed">
          <AlertTriangle size={14} className="shrink-0 text-red-400" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 text-xs text-forest-700 bg-forest-50 border border-forest-200 rounded-lg px-3 sm:px-3.5 py-2.5 mb-4 sm:mb-5 leading-relaxed">
          <CheckCircle size={14} className="shrink-0 text-forest-500" />
          {trans.auth.forgotPasswordSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div className="relative group">
          <Mail size={16} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none transition-colors group-focus-within:text-brand-500 sm:size-[18px]" />
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-3 sm:pr-3.5 rounded-lg text-xs sm:text-sm text-ink-800 placeholder:text-ink-400 bg-ink-50/40 border border-ink-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200/25 transition-all outline-none"
            placeholder={trans.auth.emailPlaceholder} required autoComplete="email" />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {trans.auth.sendResetLink}
        </Button>
      </form>
    </div>
  );
}
