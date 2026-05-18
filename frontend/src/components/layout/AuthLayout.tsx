import { Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'linear-gradient(to right, #d9f0f8, #eef8ff)' }}
    >
      {/* Wave pattern overlay - hidden on very small screens */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 sm:opacity-30 hidden sm:block" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M0,500 C360,400 720,600 1440,450 L1440,900 L0,900 Z" fill="none" stroke="#88c8e8" strokeWidth="2" />
        <path d="M0,600 C360,500 720,700 1440,550 L1440,900 L0,900 Z" fill="none" stroke="#a0d4ec" strokeWidth="1.5" />
        <path d="M0,700 C360,600 720,800 1440,650 L1440,900 L0,900 Z" fill="none" stroke="#b8e0f0" strokeWidth="1" />
      </svg>

      {/* ════ LEFT PANEL ════ */}
      <div className="hidden lg:flex lg:w-[43%] xl:w-[45%] flex-col justify-between p-8 xl:p-14 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="HUMURA" className="h-8 xl:h-9 w-auto" />
            <div>
              <p className="text-base xl:text-lg font-bold text-ink-900 tracking-tight">HUMURA</p>
              <p className="text-[10px] xl:text-[11px] font-semibold text-brand-500 uppercase tracking-[.12em] leading-none mt-0.5">
                Your Mind Matters
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="text-[32px] xl:text-[42px] font-bold text-ink-900 leading-[1.2] tracking-[-.02em] mb-3 xl:mb-4">
            You are not alone.<br />
            <span className="text-brand-600">We are here for you.</span>
          </h1>
          <p className="text-base xl:text-xl text-ink-500 leading-relaxed max-w-md">
            Humura is a safe and confidential space for your mental wellness and personal growth.
          </p>
        </div>

        <div className="mt-6">
          <LanguageSwitcher />
        </div>
      </div>

      {/* ════ RIGHT PANEL ════ */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-6 md:px-8 py-6 sm:py-8 relative z-10">
        {/* Background image */}
        <img src="/bg svg.avif" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />

        <LanguageSwitcher className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:hidden" />

        <div className="relative z-10 w-full max-w-[440px] rounded-xl bg-white shadow-[0_2px_40px_-8px_rgba(0,0,0,0.08)] p-5 sm:p-8 md:p-10 border border-ink-100/60">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-6 sm:mb-8 lg:hidden">
            <img src="/logo.png" alt="HUMURA" className="h-6 sm:h-7 w-auto" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink-900">HUMURA</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-brand-500 uppercase tracking-[.1em] leading-none mt-0.5">
                Your Mind Matters
              </p>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
