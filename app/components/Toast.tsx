'use client';

import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiX, FiInfo } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <FiXCircle size={20} className="text-red-500" />;
      case 'info':
        return <FiInfo size={20} className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`${getBgColor()} border-2 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px] max-w-md animate-slide-in`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <p className="flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <FiX size={18} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10003] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}


