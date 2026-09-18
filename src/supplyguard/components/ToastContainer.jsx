import React, { useState, useEffect } from 'react';
import SwipeToast from './SwipeToast';
import { ShieldAlert, AlertTriangle, CheckCircle2, Zap, Mail, Info } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      if (!e.detail) return;
      const newToast = e.detail;

      // Select matching icon if not explicitly provided
      let toastIcon = newToast.icon;
      if (!toastIcon) {
        if (newToast.type === 'critical' || newToast.type === 'error') {
          toastIcon = <ShieldAlert className="h-4 w-4 text-rose-400 stroke-[2.5]" />;
        } else if (newToast.type === 'warning') {
          toastIcon = <AlertTriangle className="h-4 w-4 text-amber-400 stroke-[2.5]" />;
        } else if (newToast.type === 'success') {
          toastIcon = <CheckCircle2 className="h-4 w-4 text-emerald-400 stroke-[2.5]" />;
        } else if (newToast.type === 'simulation') {
          toastIcon = <Zap className="h-4 w-4 text-[#FFFDD0] stroke-[2.5]" />;
        } else if (newToast.type === 'communication') {
          toastIcon = <Mail className="h-4 w-4 text-[#FFFDD0] stroke-[2.5]" />;
        } else {
          toastIcon = <Info className="h-4 w-4 text-[#FFFDD0] stroke-[2.5]" />;
        }
      }

      setToasts((prev) => [
        ...prev.slice(-3), // keep maximum 4 active toasts on screen
        {
          ...newToast,
          icon: toastIcon
        }
      ]);
    };

    window.addEventListener('supplyguard-toast', handleToastEvent);
    return () => window.removeEventListener('supplyguard-toast', handleToastEvent);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6 z-[99999999] flex flex-col items-end gap-2.5 max-w-[calc(100vw-32px)] select-none pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <SwipeToast
            inline={true}
            open={true}
            title={toast.title}
            description={toast.description}
            icon={toast.icon}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            background={toast.background || '#222B14'}
            color={toast.color || '#FFFDD0'}
            fuseColor={toast.fuseColor || '#FFFDD0'}
            width={360}
            radius={16}
            slideMs={400}
            duration={toast.duration || 4500}
            pauseOnHover={true}
            closeButton={true}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
