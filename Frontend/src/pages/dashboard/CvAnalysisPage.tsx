import { FileText } from "lucide-react";

export function CvAnalysisPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-cyan-400" />
        <h1 className="text-xl font-semibold">CV Analizi</h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        CV'ni yükle, AI ile güçlü ve zayıf yönlerini analiz edelim.
      </p>
    </div>
  );
}
