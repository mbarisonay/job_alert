import { create } from "zustand";
import type { Job } from "@/features/jobs/types";

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected";

export type Application = {
  id: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt: string;
  note: string;
};

interface JobStore {
  savedJobs: Job[];
  applications: Application[];

  saveJob: (job: Job) => void;
  unsaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;

  applyToJob: (job: Job) => void;
  hasApplied: (jobId: string) => boolean;
  moveApplication: (appId: string, status: ApplicationStatus) => void;
  removeApplication: (appId: string) => void;
  updateNote: (appId: string, note: string) => void;
}

let _id = 0;

export const useJobStore = create<JobStore>((set, get) => ({
  savedJobs: [],
  applications: [],

  saveJob: (job) =>
    set((s) => {
      if (s.savedJobs.some((j) => j.id === job.id)) return s;
      return { savedJobs: [...s.savedJobs, job] };
    }),

  unsaveJob: (jobId) =>
    set((s) => ({
      savedJobs: s.savedJobs.filter((j) => j.id !== jobId),
    })),

  isJobSaved: (jobId) => get().savedJobs.some((j) => j.id === jobId),

  applyToJob: (job) =>
    set((s) => {
      if (s.applications.some((a) => a.job.id === job.id)) return s;
      const app: Application = {
        id: `app-${++_id}`,
        job,
        status: "applied",
        appliedAt: new Date().toISOString(),
        note: "",
      };
      return { applications: [...s.applications, app] };
    }),

  hasApplied: (jobId) => get().applications.some((a) => a.job.id === jobId),

  moveApplication: (appId, status) =>
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === appId ? { ...a, status } : a,
      ),
    })),

  removeApplication: (appId) =>
    set((s) => ({
      applications: s.applications.filter((a) => a.id !== appId),
    })),

  updateNote: (appId, note) =>
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === appId ? { ...a, note } : a,
      ),
    })),
}));
