'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastProps = {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
};

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-4 right-4 z-[9999] max-w-md shadow-2xl rounded-xl overflow-hidden ${type === 'success'
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-red-50 border-2 border-red-500'
                }`}
        >
            <div className="p-4 flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                    {type === 'success' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                    )}
                </div>

                {/* Message */}
                <div className="flex-1 pt-0.5">
                    <p className={`font-semibold text-sm ${type === 'success' ? 'text-green-900' : 'text-red-900'
                        }`}>
                        {type === 'success' ? 'Sukces!' : 'Błąd!'}
                    </p>
                    <p className={`text-sm mt-1 ${type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {message}
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`flex-shrink-0 p-1 rounded-lg transition-colors ${type === 'success'
                            ? 'hover:bg-green-100 text-green-600'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Progress Bar */}
            <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`h-1 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
            />
        </motion.div>
    );
}

// Container component for managing multiple toasts
export function ToastContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed top-0 right-0 p-4 z-[9999] pointer-events-none">
            <AnimatePresence mode="sync">
                {children}
            </AnimatePresence>
        </div>
    );
}
