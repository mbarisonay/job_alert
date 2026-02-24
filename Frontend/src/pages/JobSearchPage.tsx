import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { JobCard } from "@/features/jobs/components/JobCard";
import type { Job } from "@/features/jobs/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/store/jobStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/components/ui/toaster";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  MapPin,
  PiggyBank,
  Send,
  Sparkles,
  X,
} from "lucide-react";

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "NovaTech",
    location: "Remote / Avrupa",
    salaryRange: "$90k – $120k",
    aiScore: 96,
    type: "Remote",
    postedAt: "2 gün önce",
    description:
      "Modern React ve TypeScript kullanarak enterprise seviye web uygulamaları geliştirmek. Performans optimizasyonu, erişilebilirlik ve kullanıcı deneyimi konularında liderlik etmek.",
    requirements: [
      "5+ yıl React deneyimi",
      "TypeScript ile ileri seviye çalışma",
      "State management (Redux/Zustand)",
      "CI/CD pipeline bilgisi",
      "İngilizce (İleri seviye)",
    ],
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
  {
    id: "2",
    title: "React Developer",
    company: "PixelWorks",
    location: "İstanbul, Hybrid",
    salaryRange: "70.000 – 95.000₺",
    aiScore: 84,
    type: "Hybrid",
    postedAt: "5 gün önce",
    description:
      "E-ticaret platformumuzun frontend altyapısını oluşturacak, kullanıcı arayüzü bileşenleri geliştirecek ve backend API entegrasyonlarını sağlayacak bir React Developer arıyoruz.",
    requirements: [
      "3+ yıl React deneyimi",
      "RESTful API entegrasyonu",
      "Responsive tasarım bilgisi",
      "Git versiyon kontrolü",
    ],
    tags: ["React", "JavaScript", "CSS", "REST API"],
  },
  {
    id: "3",
    title: "Fullstack TypeScript Engineer",
    company: "CloudBridge",
    location: "Remote",
    salaryRange: "$80k – $110k",
    aiScore: 78,
    type: "Remote",
    postedAt: "1 hafta önce",
    description:
      "Node.js ve React kullanarak cloud-native mikro servisler ve web uygulamaları geliştirmek. PostgreSQL ve Redis ile veri katmanı tasarımı.",
    requirements: [
      "4+ yıl fullstack deneyim",
      "Node.js / Express",
      "PostgreSQL",
      "Docker & Kubernetes temel bilgisi",
    ],
    tags: ["Node.js", "React", "PostgreSQL", "Docker"],
  },
  {
    id: "4",
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Ankara, Ofis",
    salaryRange: "55.000 – 75.000₺",
    aiScore: 62,
    type: "Ofis",
    postedAt: "3 gün önce",
    description:
      "Mobil ve web uygulamalar için kullanıcı araştırması, wireframe, prototip ve yüksek kaliteli UI tasarımları oluşturmak.",
    requirements: [
      "Figma / Sketch deneyimi",
      "Kullanıcı araştırması ve persona oluşturma",
      "Design system bilgisi",
      "Prototipleme araçları",
    ],
    tags: ["Figma", "UI/UX", "Prototyping", "Design System"],
  },
  {
    id: "5",
    title: "Backend Developer (Python)",
    company: "DataFlow AI",
    location: "İstanbul, Remote",
    salaryRange: "80.000 – 110.000₺",
    aiScore: 71,
    type: "Remote",
    postedAt: "1 gün önce",
    description:
      "Python ile makine öğrenmesi pipeline'ları ve RESTful API'ler geliştirmek. Büyük veri işleme ve model deployment konularında çalışmak.",
    requirements: [
      "3+ yıl Python deneyimi",
      "FastAPI / Django REST",
      "SQL & NoSQL veritabanları",
      "Docker",
      "Temel ML bilgisi",
    ],
    tags: ["Python", "FastAPI", "Machine Learning", "Docker"],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "InfraScale",
    location: "Remote / Türkiye",
    salaryRange: "$70k – $95k",
    aiScore: 55,
    type: "Remote",
    postedAt: "4 gün önce",
    description:
      "Kubernetes cluster yönetimi, CI/CD pipeline kurulumu, monitoring ve altyapı otomasyonu konularında çalışacak bir DevOps Engineer arıyoruz.",
    requirements: [
      "AWS veya GCP deneyimi",
      "Kubernetes & Helm",
      "Terraform / Ansible",
      "Linux sistem yönetimi",
      "Monitoring (Prometheus, Grafana)",
    ],
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
  },
];

