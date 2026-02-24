import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

let _listeners: Array<(t: Toast) => void> = [];
let _id = 0;

export function toast(message: string, variant: ToastVariant = "success") {
  const t: Toast = { id: ++_id, message, variant };
  _listeners.forEach((fn) => fn(t));
}

toast.success = (msg: string) => toast(msg, "success");
toast.error = (msg: string) => toast(msg, "error");
toast.info = (msg: string) => toast(msg, "info");

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  error: <XCircle className="h-4 w-4 text-rose-500" />,
  info: <Info className="h-4 w-4 text-sky-500" />,
};

const borderColors: Record<ToastVariant, string> = {
  success: "border-emerald-500/30",
  error: "border-rose-500/30",
  info: "border-sky-500/30",
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
  }, []);

  useEffect(() => {
    _listeners.push(addToast);
    return () => {
      _listeners = _listeners.filter((fn) => fn !== addToast);
    };
  }, [addToast]);

  function remove(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => remove(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg",
        "dark:bg-slate-900 dark:border-slate-800",
        "animate-toast-in",
        borderColors[t.variant],
      )}
    >
      {icons[t.variant]}
      <p className="text-sm text-slate-700 dark:text-slate-200">{t.message}</p>
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
