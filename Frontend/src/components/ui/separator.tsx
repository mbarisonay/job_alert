import { cn } from "@/lib/utils";

type SeparatorProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function Separator({
  className,
  orientation = "horizontal",
}: SeparatorProps) {
  return (
    <div
      className={cn(
        "shrink-0 bg-slate-200 dark:bg-slate-800",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
