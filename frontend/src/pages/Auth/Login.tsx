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

export default function Login() {
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

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-[26px] font-bold text-ink-900 tracking-[-.02em] leading-tight">
          Sign In
        </h2>
        <p className="text-xs sm:text-sm text-ink-400 mt-1.5">
          Access your secure dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Email Address</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-ink-50/40 border border-ink-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200/25 transition-all">
            <FontAwesomeIcon icon={faEnvelope} className="text-ink-400 shrink-0 text-sm" />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your registered email" required autoComplete="email" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Password</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-ink-50/40 border border-ink-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200/25 transition-all">
            <FontAwesomeIcon icon={faLock} className="text-ink-400 shrink-0 text-sm" />
            <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your password" required autoComplete="current-password" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="text-ink-400 hover:text-ink-600 transition-colors cursor-pointer p-1 shrink-0">
              {showPw ? <FontAwesomeIcon icon={faEyeSlash} className="text-sm" /> : <FontAwesomeIcon icon={faEye} className="text-sm" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 sm:px-3.5 py-2.5 leading-relaxed">
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

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-ink-100 text-center">
        <p className="text-xs text-ink-400">
          New to the platform?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            Create an account
          </Link>
        </p>
      </div>

      {/* Demo Users — toggle section */}
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          onClick={() => setShowDemo(!showDemo)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-ink-200 bg-ink-50/20 hover:bg-amber-50 hover:border-amber-300 text-xs font-medium text-ink-500 hover:text-amber-700 transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faShield} className="text-amber-400" />
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
                className="flex items-center gap-3 w-full text-left p-2.5 sm:p-3 rounded-lg border border-ink-100 bg-ink-50/30 hover:bg-brand-50 hover:border-brand-200 transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                  {u.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-ink-800 truncate">{u.fullName}</p>
                  <p className="text-[10px] sm:text-xs text-ink-400 truncate">{u.email}</p>
                  <p className="text-[10px] text-brand-500 font-medium truncate">
                    {trans.admin.roles[ROLE_LABEL_KEYS[u.role] as keyof typeof trans.admin.roles] as string}
                  </p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="text-ink-300 group-hover:text-brand-400 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
