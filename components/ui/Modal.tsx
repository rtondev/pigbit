"use client";

import { useEffect } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ show, onClose, children }: ModalProps) {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (show) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md max-h-screen overflow-y-auto rounded-lg border border-gray-200 bg-white">
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-b border-gray-200 px-6 py-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
    </div>
  );
}

export function ModalBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex justify-end gap-2 border-t border-gray-200 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}
