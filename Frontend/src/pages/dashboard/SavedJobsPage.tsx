import { useEffect, useState } from "react";
import { type SavedJobRecord, useJobStore } from "@/store/jobStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import {
  Bookmark,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  PiggyBank,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

export function SavedJobsPage() {
  const { savedJobs, unsaveJob, applyToJob, hasApplied, fetchSavedJobs, fetchApplications } = useJobStore();
  const [search, setSearch] = useState("");
  const [detailJob, setDetailJob] = useState<SavedJobRecord | null>(null);

  useEffect(() => {
    fetchSavedJobs();
    fetchApplications();
  }, [fetchSavedJobs, fetchApplications]);

  const filtered = savedJobs.filter((j) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      (j.location && j.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10">
            <Bookmark className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Kaydedilen İlanlar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              İlgini çeken ilanları burada takip edebilirsin.
            </p>
          </div>
        </div>
        <Badge className="w-fit text-[11px]">
          {savedJobs.length} ilan kayıtlı
        </Badge>
      </div>

      {/* Search */}
      {savedJobs.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Kayıtlı ilanlarda ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          />
        </div>
      )}

      {/* Empty State */}
      {savedJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-20 dark:border-slate-700 dark:bg-slate-900/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
            <Bookmark className="h-6 w-6 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Henüz kaydettiğin bir ilan yok.
          </p>
          <p className="max-w-xs text-center text-xs text-slate-500 dark:text-slate-500">
            İş Ara sayfasından beğendiğin ilanlarda &quot;Kaydet&quot; butonuna
            tıklayarak buraya ekleyebilirsin.
          </p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              applied={hasApplied(job.title, job.company)}
              onRemove={async () => {
                await unsaveJob(job.id);
                toast.info("İlan kaydedilenlerden çıkarıldı.");
              }}
              onApply={async () => {
                await applyToJob({
                  id: job.jobId || job.id,
                  title: job.title,
                  company: job.company,
                  location: job.location || "",
                  salaryRange: job.salary || "",
                  type: job.workModel || "Remote",
                  aiScore: 80,
                  postedAt: job.savedAt,
                  description: "",
                  requirements: [],
                  tags: []
                });
                toast.success("Başvurunuz kaydedildi!");
              }}
              onDetail={() => setDetailJob(job)}
            />
          ))}
        </div>
      )}

      {/* No results */}
      {savedJobs.length > 0 && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-500">
          Arama kriterine uygun kayıtlı ilan bulunamadı.
        </p>
      )}

      {/* Detail Modal */}
      {detailJob && (
        <JobDetailModal job={detailJob} onClose={() => setDetailJob(null)} />
      )}
    </div>
  );
}

// ── Card ──

function SavedJobCard({
  job,
  applied,
  onRemove,
  onApply,
  onDetail,
}: {
  job: SavedJobRecord;
  applied: boolean;
  onRemove: () => void;
  onApply: () => void;
  onDetail: () => void;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700">
      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 rounded-md p-1 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        title="Kaldır"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
              {job.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {job.company}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1">
              <PiggyBank className="h-3 w-3" />
              {job.salary}
            </span>
          )}
          {job.savedAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(job.savedAt).toLocaleDateString("tr-TR")}
            </span>
          )}
        </div>

      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <Badge variant="success">
          <Sparkles className="mr-1 h-2.5 w-2.5" />
          Kayıtlı
        </Badge>

        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-[11px]"
            onClick={onDetail}
          >
            <ExternalLink className="h-3 w-3" />
            Detay
          </Button>
          <Button
            size="sm"
            className="h-7 gap-1 px-2.5 text-[11px]"
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
                Başvur
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Modal ──

function JobDetailModal({ job, onClose }: { job: SavedJobRecord; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Briefcase className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {job.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {job.company}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1">
                <PiggyBank className="h-3.5 w-3.5" />
                {job.salary}
              </span>
            )}
            {job.jobUrl && (
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-600 hover:underline">
                <ExternalLink className="h-3.5 w-3.5" />
                Orijinal İlana Git
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
