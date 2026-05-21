import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', destructive = true }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-500 text-xl mb-4" />
        <p className="text-sm text-ink-600 leading-relaxed mb-6">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl text-sm font-medium text-ink-600 bg-ink-50 hover:bg-ink-100 transition-all">
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all ${
              destructive
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-brand-500 hover:bg-brand-600'
            }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
