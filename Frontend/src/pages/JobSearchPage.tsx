import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { JobCard } from "@/features/jobs/components/JobCard";
import type { Job } from "@/features/jobs/types";
import { Badge } from "@/components/ui/badge";

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "NovaTech",
    location: "Remote / Europe",
    salaryRange: "$90k – $120k",
    aiScore: 96,
  },
  {
    id: "2",
    title: "React Developer",
    company: "PixelWorks",
    location: "Istanbul, Hybrid",
    salaryRange: "70.000 – 95.000₺",
    aiScore: 84,
  },
  {
    id: "3",
    title: "Fullstack TypeScript Engineer",
    company: "CloudBridge",
    location: "Remote",
    salaryRange: "$80k – $110k",
    aiScore: 78,
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
          {/* Sol: Liste */}
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

          {/* Sağ: Detay (desktop) */}
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

        {/* Mobil: Detay Sheet */}
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

type JobDetailProps = {
  job: Job;
};

function JobDetail({ job }: JobDetailProps) {
  return (
    <div className="sticky top-[4.5rem] flex h-[calc(100vh-10rem)] flex-col rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-4">
      <div className="space-y-1 border-b border-slate-300 dark:border-slate-800 pb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          {job.title}
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {job.company}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {job.location}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <Badge variant={job.aiScore >= 80 ? "success" : "warning"}>
          {job.aiScore}% Uyumlu
        </Badge>
        {job.salaryRange && (
          <p className="text-slate-700 dark:text-slate-300">
            Maaş: <span className="font-medium">{job.salaryRange}</span>
          </p>
        )}
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
        <p>
          Bu alan şimdilik sahte içerik ile doldurulmuş durumda. Gerçek
          senaryoda ilan açıklaması, aranan nitelikler, şirket bilgisi ve
          faydalar burada gösterilecek.
        </p>
        <p>
          Master-detail tasarıma uygun olarak bu panel masaüstünde sabit kalır,
          soldan farklı ilan seçtikçe içerik güncellenir.
        </p>
      </div>
    </div>
  );
}

type MobileJobSheetProps = {
  job: Job;
  onClose: () => void;
};

function MobileJobSheet({ job, onClose }: MobileJobSheetProps) {
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
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
            Kapat
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 pb-4">
          <JobDetail job={job} />
        </div>
      </div>
    </div>
  );
}
