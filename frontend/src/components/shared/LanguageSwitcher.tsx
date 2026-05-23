import { useState, useRef, useEffect } from 'react';
import { useI18nStore, type Lang, LANG_LABELS } from '../../i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

const LANGS: Lang[] = ['en', 'fr', 'rw'];

const FLAGS: Record<Lang, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  rw: '🇷🇼',
};

export function LanguageSwitcher({ className, dark }: { className?: string; dark?: boolean }) {
  const { lang, setLang } = useI18nStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeLabel = LANG_LABELS[lang];

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold transition-all ${
          dark
            ? 'text-white/80 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
            : 'text-ink-500 hover:text-ink-700 hover:bg-ink-50 border border-ink-200/60 hover:border-ink-300 shadow-sm'
        }`}
      >
        <span className="text-sm leading-none">{FLAGS[lang]}</span>
        <span className="hidden lg:inline uppercase tracking-[.06em]" style={{ padding: '5px' }}>{activeLabel}</span>
        <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 right-0 min-w-[150px] rounded-xl border shadow-xl overflow-hidden z-50 ${
            dark ? 'bg-[#1a2f36] border-white/10' : 'bg-white border-ink-200/70 shadow-[0_8px_30px_rgba(0,0,0,.1)]'
          }`}
        >
          <div className="py-1.5">
            {LANGS.map((l) => {
              const isActive = lang === l;
              return (
                <button
                  key={l}
                  onClick={() => { setLang(l); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? dark
                        ? 'text-white bg-white/8'
                        : 'text-brand-700 bg-brand-50'
                      : dark
                        ? 'text-white/50 hover:text-white hover:bg-white/5'
                        : 'text-ink-500 hover:text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  <span className="text-base leading-none">{FLAGS[l]}</span>
                  <span className="flex-1 text-left">{LANG_LABELS[l]}</span>
                  {isActive && <FontAwesomeIcon icon={faCheck} className="text-[12px] shrink-0 text-brand-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