export function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileDetailId, setMobileDetailId] = useState<string | null>(null);

  const q = searchParams.get("q") ?? "";

  const filteredJobs = useMemo(() => {
    if (!q) return MOCK_JOBS;
    const query = q.toLowerCase();
    return MOCK_JOBS.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query),
    );
  }, [q]);

  const selectedId =
    searchParams.get("jobId") ?? filteredJobs[0]?.id ?? undefined;

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedId) ?? filteredJobs[0];

  const handleSelectJob = (jobId: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("jobId", jobId);
    setSearchParams(next, { replace: true });
    setMobileDetailId(jobId);
  };

  return (
    <AppLayout>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              İş Ara ve Keşfet
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Arama kriterlerine göre AI skoru ile sıralanmış ilanlar.
            </p>
          </div>
          <Badge className="hidden text-[11px] text-slate-700 dark:text-slate-300 md:inline-flex">
            {filteredJobs.length} ilan bulundu
          </Badge>
        </div>

        <SearchFilters q={q} setSearchParams={setSearchParams} />

        <div className="grid gap-4 md:grid-cols-[minmax(0,40%),minmax(0,60%)] md:h-[calc(100vh-10rem)]">
          <div className="flex flex-col gap-2 overflow-hidden rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60">
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 md:hidden">
              <span>{filteredJobs.length} ilan</span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isActive={job.id === selectedJob?.id}
                  onClick={() => handleSelectJob(job.id)}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {selectedJob ? (
              <JobDetail job={selectedJob} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-800 text-sm text-slate-500">
                Detay görmek için listeden bir ilan seçin.
              </div>
            )}
          </div>
        </div>

        {mobileDetailId && (
          <MobileJobSheet
            job={
              filteredJobs.find((j) => j.id === mobileDetailId) ?? selectedJob
            }
            onClose={() => setMobileDetailId(null)}
          />
        )}
      </section>
    </AppLayout>
  );
}

// ── Filters ──

type SearchFiltersProps = {
  q: string;
  setSearchParams: (
    params: URLSearchParams,
    options?: { replace?: boolean },
  ) => void;
};

function SearchFilters({ q, setSearchParams }: SearchFiltersProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const next = new URLSearchParams();
    if (event.target.value) {
      next.set("q", event.target.value);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Başlık, şirket veya lokasyon ara..."
        className="h-9 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 px-3 text-xs text-slate-900 dark:text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
        value={q}
        onChange={handleChange}
      />
    </div>
  );
}

// ── Job Detail ──

function JobDetail({ job }: { job: Job }) {
  const { isAuthenticated } = useAuthStore();
  const { saveJob, unsaveJob, isJobSaved, applyToJob, hasApplied } =
    useJobStore();

  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id);

  return (
    <div className="sticky top-[4.5rem] flex h-[calc(100vh-10rem)] flex-col rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
      <div className="space-y-3 border-b border-slate-300 dark:border-slate-800 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {job.title}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {job.company}
            </p>
          </div>
          <Badge variant={job.aiScore >= 80 ? "success" : "warning"}>
            <Sparkles className="mr-1 h-3 w-3" />
            {job.aiScore}% Uyumlu
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
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

        {job.tags && (
          <div className="flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {isAuthenticated && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="gap-1.5"
              disabled={applied}
              onClick={() => {
                applyToJob(job);
                toast.success("Başvurunuz kaydedildi!");
              }}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Başvuruldu
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Başvur
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                if (saved) {
                  unsaveJob(job.id);
                  toast.info("İlan kaydedilenlerden çıkarıldı.");
                } else {
                  saveJob(job);
                  toast.success("İlan kaydedildi!");
                }
              }}
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
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm text-slate-700 dark:text-slate-300">
        {job.description && (
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              İlan Açıklaması
            </h3>
            <p className="text-xs leading-relaxed">{job.description}</p>
          </div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Aranan Nitelikler
            </h3>
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
      </div>
    </div>
  );
}

// ── Mobile Sheet ──

function MobileJobSheet({
  job,
  onClose,
}: {
  job: Job;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden">
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-xs font-medium text-slate-900 dark:text-slate-200">
            İlan Detayı
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 pb-4">
          <JobDetail job={job} />
        </div>
      </div>
    </div>
  );
}
