import { Outlet } from 'react-router-dom';
import { ToastContainer } from '../shared/ToastContainer';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center p-12"
        style={{ background: '#0B2653' }}>
        <div className="max-w-md text-center">
          <div className="relative w-[120px] h-[120px] mx-auto mb-6">
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,250,230,0.3), transparent 70%)' }} />
            <div className="absolute inset-1 rounded-full overflow-hidden"
              style={{ background: 'radial-gradient(circle at 35% 35%, #fffbe8, #f0e4c8 50%, #ddd0b0 75%, #c8b890)' }}>
              <div className="absolute inset-0 opacity-10"
                style={{ background: 'radial-gradient(circle at 70% 25%, transparent 20%, #a09070 25%, transparent 30%), radial-gradient(circle at 25% 65%, transparent 10%, #a09070 14%, transparent 18%), radial-gradient(circle at 55% 75%, transparent 15%, #a09070 19%, transparent 23%)' }} />
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle at 70% 30%, transparent 35%, rgba(80,70,50,0.08) 42%, transparent 48%)' }} />
            </div>
            <div className="absolute inset-[6px] rounded-full overflow-hidden bg-white/90 p-[3px] z-10">
              <img src="/Rwanda Flag.png" alt="Rwanda" className="w-full h-full object-contain" />
            </div>
          </div>
          <img src="/logo.png" alt="HUMURA" className="h-14 w-auto mx-auto mb-6" />
          <h1 className="text-[32px] xl:text-[40px] font-bold text-white leading-[1.15] tracking-[-.02em] mb-4">
            Your Mind Matters
          </h1>
          <p className="text-base xl:text-lg text-white/60 leading-relaxed max-w-sm mx-auto">
            A safe and confidential space for your mental wellness and personal growth.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-[420px] rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] p-6 sm:p-8 border border-ink-100/60">
          <a href="/" className="flex items-center gap-2.5 mb-5 lg:hidden group">
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
      <ToastContainer />
    </div>
  );
}
