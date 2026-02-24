import { useCallback, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toaster";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Trash2,
  UploadCloud,
  XCircle,
  Zap,
} from "lucide-react";

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

const MOCK_ANALYSIS: AnalysisResult = {
  overallScore: 72,
  sections: [
    {
      name: "Kişisel Bilgiler",
      score: 90,
      status: "good",
      feedback: "İletişim bilgileri eksiksiz. LinkedIn bağlantısı mevcut.",
    },
    {
      name: "İş Deneyimi",
      score: 85,
      status: "good",
      feedback:
        "Deneyimler kronolojik sırada, görev tanımları yeterli detayda.",
    },
    {
      name: "Eğitim",
      score: 75,
      status: "warning",
      feedback:
        "Eğitim bilgileri mevcut ancak GPA veya başarı bilgisi eksik.",
    },
    {
      name: "Yetenekler",
      score: 60,
      status: "warning",
      feedback:
        "Yetenek listesi genel. Seviye belirtilmemiş ve sektöre özel anahtar kelimeler yetersiz.",
    },
    {
      name: "Dil Becerileri",
      score: 80,
      status: "good",
      feedback: "Dil seviyeleri belirtilmiş.",
    },
    {
      name: "Özet / Profil",
      score: 40,
      status: "bad",
      feedback:
        "Profesyonel özet bölümü eksik. İşverenin sizi hızlıca tanıması için bu bölüm kritik.",
    },
    {
      name: "ATS Uyumluluğu",
      score: 65,
      status: "warning",
      feedback:
        "Bazı anahtar kelimeler eksik. Tablo veya grafik kullanımı ATS'yi zorlaştırabilir.",
    },
  ],
  strengths: [
    "İş deneyimleri detaylı ve ölçülebilir başarılarla desteklenmiş",
    "İletişim bilgileri eksiksiz ve profesyonel",
    "Kronolojik sıralama doğru uygulanmış",
    "Dil becerileri seviye ile belirtilmiş",
  ],
  weaknesses: [
    "Profesyonel özet / kariyer hedefi bölümü yok",
    "Yetenek bölümünde seviye belirtilmemiş",
    "Sertifika ve kurs bilgileri eksik",
    "Anahtar kelime yoğunluğu ATS için yetersiz",
  ],
  suggestions: [
    "CV'nin başına 2-3 cümlelik bir profesyonel özet ekleyin",
    "Yetenekleri 'İleri', 'Orta', 'Başlangıç' gibi seviyelerle belirtin",
    "Her deneyimde en az 1 ölçülebilir başarı (rakam, yüzde) ekleyin",
    "Hedeflediğiniz pozisyondaki iş ilanlarından anahtar kelimeleri CV'ye ekleyin",
    "PDF formatında kaydedin — Word dosyaları ATS'de sorun çıkarabilir",
  ],
};

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

export function CvAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Sadece PDF dosyaları kabul edilmektedir.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu 10MB'dan küçük olmalıdır.");
      return;
    }
    setFile(f);
    setResult(null);
    toast.success(`"${f.name}" başarıyla yüklendi.`);
  }, []);

  async function handleAnalyze() {
    if (!file) return;
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setResult(MOCK_ANALYSIS);
    setAnalyzing(false);
    toast.success("CV analizi tamamlandı!");
  }

  function handleRemove() {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
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
        {/* ── LEFT: Upload & Results ── */}
        <div className="space-y-6">
          {/* Upload zone */}
          {!file ? (
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
                  className={`flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
                    dragOver
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5"
                      : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <UploadCloud className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      CV dosyanızı sürükleyin veya seçin
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      PDF formatı • Maksimum 10MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
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
          ) : (
            /* File loaded state */
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                      <FileText className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024).toFixed(0)} KB • PDF
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!analyzing && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        onClick={handleRemove}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Kaldır
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={handleAnalyze}
                      disabled={analyzing}
                    >
                      {analyzing ? (
                        <>
                          <Spinner size="sm" />
                          Analiz Ediliyor...
                        </>
                      ) : result ? (
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
          {result && !analyzing && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="space-y-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  Raporu İndir (PDF)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                  AI ile CV'yi Yeniden Yaz
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
