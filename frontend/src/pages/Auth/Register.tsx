import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { useI18nStore } from '../../i18n';

export default function Register() {
  const { t } = useI18nStore();
  const trans = t();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inputClass = 'w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-3 sm:pr-3.5 rounded-lg text-xs sm:text-sm text-ink-800 placeholder:text-ink-400 bg-ink-50/40 border border-ink-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200/25 transition-all outline-none';
  const selectClass = 'w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-3 sm:pr-3.5 rounded-lg text-xs sm:text-sm text-ink-800 bg-ink-50/40 border border-ink-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200/25 transition-all outline-none appearance-none cursor-pointer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !district || !password) { setError(trans.auth.registerError); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4 sm:mb-5">
          <CheckCircle size={24} className="text-forest-600 sm:size-[28px]" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-ink-900 mb-2">{trans.auth.accountCreated}</h2>
        <p className="text-xs sm:text-sm text-ink-400 mb-5 sm:mb-6">{trans.auth.accountPending}</p>
        <Link to="/login"
          className="inline-flex items-center justify-center h-10 sm:h-11 px-6 sm:px-7 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all"
          style={{ background: '#005d2f' }}>
          {trans.auth.signInLink}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-7">
        <h2 className="text-xl sm:text-[26px] font-bold text-ink-900 tracking-[-.02em] leading-tight">{trans.auth.registerTitle}</h2>
        <p className="text-xs sm:text-sm text-ink-400 mt-1.5">{trans.auth.registerSubtitle}</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 sm:px-3.5 py-2.5 mb-4 sm:mb-5 leading-relaxed">
          <AlertTriangle size={14} className="shrink-0 text-red-400" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <div className="relative group">
          <User size={16} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none transition-colors group-focus-within:text-brand-500 sm:size-[18px]" />
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder={trans.auth.fullNamePlaceholder} required />
        </div>
        <div className="relative group">
          <Mail size={16} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none transition-colors group-focus-within:text-brand-500 sm:size-[18px]" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder={trans.auth.emailPlaceholder} required />
        </div>
        <div className="relative group">
          <Phone size={16} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none transition-colors group-focus-within:text-brand-500 sm:size-[18px]" />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder={trans.auth.phonePlaceholder} required />
        </div>
        <div className="relative group">
          <MapPin size={16} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none z-10 transition-colors group-focus-within:text-brand-500 sm:size-[18px]" />
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectClass + ' pl-9 sm:pl-10'}>
            <option value="">{trans.auth.selectDistrict}</option>
            {['Gasabo','Kicukiro','Nyarugenge','Musanze','Rubavu','Huye','Muhanga','Nyagatare'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="relative group">
          <Lock size={16} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none transition-colors group-focus-within:text-brand-500 sm:size-[18px]" />
          <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass + ' pr-10'} placeholder={trans.auth.passwordMin} required minLength={8} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors cursor-pointer p-1">
            {showPw ? <EyeOff size={16} className="sm:size-[18px]" /> : <Eye size={16} className="sm:size-[18px]" />}
          </button>
        </div>

        <button type="submit"
          className="w-full h-10 sm:h-12 rounded-lg text-xs sm:text-sm font-semibold text-white tracking-wide transition-all cursor-pointer mt-1"
          style={{ background: '#005d2f' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#00753d'}
          onMouseOut={(e) => e.currentTarget.style.background = '#005d2f'}
        >
          {trans.auth.createAccount}
        </button>
      </form>

      <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-ink-100 text-center">
        <p className="text-xs text-ink-400">
          {trans.auth.alreadyHaveAccount}{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">{trans.auth.signInLink}</Link>
        </p>
      </div>
    </div>
  );
}
