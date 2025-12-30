'use client';

import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  id: string;
  message: string;
  type: AlertType;
  title?: string;
}

interface AlertProps {
  alert: Alert;
  onClose: (id: string) => void;
}

function AlertItem({ alert, onClose }: AlertProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(alert.id);
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return (
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <FiCheckCircle size={32} className="text-white" />
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
            <FiXCircle size={32} className="text-white" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
            <FiAlertCircle size={32} className="text-white" />
          </div>
        );
      case 'info':
        return (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <FiInfo size={32} className="text-white" />
          </div>
        );
    }
  };

  const getBgColor = () => {
    switch (alert.type) {
      case 'success':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
      case 'error':
        return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
      case 'warning':
        return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200';
      case 'info':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (alert.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-amber-700';
      case 'info':
        return 'text-blue-700';
    }
  };

  const getButtonColor = () => {
    switch (alert.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700';
      case 'info':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10004] p-4 transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${getBgColor()} border-2 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all duration-300 ${
          isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{getIcon()}</div>
          
          {alert.title && (
            <h3 className={`text-2xl font-bold ${getTextColor()} mb-3`}>
              {alert.title}
            </h3>
          )}
          
          <p className={`text-base ${getTextColor()} mb-6 leading-relaxed`}>
            {alert.message}
          </p>
          
          <button
            onClick={handleClose}
            className={`${getButtonColor()} text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

interface AlertContainerProps {
  alerts: Alert[];
  onClose: (id: string) => void;
}

export default function AlertContainer({ alerts, onClose }: AlertContainerProps) {
  if (alerts.length === 0) return null;

  // Show only the most recent alert
  const currentAlert = alerts[alerts.length - 1];

  return <AlertItem alert={currentAlert} onClose={onClose} />;
}

