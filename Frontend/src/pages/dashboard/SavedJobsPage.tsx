import { Bookmark } from "lucide-react";

export function SavedJobsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bookmark className="h-5 w-5 text-amber-400" />
        <h1 className="text-xl font-semibold">Kaydedilen İlanlar</h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Kaydettiğin iş ilanları burada listelenecek.
      </p>
    </div>
  );
}
