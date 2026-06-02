import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { closeModal } from '../store/slices/uiSlice';

export default function Modal({ isOpen, title, children, onConfirm, confirmText = 'Save', loading = false }) {
  const dispatch = useDispatch();
  const handleClose = () => dispatch(closeModal());

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm">{title}</h3>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">{children}</div>
            {onConfirm && (
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-outline-variant/30">
                <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors">Cancel</button>
                <button onClick={onConfirm} disabled={loading}
                  className="px-6 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
                  {loading && <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />}
                  {confirmText}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
