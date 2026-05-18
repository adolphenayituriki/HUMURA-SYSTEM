import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { t } = useI18nStore();
  const trans = t();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = service.getUsers().find((u) => u.email === email);
    if (!user) { setError(trans.auth.noAccountFound); return; }
    login(user, 'mock-jwt-token');
    navigate('/dashboard');
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[26px] font-bold text-ink-900 tracking-[-.02em] leading-tight">
          {trans.auth.welcomeBack}
        </h2>
        <p className="text-sm text-ink-400 mt-1.5">
          {trans.auth.signInTo}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="relative group">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none transition-colors group-focus-within:text-brand-500" />
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 pl-9 pr-3.5 rounded-lg text-sm text-ink-800 placeholder:text-ink-400 bg-ink-50/40 border border-ink-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200/25 transition-all outline-none"
            placeholder={trans.auth.email} required autoComplete="email" />
        </div>

        <div className="relative group">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none transition-colors group-focus-within:text-brand-500" />
          <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 pl-9 pr-10 rounded-lg text-sm text-ink-800 placeholder:text-ink-400 bg-ink-50/40 border border-ink-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200/25 transition-all outline-none"
            placeholder={trans.auth.password} required autoComplete="current-password" />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors cursor-pointer">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-ink-500 cursor-pointer select-none hover:text-ink-700 transition-colors">
            <input type="checkbox"
              className="w-3.5 h-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-300 focus:ring-offset-0 cursor-pointer" />
            {trans.auth.rememberMe}
          </label>
          <Link to="/forgot-password"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            {trans.auth.forgotPassword}
          </Link>
        </div>

        <button type="submit"
          className="w-full h-11 rounded-lg text-sm font-semibold text-white tracking-wide transition-all cursor-pointer"
          style={{ background: '#005d2f' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#00753d'}
          onMouseOut={(e) => e.currentTarget.style.background = '#005d2f'}
        >
          {trans.auth.signIn}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-ink-100 text-center">
        <p className="text-xs text-ink-400">
          {trans.auth.noAccount}{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            {trans.auth.createOne}
          </Link>
        </p>
      </div>
    </div>
  );
}
