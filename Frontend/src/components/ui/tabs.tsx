import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  active: string;
  setActive: (val: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs context missing");
  return ctx;
}

type TabsProps = PropsWithChildren<{ defaultValue: string; className?: string }>;

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80",
        className,
      )}
      role="tablist"
      {...props}
    />
  );
}

type TabsTriggerProps = PropsWithChildren<{
  value: string;
  className?: string;
}>;

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { active, setActive } = useTabs();
  const isActive = active === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all",
        isActive
          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
        className,
      )}
    >
      {children}
    </button>
  );
}

type TabsContentProps = PropsWithChildren<{
  value: string;
  className?: string;
}>;

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { active } = useTabs();
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={cn("mt-4", className)}>
      {children}
    </div>
  );
}
