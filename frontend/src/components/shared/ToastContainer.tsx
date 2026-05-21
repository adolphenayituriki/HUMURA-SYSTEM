import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useToastStore, type ToastType } from '../../store/toastStore';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <FontAwesomeIcon icon={faCircleCheck} className="text-[16px] text-forest-500" />,
  error: <FontAwesomeIcon icon={faCircleXmark} className="text-[16px] text-rose-500" />,
  info: <FontAwesomeIcon icon={faCircleInfo} className="text-[16px] text-brand-500" />,
};

const BG: Record<ToastType, string> = {
  success: 'border-forest-200/60 bg-forest-50/90',
  error: 'border-rose-200/60 bg-rose-50/90',
  info: 'border-brand-200/60 bg-brand-50/90',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-[0_4px_16px_rgba(0,0,0,.06)] backdrop-blur-sm min-w-[280px] max-w-[420px] ${BG[t.type]}`}
          >
            {ICONS[t.type]}
            <p className="flex-1 text-xs font-medium text-ink-700 leading-snug">{t.message}</p>
            <button onClick={() => removeToast(t.id)}
              className="w-5 h-5 rounded flex items-center justify-center text-ink-300 hover:text-ink-600 hover:bg-ink-100/50 transition-all shrink-0">
              <FontAwesomeIcon icon={faXmark} className="text-[12px]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
