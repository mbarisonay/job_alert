import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toaster";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Trash2,
  UploadCloud,
  XCircle,
  Zap,
} from "lucide-react";

// ─── Types ───

type AnalysisResult = {
  overallScore: number;
  sections: SectionScore[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

type SectionScore = {
  name: string;
  score: number;
  status: "good" | "warning" | "bad";
  feedback: string;
};

type RewriteSection = {
  section: string;
  original: string;
  suggested: string;
  explanation: string;
};

type RewriteResult = {
  sections: RewriteSection[];
  summary: string;
};

type CvItem = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  analyzedAt: string | null;
  rewrittenAt: string | null;
  analysisResult: AnalysisResult | null;
  rewriteResult: RewriteResult | null;
};

// ─── Helpers ───

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const { token } = JSON.parse(raw) as { token: string };
    return token ?? null;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-rose-500";
}

function scoreRingColor(score: number) {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-rose-500";
}

function statusIcon(status: "good" | "warning" | "bad") {
  if (status === "good")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "warning")
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  return <XCircle className="h-4 w-4 text-rose-500" />;
}

function progressColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-rose-500";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ───

export function CvAnalysisPage() {
  const [cvList, setCvList] = useState<CvItem[]>([]);
  const [selectedCv, setSelectedCv] = useState<CvItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzingCvId, setAnalyzingCvId] = useState<string | null>(null);
  const [rewritingCvId, setRewritingCvId] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(
    null,
  );
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedCvRef = useRef<string | null>(null);

  // Derived: is the CURRENTLY SELECTED cv being analyzed/rewritten?
  const analyzing = analyzingCvId !== null && analyzingCvId === selectedCv?.id;
  const rewriting = rewritingCvId !== null && rewritingCvId === selectedCv?.id;

  // Fetch CV list on mount
  useEffect(() => {
    fetchCvList();
  }, []);

  async function fetchCvList() {
    try {
      const res = await fetch(`${API_BASE}/api/cv/list`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setCvList(data.data ?? []);
    } catch {
      // silent
    }
  }

  // ─── Upload ───
  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Sadece PDF dosyaları kabul edilmektedir.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu 10MB'dan küçük olmalıdır.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", f);

      const res = await fetch(`${API_BASE}/api/cv/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Yükleme başarısız.");

      toast.success(`"${f.name}" başarıyla yüklendi.`);
      await fetchCvList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Yükleme hatası.";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, []);

  // ─── Select ───
  function handleSelectCv(cv: CvItem) {
    selectedCvRef.current = cv.id;
    setSelectedCv(cv);
    setResult(cv.analysisResult ?? null);
    setRewriteResult(cv.rewriteResult ?? null);
  }

  // ─── Delete ───
  async function handleDelete(cvId: string) {
    try {
      const res = await fetch(`${API_BASE}/api/cv/${cvId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Silme hatası.");
      }
      toast.success("CV silindi.");
      if (selectedCv?.id === cvId) {
        setSelectedCv(null);
        setResult(null);
        setRewriteResult(null);
      }
      await fetchCvList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Silme hatası.";
      toast.error(msg);
    }
  }

  // ─── Analyze ───
  async function handleAnalyze() {
    if (!selectedCv) return;
    const cvId = selectedCv.id;
    setAnalyzingCvId(cvId);
    try {
      const res = await fetch(
        `${API_BASE}/api/cv/${cvId}/analyze`,
        { method: "POST", headers: authHeaders() },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Analiz hatası.");

      // Only update displayed result if this CV is still selected
      if (selectedCvRef.current === cvId) {
        setResult(data.data as AnalysisResult);
      }
      toast.success("CV analizi tamamlandı!");
      await fetchCvList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
      toast.error(msg);
    } finally {
      setAnalyzingCvId((prev) => (prev === cvId ? null : prev));
    }
  }

  // ─── Rewrite ───
  async function handleRewrite() {
    if (!selectedCv) return;
    const cvId = selectedCv.id;
    setRewritingCvId(cvId);
    try {
      const res = await fetch(
        `${API_BASE}/api/cv/${cvId}/rewrite`,
        { method: "POST", headers: authHeaders() },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Yeniden yazma hatası.");

      if (selectedCvRef.current === cvId) {
        setRewriteResult(data.data as RewriteResult);
      }
      toast.success("CV yeniden yazma önerileri hazır!");
      await fetchCvList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
      toast.error(msg);
    } finally {
      setRewritingCvId((prev) => (prev === cvId ? null : prev));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          <h1 className="text-xl font-semibold">CV Analizi</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          CV'nizi yükleyin, AI ile güçlü ve zayıf yönlerini analiz edelim,
          puanlayalım ve iyileştirme önerileri sunalım.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── LEFT: Upload, CV List & Results ── */}
        <div className="space-y-6">
          {/* Upload zone */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="pt-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                className={`flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragOver
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5"
                    : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  {uploading ? (
                    <Spinner size="sm" />
                  ) : (
                    <UploadCloud className="h-7 w-7 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {uploading
                      ? "Yükleniyor..."
                      : "CV dosyanızı sürükleyin veya seçin"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PDF formatı • Maksimum 10MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  Dosya Seç
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── CV List ── */}
          {cvList.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  Yüklenen CV'leriniz
                  <Badge variant="default" className="ml-auto text-[10px]">
                    {cvList.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cvList.map((cv) => (
                  <div
                    key={cv.id}
                    onClick={() => handleSelectCv(cv)}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedCv?.id === cv.id
                        ? "border-cyan-500/50 bg-cyan-50/50 dark:bg-cyan-500/5"
                        : "border-slate-100 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                        {analyzingCvId === cv.id || rewritingCvId === cv.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <FileText className="h-4 w-4 text-cyan-500" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                          {cv.fileName}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>
                            {(cv.fileSize / 1024).toFixed(0)} KB
                          </span>
                          <span>•</span>
                          <Clock className="h-2.5 w-2.5" />
                          <span>{formatDate(cv.uploadedAt)}</span>
                          {cv.analyzedAt && (
                            <>
                              <span>•</span>
                              <Badge
                                variant="success"
                                className="px-1 py-0 text-[9px]"
                              >
                                Analiz Edildi
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 shrink-0 p-0 text-slate-400 hover:text-rose-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cv.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Selected CV Actions ── */}
          {selectedCv && !analyzing && !rewriting && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                      <FileText className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {selectedCv.fileName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(selectedCv.fileSize / 1024).toFixed(0)} KB • PDF
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    {result ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Tekrar Analiz Et
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        AI ile Analiz Et
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyzing animation */}
          {analyzing && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
                    <Sparkles className="h-7 w-7 text-cyan-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    CV'niz analiz ediliyor...
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    İçerik, yapı, ATS uyumluluğu ve sektör eşleşmesi
                    değerlendiriliyor
                  </p>
                </div>
                <div className="w-48">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full animate-analyzing rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Analysis Results ── */}
          {result && !analyzing && (
            <div className="space-y-4">
              {/* Section scores */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base">Bölüm Puanları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.sections.map((sec) => (
                    <div key={sec.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {statusIcon(sec.status)}
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {sec.name}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${scoreColor(sec.score)}`}
                        >
                          {sec.score}/100
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${progressColor(sec.score)}`}
                          style={{ width: `${sec.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {sec.feedback}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-emerald-200/60 dark:border-emerald-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Güçlü Yönler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-rose-200/60 dark:border-rose-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
                      <XCircle className="h-4 w-4" />
                      Zayıf Yönler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.weaknesses.map((w, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* AI Suggestions */}
              <Card className="border-cyan-200/60 dark:border-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400">
                    <Lightbulb className="h-4 w-4" />
                    AI İyileştirme Önerileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.suggestions.map((sug, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-500">
                          {i + 1}
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          {sug}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Rewriting animation */}
          {rewriting && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                    <Sparkles className="h-7 w-7 text-violet-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    CV'niz yeniden yazılıyor...
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Her bölüm için iyileştirilmiş öneriler hazırlanıyor
                  </p>
                </div>
                <div className="w-48">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full animate-analyzing rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Rewrite Results ── */}
          {rewriteResult && !rewriting && (
            <div className="space-y-4">
              {/* Summary */}
              <Card className="border-violet-200/60 dark:border-violet-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
                    <Sparkles className="h-4 w-4" />
                    AI Yeniden Yazma Önerileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {rewriteResult.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Section-by-section comparisons */}
              {rewriteResult.sections.map((sec, i) => (
                <Card
                  key={i}
                  className="border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[10px] font-bold text-violet-500">
                        {i + 1}
                      </div>
                      {sec.section}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* Original */}
                      <div className="rounded-lg border border-rose-200/60 bg-rose-50/50 p-3 dark:border-rose-500/20 dark:bg-rose-500/5">
                        <div className="mb-1.5 flex items-center gap-1.5">
                          <XCircle className="h-3 w-3 text-rose-500" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                            Mevcut
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          {sec.original}
                        </p>
                      </div>

                      {/* Suggested */}
                      <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              Önerilen
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(sec.suggested);
                              toast.success("Kopyalandı!");
                            }}
                            className="rounded p-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Kopyala"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          {sec.suggested}
                        </p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="flex items-start gap-2 rounded-md bg-slate-50 p-2 dark:bg-slate-800/50">
                      <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {sec.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {/* Score ring */}
          {result && !analyzing && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="relative">
                  <svg
                    className="-rotate-90"
                    width="140"
                    height="140"
                    viewBox="0 0 140 140"
                  >
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="10"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      className={scoreRingColor(result.overallScore)}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.overallScore / 100) * 377} 377`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-3xl font-bold ${scoreColor(result.overallScore)}`}
                    >
                      {result.overallScore}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Genel CV Puanı
                  </p>
                  <Badge
                    variant={
                      result.overallScore >= 80 ? "success" : "warning"
                    }
                    className="mt-1"
                  >
                    {result.overallScore >= 80
                      ? "İyi"
                      : result.overallScore >= 60
                        ? "Geliştirilebilir"
                        : "Zayıf"}
                  </Badge>
                </div>

                <Separator />

                <div className="w-full space-y-2.5 text-xs">
                  <ScoreStat
                    icon={<Award className="h-3.5 w-3.5 text-emerald-500" />}
                    label="Güçlü yön"
                    value={`${result.strengths.length} alan`}
                  />
                  <ScoreStat
                    icon={
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    }
                    label="İyileştirme"
                    value={`${result.weaknesses.length} alan`}
                  />
                  <ScoreStat
                    icon={<Zap className="h-3.5 w-3.5 text-cyan-500" />}
                    label="Öneri"
                    value={`${result.suggestions.length} ipucu`}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick tips - always visible */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                Hızlı İpuçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  CV'nizi her iş başvurusuna özel olarak uyarlayın
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  Ölçülebilir başarılar kullanın ("%20 artış" gibi)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  ATS uyumluluğu için basit, temiz formatlar tercih edin
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  1-2 sayfa arasında tutun, gereksiz bilgilerden kaçının
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  İş ilanındaki anahtar kelimeleri CV'nize yansıtın
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action buttons */}
          {result && !analyzing && selectedCv && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="space-y-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleRewrite}
                  disabled={rewriting}
                >
                  {rewriting ? (
                    <>
                      <Spinner size="sm" />
                      Öneriler Hazırlanıyor...
                    </>
                  ) : rewriteResult ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 text-cyan-500" />
                      Tekrar Öneri Al
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                      AI ile CV Önerilerini Al
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}
