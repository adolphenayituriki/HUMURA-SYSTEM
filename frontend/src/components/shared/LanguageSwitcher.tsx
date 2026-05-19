import { useState, useRef, useEffect } from 'react';
import { useI18nStore, type Lang, LANG_LABELS } from '../../i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

const LANGS: Lang[] = ['en', 'fr', 'rw'];

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

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.04em] px-2.5 py-1.5 rounded-lg transition-all ${
          dark
            ? 'text-white/80 hover:text-white hover:bg-white/10 border border-white/10'
            : 'text-ink-500 hover:text-ink-700 hover:bg-ink-100/60 border border-transparent'
        }`}
      >
        <FontAwesomeIcon icon={faGlobe} className="text-[13px]" />
        {LANG_LABELS[lang]}
        <FontAwesomeIcon icon={faChevronDown} className={`text-[11px] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 right-0 min-w-[150px] rounded-xl border shadow-lg overflow-hidden z-50 ${
            dark ? 'bg-[#1e3b45] border-white/10' : 'bg-white border-ink-200/70'
          }`}
        >
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-all ${
                lang === l
                  ? dark
                    ? 'text-white bg-white/10'
                    : 'text-blue-600 bg-blue-50'
                  : dark
                    ? 'text-white/60 hover:text-white hover:bg-white/5'
                    : 'text-ink-500 hover:text-ink-700 hover:bg-ink-100/40'
              }`}
            >
              <span className="flex-1 text-left">{LANG_LABELS[l]}</span>
              {lang === l && <FontAwesomeIcon icon={faCheck} className="text-[13px] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
