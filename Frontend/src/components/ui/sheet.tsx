import { useEffect, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type SheetProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

export function Sheet({ open, onClose, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-xl",
          "animate-[slideIn_200ms_ease-out]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
