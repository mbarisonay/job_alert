import { create } from "zustand";
import type { Job } from "@/features/jobs/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function authHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return {};
    const { token } = JSON.parse(raw) as { token: string };
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export type ApplicationStatus =
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

// Types matching DB records
export type SavedJobRecord = {
  id: string;
  jobId?: string;
  title: string;
  company: string;
  location?: string;
  workModel?: string;
  salary?: string;
  jobUrl?: string;
  savedAt: string;
};

export type JobAppRecord = {
  id: string;
  title: string;
  company: string;
  location?: string;
  jobUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
};

interface JobStore {
  savedJobs: SavedJobRecord[];
  applications: JobAppRecord[];
  
  // Fetch from DB
  fetchSavedJobs: () => Promise<void>;
  fetchApplications: () => Promise<void>;

  // Save
  saveJob: (job: Job) => Promise<void>;
  unsaveJob: (savedJobId: string) => Promise<void>;
  isJobSaved: (jobId: string) => boolean;

  // Apply
  applyToJob: (job: Job) => Promise<void>;
  hasApplied: (title: string, company: string) => boolean;
  moveApplication: (appId: string, status: ApplicationStatus) => Promise<void>;
  removeApplication: (appId: string) => Promise<void>;
  updateNote: (appId: string, notes: string) => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  savedJobs: [],
  applications: [],

  fetchSavedJobs: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/saved`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      set({ savedJobs: data.data || [] });
    } catch { /* silent */ }
  },

  fetchApplications: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/applications`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      set({ applications: data.data || [] });
    } catch { /* silent */ }
  },

  saveJob: async (job) => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          workModel: job.type,
          salary: job.salaryRange,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        set((s) => ({ savedJobs: [data.data, ...s.savedJobs] }));
      }
    } catch { /* handle */ }
  },

  unsaveJob: async (savedJobId) => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/saved/${savedJobId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        set((s) => ({ savedJobs: s.savedJobs.filter((j) => j.id !== savedJobId) }));
      }
    } catch { /* handle */ }
  },

  isJobSaved: (jobId) => get().savedJobs.some((j) => j.jobId === jobId),

  applyToJob: async (job) => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          location: job.location,
          status: "APPLIED",
        }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        set((s) => ({ applications: [data.data, ...s.applications] }));
      }
    } catch { /* handle */ }
  },

  hasApplied: (title, company) => 
    get().applications.some((a) => a.title === title && a.company === company),

  moveApplication: async (appId, status) => {
    // Optimistic update
    const previous = get().applications;
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === appId ? { ...a, status } : a,
      ),
    }));

    try {
      const res = await fetch(`${API_BASE}/api/jobs/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Rollback");
    } catch {
      set({ applications: previous });
    }
  },

  removeApplication: async (appId) => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/applications/${appId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        set((s) => ({ applications: s.applications.filter((a) => a.id !== appId) }));
      }
    } catch { /* handle */ }
  },

  updateNote: async (appId, notes) => {
    // There is no explicit endpoint for just note, maybe we can reuse put or create one.
    // Wait, the status endpoint only updates status.
    // For now we just update it locally, or if needed we can modify the backend to accept notes in updateApplicationStatus (and change its name).
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === appId ? { ...a, notes } : a,
      ),
    }));
  },
}));
