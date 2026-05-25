import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faChevronDown, faChevronRight, faShield } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/shared/Button';
import { useAuthStore } from '../../store/authStore';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';
import type { UserRole } from '../../types';

const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  admin: 'nationalAdmin',
  district_hospital: 'districtHospital',
  health_center: 'healthCenter',
  chw: 'communityHealthWorker',
  sociotherapy_facilitator: 'sociotherapyFacilitator',
  cooperative_leader: 'cooperativeLeader',
  youth_counselor: 'youthCounselor',
  emergency_responder: 'emergencyResponder',
  community_member: 'communityMember',
};

interface LoginProps {
  onSwitchMode?: () => void;
}

export default function Login({ onSwitchMode }: LoginProps) {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { t } = useI18nStore();
  const trans = t();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = service.getUsers().find((u) => u.email === email);
    if (!user) { setError('No account found with this email.'); return; }
    login(user, 'mock-jwt-token');
    navigate('/dashboard');
  };

  const loginAsDemo = (userEmail: string) => {
    const user = service.getUsers().find((u) => u.email === userEmail);
    if (user) {
      setError('');
      login(user, 'mock-jwt-token');
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = () => {
    const email = 'google.user@gmail.com';
    let user = service.getUsers().find((u) => u.email === email);
    if (!user) {
      service.addUser({ id: 'U-G001', role: 'community_member', fullName: 'Google User', email, district: 'Gasabo' });
      user = service.getUsers().find((u) => u.email === email)!;
    }
    setError('');
    login(user, 'mock-jwt-token');
    navigate('/dashboard');
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-ink-900 tracking-[-.02em] leading-tight">
          Sign In
        </h2>
        <p className="text-xs text-ink-400 mt-1">
          Access your secure dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1 block">Email Address</label>
          <div className="flex items-center gap-3 w-full h-10 sm:h-11 px-3 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faEnvelope} className="text-ink-300 shrink-0 text-xs" />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your registered email" required autoComplete="email" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1 block">Password</label>
          <div className="flex items-center gap-3 w-full h-10 sm:h-11 px-3 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faLock} className="text-ink-300 shrink-0 text-xs" />
            <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your password" required autoComplete="current-password" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="text-ink-400 hover:text-ink-600 transition-colors cursor-pointer p-1 shrink-0">
              {showPw ? <FontAwesomeIcon icon={faEyeSlash} className="text-xs" /> : <FontAwesomeIcon icon={faEye} className="text-xs" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Link to="/forgot-password"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full !bg-gold-400 hover:!bg-gold-500 !shadow-md !shadow-gold-200/30">
          Sign In
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-100" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-ink-400">or continue with</span></div>
      </div>

      <button type="button" onClick={handleGoogleSignIn}
        className="w-full h-10 flex items-center justify-center gap-2.5 rounded-lg border border-ink-200 bg-white hover:bg-ink-50 transition-all text-sm font-medium text-ink-600 shadow-sm">
        <svg viewBox="0 0 48 48" width="18" height="18">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A24.01 24.01 0 0 0 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Sign in with Google
      </button>

      <div className="mt-4 pt-3 border-t border-ink-100 text-center">
        <p className="text-xs text-ink-400">
          New to the platform?{' '}
          <button type="button" onClick={onSwitchMode} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer">
            Create an account
          </button>
        </p>
      </div>

      {/* Demo Users — toggle section */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowDemo(!showDemo)}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-ink-200 bg-ink-50/20 hover:bg-gold-50 hover:border-gold-300 text-xs font-medium text-ink-500 hover:text-gold-700 transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faShield} className="text-gold-400" />
          {trans.auth.demoUsers}
          {showDemo ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
        </button>

        {showDemo && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {service.getUsers().map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => loginAsDemo(u.email)}
                className="flex items-center gap-3 w-full text-left p-2.5 sm:p-3 rounded-lg border border-ink-100 bg-white hover:bg-gold-50 hover:border-gold-200 transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                  {u.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-ink-800 truncate">{u.fullName}</p>
                  <p className="text-[10px] sm:text-xs text-ink-400 truncate">{u.email}</p>
                  <p className="text-[10px] text-gold-600 font-medium truncate">
                    {trans.admin.roles[ROLE_LABEL_KEYS[u.role] as keyof typeof trans.admin.roles] as string}
                  </p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="text-ink-300 group-hover:text-gold-400 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
