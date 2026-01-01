'use client';

import { useEffect, useState } from 'react';
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
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose(toast.id);
      }, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <FiCheckCircle size={20} className="text-white" />
          </div>
        );
      case 'error':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
            <FiXCircle size={20} className="text-white" />
          </div>
        );
      case 'info':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <FiInfo size={20} className="text-white" />
          </div>
        );
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
      case 'error':
        return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
      case 'info':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'info':
        return 'text-blue-700';
    }
  };

  return (
    <div
      className={`${getBgColor()} border-2 rounded-xl shadow-2xl p-4 flex items-center gap-4 min-w-[320px] max-w-md transition-all duration-300 ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
        }`}
      style={{
        animation: isExiting ? 'none' : 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className={`flex-1 text-sm font-semibold ${getTextColor()}`}>{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white/50"
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
    <div className="fixed top-4 right-4 z-[100000] flex flex-col gap-3 pointer-events-none max-w-md">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}


