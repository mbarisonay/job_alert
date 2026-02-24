import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useJobStore } from "@/store/jobStore";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toaster";
import type { Job } from "@/features/jobs/types";
import {
  Bookmark,
  BookmarkCheck,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  PiggyBank,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

// ── Types ──

type MatchReason = {
  label: string;
  type: "skill" | "location" | "salary" | "experience" | "preference";
};

type RecommendedJob = Job & {
  matchReasons: MatchReason[];
  matchedSkills: string[];
  companyLogo?: string;
};

type UserProfileSummary = {
  skills: string[];
  location: string;
  workPreference: string[];
  expectedSalary: number | null;
  bio: string;
  completeness: number;
};

// ── Mock Data ──

const MOCK_RECOMMENDED: RecommendedJob[] = [
  {
    id: "rec-1",
    title: "Senior React Developer",
    company: "TechVista",
    location: "İstanbul, Remote",
    salaryRange: "85.000 – 120.000₺",
    aiScore: 97,
    type: "Remote",
    postedAt: "Bugün",
    description:
      "Modern React ve TypeScript kullanarak yeni nesil SaaS platformumuzun frontend mimarisini oluşturacak, component library geliştirip ekibe teknik liderlik yapacak bir Senior Developer arıyoruz.",
    requirements: [
      "5+ yıl React / TypeScript deneyimi",
      "State management (Zustand/Redux) tecrübesi",
      "Design system ve component library deneyimi",
      "CI/CD ve test otomasyonu bilgisi",
      "Takım liderliği deneyimi",
    ],
    tags: ["React", "TypeScript", "Zustand", "Tailwind CSS", "Vite"],
    matchReasons: [
      { label: "5 yeteneğin eşleşiyor", type: "skill" },
      { label: "Tercih ettiğin lokasyon", type: "location" },
      { label: "Beklenen maaş aralığında", type: "salary" },
      { label: "Remote çalışma tercihin", type: "preference" },
    ],
    matchedSkills: ["React", "TypeScript", "Zustand", "Tailwind CSS", "Vite"],
  },
  {
    id: "rec-2",
    title: "Frontend Architect",
    company: "FinFlow",
    location: "Ankara, Hybrid",
    salaryRange: "100.000 – 140.000₺",
    aiScore: 93,
    type: "Hybrid",
    postedAt: "1 gün önce",
    description:
      "Fintech ürünlerimizin frontend altyapısını tasarlayacak, mikro-frontend mimarisi kuracak ve 8 kişilik frontend takımına teknik yönlendirme sağlayacak bir Frontend Architect arıyoruz.",
    requirements: [
      "7+ yıl frontend deneyimi",
      "Mikro-frontend mimarisi bilgisi",
      "React + TypeScript ustalığı",
      "Performans optimizasyonu tecrübesi",
      "Takım mentorlüğü",
    ],
    tags: ["React", "TypeScript", "Micro Frontend", "Performance", "Node.js"],
    matchReasons: [
      { label: "3 yeteneğin eşleşiyor", type: "skill" },
      { label: "Deneyim seviyene uygun", type: "experience" },
      { label: "Maaş beklentinin üstünde", type: "salary" },
    ],
    matchedSkills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: "rec-3",
    title: "Fullstack Developer",
    company: "GreenTech Solutions",
    location: "İstanbul, Remote",
    salaryRange: "70.000 – 100.000₺",
    aiScore: 89,
    type: "Remote",
    postedAt: "2 gün önce",
    description:
      "Sürdürülebilir enerji platformumuzun hem frontend hem backend geliştirmelerini yapacak, API tasarımı ve veritabanı optimizasyonu konularında çalışacak bir Fullstack Developer arıyoruz.",
    requirements: [
      "React ve Node.js deneyimi",
      "PostgreSQL veya MongoDB",
      "REST API tasarımı",
      "Docker temel bilgisi",
      "Agile/Scrum deneyimi",
    ],
    tags: ["React", "Node.js", "PostgreSQL", "Docker", "TypeScript"],
    matchReasons: [
      { label: "4 yeteneğin eşleşiyor", type: "skill" },
      { label: "Remote çalışma tercihin", type: "preference" },
      { label: "Tercih ettiğin lokasyon", type: "location" },
    ],
    matchedSkills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
  },
  {
    id: "rec-4",
    title: "React Native Developer",
    company: "AppForge",
    location: "İzmir, Ofis",
    salaryRange: "60.000 – 85.000₺",
    aiScore: 82,
    type: "Ofis",
    postedAt: "3 gün önce",
    description:
      "Mobil uygulamamızı React Native ile geliştirmeye devam edecek, yeni özellikler ekleyecek ve performans iyileştirmeleri yapacak bir React Native Developer arıyoruz.",
    requirements: [
      "2+ yıl React Native deneyimi",
      "iOS ve Android bilgisi",
      "TypeScript",
      "REST API entegrasyonu",
      "App Store / Play Store yayınlama",
    ],
    tags: ["React Native", "TypeScript", "iOS", "Android", "Firebase"],
    matchReasons: [
      { label: "2 yeteneğin eşleşiyor", type: "skill" },
      { label: "React bilgin transfere uygun", type: "experience" },
    ],
    matchedSkills: ["TypeScript", "React Native"],
  },
  {
    id: "rec-5",
    title: "UI/UX Developer",
    company: "Creatify Studio",
    location: "İstanbul, Hybrid",
    salaryRange: "65.000 – 90.000₺",
    aiScore: 78,
    type: "Hybrid",
    postedAt: "4 gün önce",
    description:
      "Design system oluşturma, Figma'dan koda dönüştürme ve animasyon implementasyonu konularında çalışacak, tasarım ve geliştirme arasında köprü olacak bir UI/UX Developer arıyoruz.",
    requirements: [
      "React ve CSS/Tailwind ileri seviye",
      "Figma deneyimi",
      "Animasyon kütüphaneleri (Framer Motion)",
      "Erişilebilirlik (a11y) bilgisi",
      "Design token bilgisi",
    ],
    tags: ["React", "Tailwind CSS", "Figma", "Framer Motion", "Design System"],
    matchReasons: [
      { label: "2 yeteneğin eşleşiyor", type: "skill" },
      { label: "Tercih ettiğin lokasyon", type: "location" },
    ],
    matchedSkills: ["React", "Tailwind CSS"],
  },
  {
    id: "rec-6",
    title: "DevOps & Platform Engineer",
    company: "CloudScale",
    location: "Remote / Türkiye",
    salaryRange: "$60k – $85k",
    aiScore: 58,
    type: "Remote",
    postedAt: "1 hafta önce",
    description:
      "Kubernetes cluster yönetimi, CI/CD pipeline'ları ve altyapı otomasyonu konularında deneyimli bir DevOps Engineer arıyoruz. IaC araçları ile çalışacaksınız.",
    requirements: [
      "AWS veya GCP sertifikası",
      "Kubernetes & Helm",
      "Terraform / Pulumi",
      "GitHub Actions / GitLab CI",
      "Monitoring (Datadog / Grafana)",
    ],
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker"],
    matchReasons: [
      { label: "1 yeteneğin eşleşiyor", type: "skill" },
      { label: "Remote çalışma tercihin", type: "preference" },
    ],
    matchedSkills: ["Docker"],
  },
];

const SORT_OPTIONS = [
  { value: "score", label: "AI Skoru" },
  { value: "date", label: "Yayın Tarihi" },
  { value: "salary", label: "Maaş" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

// ── Main Component ──

export function RecommendedPage() {
  const { user } = useAuthStore();
  const { saveJob, unsaveJob, isJobSaved, applyToJob, hasApplied } =
    useJobStore();

  const [profile, setProfile] = useState<UserProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("score");
  const [filterMin, setFilterMin] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [detailJob, setDetailJob] = useState<RecommendedJob | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiRequest<any>("/api/profile", "GET");
      const p = data?.profile;
      const skills: string[] = p?.skills ?? [];
      const completeness = calcCompleteness(
        skills,
        p?.bio,
        p?.expectedSalary,
        p?.workPreference,
        p?.location,
        data?.experiences,
        data?.educations,
      );
      setProfile({
        skills,
        location: p?.location ?? "",
        workPreference: p?.workPreference
          ? p.workPreference.split(",").map((s: string) => s.trim())
          : [],
        expectedSalary: p?.expectedSalary ?? null,
        bio: p?.bio ?? "",
        completeness,
      });
    } catch {
      setProfile({
        skills: [],
        location: "",
        workPreference: [],
        expectedSalary: null,
        bio: "",
        completeness: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const sorted = [...MOCK_RECOMMENDED]
    .filter((j) => j.aiScore >= filterMin)
    .sort((a, b) => {
      if (sortBy === "score") return b.aiScore - a.aiScore;
      if (sortBy === "date") return 0;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Senin İçin Önerilen İlanlar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Profilindeki bilgilere göre AI ile eşleştirildi
            </p>
          </div>
        </div>
        <Badge className="flex w-fit items-center gap-1.5 text-[11px]">
          <Brain className="h-3 w-3" />
          {sorted.length} ilan eşleşti
        </Badge>
      </div>

      {/* Profile Summary Strip */}
      {profile && (
        <ProfileSummaryStrip
          profile={profile}
          userName={user?.firstName ?? "Kullanıcı"}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSortBy(opt.value)}
              className={`px-3 py-1.5 text-[11px] font-medium transition first:rounded-l-lg last:rounded-r-lg ${
                sortBy === opt.value
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-[11px]"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-3 w-3" />
          Filtre
          {showFilters ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>

        {filterMin > 0 && (
          <Badge
            className="cursor-pointer gap-1 text-[10px]"
            onClick={() => setFilterMin(0)}
          >
            Min %{filterMin}
            <X className="h-2.5 w-2.5" />
          </Badge>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="animate-in rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Minimum AI Eşleşme Skoru: %{filterMin}
            </label>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={filterMin}
              onChange={(e) => setFilterMin(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>%0</span>
              <span>%50</span>
              <span>%95</span>
            </div>
          </div>
        </div>
      )}

      {/* Job Cards */}
      <div className="space-y-3">
        {sorted.map((job, idx) => (
          <RecommendedJobCard
            key={job.id}
            job={job}
            rank={idx + 1}
            saved={isJobSaved(job.id)}
            applied={hasApplied(job.id)}
            onSave={() => {
              saveJob(job);
              toast.success("İlan kaydedildi!");
            }}
            onUnsave={() => {
              unsaveJob(job.id);
              toast.info("İlan kaydedilenlerden çıkarıldı.");
            }}
            onApply={() => {
              applyToJob(job);
              toast.success("Başvurunuz kaydedildi!");
            }}
            onDetail={() => setDetailJob(job)}
            profileSkills={profile?.skills ?? []}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 py-16 dark:border-slate-700">
          <Target className="h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500">
            Bu filtre kriterlerine uygun ilan bulunamadı.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {detailJob && (
        <JobDetailModal
          job={detailJob}
          saved={isJobSaved(detailJob.id)}
          applied={hasApplied(detailJob.id)}
          profileSkills={profile?.skills ?? []}
          onSave={() => {
            saveJob(detailJob);
            toast.success("İlan kaydedildi!");
          }}
          onUnsave={() => {
            unsaveJob(detailJob.id);
            toast.info("İlan kaydedilenlerden çıkarıldı.");
          }}
          onApply={() => {
            applyToJob(detailJob);
            toast.success("Başvurunuz kaydedildi!");
          }}
          onClose={() => setDetailJob(null)}
        />
      )}
    </div>
  );
}

// ── Profile Summary Strip ──

function ProfileSummaryStrip({
  profile,
  userName,
}: {
  profile: UserProfileSummary;
  userName: string;
}) {
  const hasData = profile.skills.length > 0 || profile.location;

  if (!hasData) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
          <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
            Profilini tamamla, daha iyi eşleşmeler al!
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Yeteneklerini, lokasyon ve maaş tercihlerini eklediğinde AI daha
            doğru öneriler sunabilir.
          </p>
        </div>
        <a
          href="/dashboard/profile"
          className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-amber-700"
        >
          Profili Düzenle
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-md shadow-emerald-500/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              Merhaba {userName}!
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Profil tamamlanma: %{profile.completeness} · AI öneriler
              güncellendi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 5).map((s) => (
            <span
              key={s}
              className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              {s}
            </span>
          ))}
          {profile.skills.length > 5 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              +{profile.skills.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat
          icon={<Zap className="h-3 w-3 text-emerald-500" />}
          label="Eşleşen"
          value={`${MOCK_RECOMMENDED.length} ilan`}
        />
        <MiniStat
          icon={<TrendingUp className="h-3 w-3 text-blue-500" />}
          label="Yüksek Skor"
          value={`%${Math.max(...MOCK_RECOMMENDED.map((j) => j.aiScore))}`}
        />
        <MiniStat
          icon={<MapPin className="h-3 w-3 text-violet-500" />}
          label="Lokasyon"
          value={profile.location || "Belirtilmemiş"}
        />
        <MiniStat
          icon={<Briefcase className="h-3 w-3 text-amber-500" />}
          label="Tercih"
          value={
            profile.workPreference.length > 0
              ? profile.workPreference.join(", ")
              : "Belirtilmemiş"
          }
        />
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/60 px-2.5 py-1.5 dark:bg-slate-800/40">
      {icon}
      <div>
        <p className="text-[10px] text-slate-400">{label}</p>
        <p className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Recommended Job Card ──

function RecommendedJobCard({
  job,
  rank,
  saved,
  applied,
  onSave,
  onUnsave,
  onApply,
  onDetail,
  profileSkills,
}: {
  job: RecommendedJob;
  rank: number;
  saved: boolean;
  applied: boolean;
  onSave: () => void;
  onUnsave: () => void;
  onApply: () => void;
  onDetail: () => void;
  profileSkills: string[];
}) {
  const scoreColor = getScoreColor(job.aiScore);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700">
      {/* Score accent line */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${scoreColor.bg}`}
      />

      <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-start">
        {/* Left: Rank + Company icon */}
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              #{rank}
            </span>
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm ${scoreColor.gradient}`}
            >
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Center: Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <button
                type="button"
                onClick={onDetail}
                className="text-left text-sm font-semibold text-slate-900 transition hover:text-emerald-600 dark:text-slate-50 dark:hover:text-emerald-400"
              >
                {job.title}
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {job.company}
              </p>
            </div>

            {/* Score Ring */}
            <div className="shrink-0">
              <ScoreRing score={job.aiScore} size={48} />
            </div>
          </div>

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            {job.salaryRange && (
              <span className="flex items-center gap-1">
                <PiggyBank className="h-3 w-3" />
                {job.salaryRange}
              </span>
            )}
            {job.type && (
              <Badge className="px-1.5 py-0 text-[10px]">{job.type}</Badge>
            )}
            {job.postedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.postedAt}
              </span>
            )}
          </div>

          {/* Match Reasons */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {job.matchReasons.map((r, i) => (
              <span
                key={i}
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${getReasonStyle(r.type)}`}
              >
                {getReasonIcon(r.type)}
                {r.label}
              </span>
            ))}
          </div>

          {/* Matched Skills */}
          {job.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {job.tags.map((tag) => {
                const isMatch =
                  profileSkills.some(
                    (s) => s.toLowerCase() === tag.toLowerCase(),
                  ) || job.matchedSkills.includes(tag);
                return (
                  <span
                    key={tag}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                      isMatch
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {isMatch && <span className="mr-0.5">✓</span>}
                    {tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 gap-1 px-3 text-[11px]"
              disabled={applied}
              onClick={onApply}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Başvuruldu
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Hemen Başvur
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2.5 text-[11px]"
              onClick={saved ? onUnsave : onSave}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="h-3 w-3 text-amber-500" />
                  Kaydedildi
                </>
              ) : (
                <>
                  <Bookmark className="h-3 w-3" />
                  Kaydet
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-[11px]"
              onClick={onDetail}
            >
              <ExternalLink className="h-3 w-3" />
              Detay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Score Ring ──

function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className={color.text}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold ${color.text}`}
      >
        {score}
      </span>
    </div>
  );
}

// ── Detail Modal ──

function JobDetailModal({
  job,
  saved,
  applied,
  profileSkills,
  onSave,
  onUnsave,
  onApply,
  onClose,
}: {
  job: RecommendedJob;
  saved: boolean;
  applied: boolean;
  profileSkills: string[];
  onSave: () => void;
  onUnsave: () => void;
  onApply: () => void;
  onClose: () => void;
}) {
  const scoreColor = getScoreColor(job.aiScore);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div className={`h-1 w-full ${scoreColor.gradient}`} />

        <div className="max-h-[80vh] overflow-y-auto p-5">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-4 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md ${scoreColor.gradient}`}
            >
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {job.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {job.company}
              </p>
            </div>
            <ScoreRing score={job.aiScore} size={56} />
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            {job.salaryRange && (
              <span className="flex items-center gap-1">
                <PiggyBank className="h-3.5 w-3.5" />
                {job.salaryRange}
              </span>
            )}
            {job.postedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.postedAt}
              </span>
            )}
          </div>

          {/* Match Reasons */}
          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-500/10 dark:bg-emerald-500/5">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Brain className="h-3.5 w-3.5" />
              Neden Bu İlan Önerildi?
            </h4>
            <div className="space-y-1.5">
              {job.matchReasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="mt-4">
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                İlan Açıklaması
              </h4>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="mt-4">
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Aranan Nitelikler
              </h4>
              <ul className="space-y-1.5">
                {job.requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.tags && (
            <div className="mt-4">
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Teknolojiler & Yetenekler
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((tag) => {
                  const isMatch =
                    profileSkills.some(
                      (s) => s.toLowerCase() === tag.toLowerCase(),
                    ) || job.matchedSkills.includes(tag);
                  return (
                    <span
                      key={tag}
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        isMatch
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {isMatch && "✓ "}
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex gap-2">
            <Button
              className="flex-1 gap-1.5"
              size="sm"
              disabled={applied}
              onClick={onApply}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Başvuruldu
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Hemen Başvur
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={saved ? onUnsave : onSave}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-amber-500" />
                  Kaydedildi
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──

function getScoreColor(score: number) {
  if (score >= 90)
    return {
      text: "text-emerald-500",
      bg: "bg-emerald-500",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    };
  if (score >= 75)
    return {
      text: "text-blue-500",
      bg: "bg-blue-500",
      gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
    };
  if (score >= 60)
    return {
      text: "text-amber-500",
      bg: "bg-amber-500",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    };
  return {
    text: "text-slate-400",
    bg: "bg-slate-400",
    gradient: "bg-gradient-to-br from-slate-400 to-slate-500",
  };
}

function getReasonStyle(type: MatchReason["type"]) {
  switch (type) {
    case "skill":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "location":
      return "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400";
    case "salary":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case "experience":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    case "preference":
      return "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
}

function getReasonIcon(type: MatchReason["type"]) {
  const cls = "h-2.5 w-2.5 mr-0.5";
  switch (type) {
    case "skill":
      return <Zap className={cls} />;
    case "location":
      return <MapPin className={cls} />;
    case "salary":
      return <PiggyBank className={cls} />;
    case "experience":
      return <TrendingUp className={cls} />;
    case "preference":
      return <Target className={cls} />;
    default:
      return null;
  }
}

function calcCompleteness(
  skills: string[],
  bio?: string,
  salary?: number | null,
  workPref?: string,
  location?: string,
  experiences?: unknown[],
  educations?: unknown[],
) {
  let total = 0;
  if (skills.length > 0) total += 20;
  if (bio) total += 15;
  if (salary) total += 15;
  if (workPref) total += 10;
  if (location) total += 10;
  if (experiences && (experiences as unknown[]).length > 0) total += 15;
  if (educations && (educations as unknown[]).length > 0) total += 15;
  return total;
}
