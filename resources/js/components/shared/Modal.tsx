import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className={cn('max-h-[90vh] flex flex-col gap-0 p-0', sizes[size])}>
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
