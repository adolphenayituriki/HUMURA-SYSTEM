import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPath = location.pathname === '/login';
  const [mode, setMode] = useState<'login' | 'register'>(isLoginPath ? 'login' : 'register');

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    navigate(newMode === 'login' ? '/login' : '/register', { replace: true });
  };

  return (
    <div>
      <div className="flex rounded-xl bg-ink-50/50 border border-ink-200/40 p-1 mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={`flex-1 h-9 rounded-lg text-sm font-bold transition-all cursor-pointer ${mode === 'login' ? 'bg-gold-400 text-white shadow-sm' : 'text-ink-400 hover:text-ink-600'}`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={`flex-1 h-9 rounded-lg text-sm font-bold transition-all cursor-pointer ${mode === 'register' ? 'bg-gold-400 text-white shadow-sm' : 'text-ink-400 hover:text-ink-600'}`}
        >
          Create Account
        </button>
      </div>

      {mode === 'login' ? (
        <Login onSwitchMode={() => switchMode('register')} />
      ) : (
        <Register onSwitchMode={() => switchMode('login')} />
      )}
    </div>
  );
}
