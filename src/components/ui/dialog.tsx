import * as React from 'react'
import { cn } from '../../lib/utils'

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("space-y-4", className)}>{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
);

const DialogTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) => children;

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger }