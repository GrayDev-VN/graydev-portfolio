"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function AccessibleDialog({ open, onClose, labelledBy, children }: {
  open: boolean; onClose: () => void; labelledBy: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [open]);
  return <dialog ref={ref} aria-labelledby={labelledBy} onCancel={onClose}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black/85 p-4 text-white backdrop:bg-black/60 open:flex items-center justify-center sm:p-6">
    {children}
  </dialog>;
}
