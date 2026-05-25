import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTriangleExclamation, faCircleCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
        <FontAwesomeIcon icon={faArrowLeft} className="text-[14px]" /> {trans.auth.signInLink}
      </Link>

      <div className="mb-6 sm:mb-7">
        <h2 className="text-xl sm:text-[26px] font-bold text-ink-900 tracking-[-.02em] leading-tight">{trans.auth.forgotPasswordTitle}</h2>
        <p className="text-xs sm:text-sm text-ink-400 mt-1.5">{trans.auth.forgotPasswordSubtitle}</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 sm:px-3.5 py-2.5 mb-4 sm:mb-5 leading-relaxed">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-[14px] shrink-0 text-red-400" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 text-xs text-forest-700 bg-forest-50 border border-forest-200 rounded-lg px-3 sm:px-3.5 py-2.5 mb-4 sm:mb-5 leading-relaxed">
          <FontAwesomeIcon icon={faCircleCheck} className="text-[14px] shrink-0 text-forest-500" />
          {trans.auth.forgotPasswordSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Email Address</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faEnvelope} className="text-ink-300 shrink-0 text-sm" />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder={trans.auth.emailPlaceholder} required autoComplete="email" />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full !bg-gold-400 hover:!bg-gold-500 !shadow-lg !shadow-gold-200/30">
          {trans.auth.sendResetLink}
        </Button>
      </form>
    </div>
  );
}
