import { ClipboardList } from "lucide-react";

export function TrackingPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-violet-400" />
        <h1 className="text-xl font-semibold">Başvuru Takibim</h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Başvurularını Kanban tarzı bir panoda takip edebileceksin.
      </p>
    </div>
  );
}
