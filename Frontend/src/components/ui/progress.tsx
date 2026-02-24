import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
