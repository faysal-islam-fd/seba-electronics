'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import ConfirmDialogContainer, { ConfirmDialog, ConfirmType } from '@/app/components/ConfirmDialog';

interface ConfirmContextType {
  confirm: (
    message: string,
    onConfirm: () => void,
    options?: {
      type?: ConfirmType;
      title?: string;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }
  ) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<ConfirmDialog[]>([]);

  const removeDialog = useCallback((id: string) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  }, []);

  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    options?: {
      type?: ConfirmType;
      title?: string;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setDialogs((prev) => [
      ...prev,
      {
        id,
        message,
        type: options?.type || 'warning',
        title: options?.title,
        onConfirm,
        onCancel: options?.onCancel,
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
      },
    ]);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialogContainer dialogs={dialogs} onClose={removeDialog} />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}


