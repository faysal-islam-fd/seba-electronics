'use client';

import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

export type ConfirmType = 'warning' | 'danger' | 'info';

export interface ConfirmDialog {
  id: string;
  message: string;
  type: ConfirmType;
  title?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmDialogProps {
  dialog: ConfirmDialog;
  onClose: (id: string) => void;
}

function ConfirmDialogItem({ dialog, onClose }: ConfirmDialogProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(dialog.id);
    }, 300);
  };

  const handleConfirm = () => {
    dialog.onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    handleClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const getIcon = () => {
    switch (dialog.type) {
      case 'danger':
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
    switch (dialog.type) {
      case 'danger':
        return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
      case 'warning':
        return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200';
      case 'info':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (dialog.type) {
      case 'danger':
        return 'text-red-700';
      case 'warning':
        return 'text-amber-700';
      case 'info':
        return 'text-blue-700';
    }
  };

  const getConfirmButtonColor = () => {
    switch (dialog.type) {
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700';
      case 'info':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10005] p-4 transition-opacity duration-300 ${
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
          
          {dialog.title && (
            <h3 className={`text-xl sm:text-2xl font-bold ${getTextColor()} mb-3`}>
              {dialog.title}
            </h3>
          )}
          
          <p className={`text-sm sm:text-base ${getTextColor()} mb-6 leading-relaxed`}>
            {dialog.message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleCancel}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {dialog.cancelText || 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 ${getConfirmButtonColor()} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {dialog.confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDialogContainerProps {
  dialogs: ConfirmDialog[];
  onClose: (id: string) => void;
}

export default function ConfirmDialogContainer({ dialogs, onClose }: ConfirmDialogContainerProps) {
  if (dialogs.length === 0) return null;

  // Show only the most recent dialog
  const currentDialog = dialogs[dialogs.length - 1];

  return <ConfirmDialogItem dialog={currentDialog} onClose={onClose} />;
}

