import { useState } from "react";
import { useJobStore, type Application, type ApplicationStatus } from "@/store/jobStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import {
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  GripVertical,
  MessageSquareText,
  Send,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

type Column = {
  id: ApplicationStatus;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
};

const COLUMNS: Column[] = [
  {
    id: "applied",
    label: "Başvuruldu",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
    icon: <Send className="h-4 w-4" />,
  },
  {
    id: "screening",
    label: "Ön Eleme",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    id: "interview",
    label: "Mülakat",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "offer",
    label: "Teklif",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: "rejected",
    label: "Reddedildi",
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
    icon: <XCircle className="h-4 w-4" />,
  },
];

export function TrackingPage() {
  const { applications, moveApplication, removeApplication, updateNote } =
    useJobStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<Application | null>(null);

  const getColumnApps = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status);

  const handleDragStart = (appId: string) => {
    setDraggedId(appId);
  };

  const handleDrop = (targetStatus: ApplicationStatus) => {
    if (!draggedId) return;
    const app = applications.find((a) => a.id === draggedId);
    if (app && app.status !== targetStatus) {
      moveApplication(draggedId, targetStatus);
      const col = COLUMNS.find((c) => c.id === targetStatus);
      toast.success(`Başvuru "${col?.label}" aşamasına taşındı.`);
    }
    setDraggedId(null);
  };

  const handleMoveForward = (app: Application) => {
    const currentIdx = COLUMNS.findIndex((c) => c.id === app.status);
    if (currentIdx < COLUMNS.length - 2) {
      const next = COLUMNS[currentIdx + 1];
      moveApplication(app.id, next.id);
      toast.success(`Başvuru "${next.label}" aşamasına taşındı.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/10">
            <ClipboardList className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Başvuru Takibi
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Başvurularını sürükle-bırak ile kolayca yönet.
            </p>
          </div>
        </div>
        <Badge className="w-fit text-[11px]">
          {applications.length} aktif başvuru
        </Badge>
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-20 dark:border-slate-700 dark:bg-slate-900/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
            <ClipboardList className="h-6 w-6 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Henüz bir başvurun yok.
          </p>
          <p className="max-w-xs text-center text-xs text-slate-500">
            İş Ara sayfasından bir ilana &quot;Başvur&quot; butonuyla başvurarak
            takip panonu oluşturmaya başla.
          </p>
        </div>
      )}

      {/* Kanban Board */}
      {applications.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
          {COLUMNS.map((col) => {
            const apps = getColumnApps(col.id);
            return (
              <div
                key={col.id}
                className="flex min-w-[260px] flex-1 snap-start flex-col rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/50"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("ring-2", "ring-slate-300", "dark:ring-slate-600");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("ring-2", "ring-slate-300", "dark:ring-slate-600");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("ring-2", "ring-slate-300", "dark:ring-slate-600");
                  handleDrop(col.id);
                }}
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between rounded-t-xl border-b px-3 py-2.5 ${col.bgColor}`}
                >
                  <div className={`flex items-center gap-2 text-xs font-semibold ${col.color}`}>
                    {col.icon}
                    {col.label}
                  </div>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${col.color} bg-white/60 dark:bg-black/20`}
                  >
                    {apps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2 p-2">
                  {apps.length === 0 && (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] text-slate-400">
                        Buraya sürükle
                      </p>
                    </div>
                  )}
                  {apps.map((app) => (
                    <KanbanCard
                      key={app.id}
                      app={app}
                      onDragStart={() => handleDragStart(app.id)}
                      onRemove={() => {
                        removeApplication(app.id);
                        toast.info("Başvuru silindi.");
                      }}
                      onMoveForward={
                        col.id !== "offer" && col.id !== "rejected"
                          ? () => handleMoveForward(app)
                          : undefined
                      }
                      onOpenNote={() => setNoteModal(app)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <NoteModal
          app={noteModal}
          onSave={(note) => {
            updateNote(noteModal.id, note);
            toast.success("Not kaydedildi.");
            setNoteModal(null);
          }}
          onClose={() => setNoteModal(null)}
        />
      )}
    </div>
  );
}

// ── Kanban Card ──

function KanbanCard({
  app,
  onDragStart,
  onRemove,
  onMoveForward,
  onOpenNote,
}: {
  app: Application;
  onDragStart: () => void;
  onRemove: () => void;
  onMoveForward?: () => void;
  onOpenNote: () => void;
}) {
  const appliedDate = new Date(app.appliedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <h4 className="truncate text-xs font-semibold text-slate-900 dark:text-slate-50">
              {app.job.title}
            </h4>
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 rounded p-0.5 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
            {app.job.company}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock className="h-2.5 w-2.5" />
            {appliedDate}
          </span>
          {app.job.aiScore && (
            <Badge
              variant={app.job.aiScore >= 80 ? "success" : "warning"}
              className="px-1.5 py-0 text-[9px]"
            >
              {app.job.aiScore}%
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {app.note && (
            <MessageSquareText className="h-3 w-3 text-blue-400" />
          )}
          <button
            type="button"
            onClick={onOpenNote}
            className="rounded p-0.5 text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300"
            title="Not ekle"
          >
            <MessageSquareText className="h-3 w-3" />
          </button>
          {onMoveForward && (
            <button
              type="button"
              onClick={onMoveForward}
              className="rounded p-0.5 text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300"
              title="Sonraki aşamaya taşı"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Note Modal ──

function NoteModal({
  app,
  onSave,
  onClose,
}: {
  app: Application;
  onSave: (note: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(app.note);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {app.job.title}
              </h3>
              <p className="text-[11px] text-slate-500">{app.job.company}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Başvuruyla ilgili notlarını buraya ekle... (Mülakat tarihi, iletişim bilgisi, izlenimler vb.)"
          rows={5}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800"
        />

        <div className="mt-3 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button size="sm" onClick={() => onSave(text)}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}
