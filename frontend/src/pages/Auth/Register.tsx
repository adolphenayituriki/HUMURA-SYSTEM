import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleCheck, faUser, faEnvelope, faIdCard, faLocationDot, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/shared/Button';
import { useToastStore } from '../../store/toastStore';
import { service } from '../../services/mockData';

interface RegisterProps {
  onSwitchMode?: () => void;
}

export default function Register({ onSwitchMode }: RegisterProps) {
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName || !nationalId || !email || !district || !password) { setError('Please fill in all required fields.'); return; }
    const exists = service.getUsers().find(u => u.email === email);
    if (exists) { setError('An account with this email already exists.'); return; }
    service.addUser({
      id: `U-${String(service.getUsers().length + 1).padStart(3, '0')}`,
      role: 'community_member',
      fullName,
      email,
      district,
    });
    addToast('Account created successfully. You can now sign in.', 'success');
    setSuccess(true);
  };

  const handleGoogleSignIn = () => {
    const email = 'google.user@gmail.com';
    let user = service.getUsers().find((u) => u.email === email);
    if (!user) {
      service.addUser({ id: 'U-G001', role: 'community_member', fullName: 'Google User', email, district: 'Gasabo' });
      user = service.getUsers().find((u) => u.email === email)!;
    }
    addToast('Signed up with Google successfully.', 'success');
    login(user, 'mock-jwt-token');
    navigate('/dashboard');
  };

  if (success) {
    return (
      <div className="text-center py-10 sm:py-12">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-forest-50 border-2 border-forest-200/60 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-sm">
          <FontAwesomeIcon icon={faCircleCheck} className="text-[28px] text-forest-600 sm:text-[32px]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink-900 mb-3">Account Created</h2>
        <p className="text-sm sm:text-base text-ink-400 leading-relaxed max-w-xs mx-auto mb-8 sm:mb-10">Your account is pending approval. You will be notified once activated.</p>
        <button type="button" onClick={onSwitchMode}
          className="inline-flex items-center justify-center h-11 sm:h-12 px-8 sm:px-10 rounded-xl text-sm sm:text-base font-bold text-white bg-gold-400 hover:bg-gold-500 active:bg-gold-600 transition-all shadow-[0_2px_10px_rgba(253,185,0,.25)] hover:shadow-[0_4px_16px_rgba(253,185,0,.3)] active:scale-[.97] cursor-pointer">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-ink-900 tracking-[-.02em] leading-tight">Create an Account</h2>
        <p className="text-xs text-ink-400 mt-1">Join the HUMURA platform</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3 leading-relaxed">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-[13px] shrink-0 text-red-400" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1 block">Full Name</label>
          <div className="flex items-center gap-3 w-full h-10 sm:h-11 px-3 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faUser} className="text-ink-300 shrink-0 text-xs" />
            <input value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your full name" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1 block">National ID / Passport Number</label>
          <div className="flex items-center gap-3 w-full h-10 sm:h-11 px-3 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faIdCard} className="text-ink-300 shrink-0 text-xs" />
            <input value={nationalId} onChange={(e) => setNationalId(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your identification number" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1 block">Email Address</label>
          <div className="flex items-center gap-3 w-full h-10 sm:h-11 px-3 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faEnvelope} className="text-ink-300 shrink-0 text-xs" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="name@example.com" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1 block">District</label>
          <div className="flex items-center gap-3 w-full h-10 sm:h-11 px-3 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faLocationDot} className="text-ink-300 shrink-0 text-xs" />
            <select value={district} onChange={(e) => setDistrict(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 h-full min-w-0 appearance-none cursor-pointer">
              <option value="" className="text-ink-400">Select your district</option>
              {['Bugesera','Burera','Gakenke','Gasabo','Gatsibo','Gicumbi','Gisagara','Huye','Kamonyi','Karongi','Kayonza','Kicukiro','Kirehe','Muhanga','Musanze','Ngoma','Ngororero','Nyabihu','Nyagatare','Nyamagabe','Nyamasheke','Nyanza','Nyarugenge','Nyaruguru','Rubavu','Ruhango','Rulindo','Rusizi','Rutsiro','Rwamagana'].sort().map((d) => (
                <option key={d} value={d} className="text-ink-800">{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1 block">Password</label>
          <div className="flex items-center gap-3 w-full h-10 sm:h-11 px-3 rounded-lg text-sm bg-white border border-ink-200 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-200/30 transition-all shadow-sm">
            <FontAwesomeIcon icon={faLock} className="text-ink-300 shrink-0 text-xs" />
            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Create a strong password" required minLength={8} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="text-ink-400 hover:text-ink-600 transition-colors cursor-pointer p-1 shrink-0">
              {showPw ? <FontAwesomeIcon icon={faEyeSlash} className="text-xs" /> : <FontAwesomeIcon icon={faEye} className="text-xs" />}
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full !bg-gold-400 hover:!bg-gold-500 !shadow-md !shadow-gold-200/30">
          Create Account
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
        Sign up with Google
      </button>

      <div className="mt-4 pt-3 border-t border-ink-100 text-center">
        <p className="text-xs text-ink-400">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchMode} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer">Sign in</button>
        </p>
      </div>
    </div>
  );
}
