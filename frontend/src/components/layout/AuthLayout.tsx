import { Outlet, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHandshake, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/bg svg.avif" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-white/50 to-ink-50/30" />
      </div>

      <div className="hidden lg:flex lg:w-[43%] xl:w-[45%] flex-col justify-between p-8 xl:p-14 relative z-10">
        <div>
          <a href="/" className="flex items-center gap-3 group">
            <FontAwesomeIcon icon={faArrowLeft} className="text-[14px] text-ink-400 group-hover:text-brand-600 transition-colors" />
            <img src="/logo.png" alt="HUMURA" className="h-8 xl:h-9 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div>
              <p className="text-base xl:text-lg font-bold text-ink-900 tracking-tight">HUMURA</p>
              <p className="text-[10px] xl:text-[11px] font-semibold text-brand-600 uppercase tracking-[.12em] leading-none mt-0.5">
                Your Mind Matters
              </p>
            </div>
          </a>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center mb-6">
            <FontAwesomeIcon icon={isLogin ? faArrowRightFromBracket : faHandshake} className="text-[28px] text-brand-600" />
          </div>
          {isLogin ? (
            <>
              <h1 className="text-[32px] xl:text-[42px] font-bold text-ink-900 leading-[1.2] tracking-[-.02em] mb-3 xl:mb-4">
                Welcome back.<br />
                <span className="text-brand-600">Your safe space awaits.</span>
              </h1>
              <p className="text-base xl:text-xl text-ink-500 leading-relaxed max-w-md">
                Sign in securely to access your dashboard, connect with your community, and continue your journey.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[32px] xl:text-[42px] font-bold text-ink-900 leading-[1.2] tracking-[-.02em] mb-3 xl:mb-4">
                You are not alone.<br />
                <span className="text-brand-600">We are here for you.</span>
              </h1>
              <p className="text-base xl:text-xl text-ink-500 leading-relaxed max-w-md">
                Humura is a safe and confidential space for your mental wellness and personal growth.
              </p>
            </>
          )}
        </div>

        <div>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-3 sm:px-6 md:px-8 py-6 sm:py-8 relative z-10">
        <LanguageSwitcher className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:hidden" />

        <div className="relative z-10 w-full max-w-[440px] rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] p-5 sm:p-8 md:p-10 border border-ink-100/60">
          <a href="/" className="flex items-center gap-2.5 mb-6 sm:mb-8 lg:hidden group">
            <FontAwesomeIcon icon={faArrowLeft} className="text-[13px] text-ink-400 group-hover:text-brand-600 transition-colors" />
            <img src="/logo.png" alt="HUMURA" className="h-6 sm:h-7 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink-900">HUMURA</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-brand-600 uppercase tracking-[.1em] leading-none mt-0.5">
                Your Mind Matters
              </p>
            </div>
          </a>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
