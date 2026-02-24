import { Sparkles } from "lucide-react";

export function RecommendedPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-400" />
        <h1 className="text-xl font-semibold">Önerilen İlanlar</h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        AI profiline göre eşleştirilmiş iş ilanları burada listelenecek.
      </p>
    </div>
  );
}
