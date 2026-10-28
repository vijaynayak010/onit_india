import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="text-emerald-500" size={18} />,
        error: <AlertCircle className="text-red-500" size={18} />,
        info: <Info className="text-emerald-500" size={18} />,
    };

    const styles = {
        success: 'border-emerald-100 bg-emerald-50 text-emerald-800',
        error: 'border-red-100 bg-red-50 text-red-800',
        info: 'border-emerald-100 bg-emerald-50 text-emerald-800',
    };

    return (
        <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-right-full duration-300 ${styles[type]}`}>
            {icons[type]}
            <p className="text-sm font-bold">{message}</p>
            <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
