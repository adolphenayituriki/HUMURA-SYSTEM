import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleCheck, faUser, faEnvelope, faIdCard, faLocationDot, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/shared/Button';
import { useToastStore } from '../../store/toastStore';
import { service } from '../../services/mockData';

export default function Register() {
  const { addToast } = useToastStore();
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

  if (success) {
    return (
      <div className="text-center py-10 sm:py-12">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-forest-50 border-2 border-forest-200/60 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-sm">
          <FontAwesomeIcon icon={faCircleCheck} className="text-[28px] text-forest-600 sm:text-[32px]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink-900 mb-3">Account Created</h2>
        <p className="text-sm sm:text-base text-ink-400 leading-relaxed max-w-xs mx-auto mb-8 sm:mb-10">Your account is pending approval. You will be notified once activated.</p>
        <Link to="/login"
          className="inline-flex items-center justify-center h-11 sm:h-12 px-8 sm:px-10 rounded-xl text-sm sm:text-base font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 transition-all shadow-[0_2px_10px_rgba(31,111,126,.2)] hover:shadow-[0_4px_16px_rgba(31,111,126,.25)] active:scale-[.97]">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-7">
        <h2 className="text-xl sm:text-[26px] font-bold text-ink-900 tracking-[-.02em] leading-tight">Create an Account</h2>
        <p className="text-xs sm:text-sm text-ink-400 mt-1.5">Join the HUMURA platform</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 sm:px-3.5 py-2.5 mb-4 sm:mb-5 leading-relaxed">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-[14px] shrink-0 text-red-400" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Full Name</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-ink-50/40 border border-ink-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200/25 transition-all">
            <FontAwesomeIcon icon={faUser} className="text-ink-400 shrink-0 text-sm" />
            <input value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your full name" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">National ID / Passport Number</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-ink-50/40 border border-ink-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200/25 transition-all">
            <FontAwesomeIcon icon={faIdCard} className="text-ink-400 shrink-0 text-sm" />
            <input value={nationalId} onChange={(e) => setNationalId(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Enter your identification number" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Email Address</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-ink-50/40 border border-ink-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200/25 transition-all">
            <FontAwesomeIcon icon={faEnvelope} className="text-ink-400 shrink-0 text-sm" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="name@example.com" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">District</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-ink-50/40 border border-ink-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200/25 transition-all">
            <FontAwesomeIcon icon={faLocationDot} className="text-ink-400 shrink-0 text-sm" />
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
          <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Password</label>
          <div className="flex items-center gap-3 w-full h-12 sm:h-14 px-4 rounded-lg text-sm bg-ink-50/40 border border-ink-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200/25 transition-all">
            <FontAwesomeIcon icon={faLock} className="text-ink-400 shrink-0 text-sm" />
            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400 h-full min-w-0"
              placeholder="Create a strong password" required minLength={8} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="text-ink-400 hover:text-ink-600 transition-colors cursor-pointer p-1 shrink-0">
              {showPw ? <FontAwesomeIcon icon={faEyeSlash} className="text-sm" /> : <FontAwesomeIcon icon={faEye} className="text-sm" />}
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full mt-1">
          Create Account
        </Button>
      </form>

      <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-ink-100 text-center">
        <p className="text-xs text-ink-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
