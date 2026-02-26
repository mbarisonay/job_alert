import { prisma } from "../config/db";

// ─── Saved Jobs ───

export type SavedJobInput = {
  jobId?: string;
  title: string;
  company: string;
  location?: string;
  workModel?: string;
  salary?: string;
  jobUrl?: string;
};

export async function saveJob(userId: string, data: SavedJobInput) {
  // Check if already saved (if jobId exists)
  if (data.jobId) {
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId: data.jobId,
        },
      },
    });
    if (existing) return existing;
  }

  return prisma.savedJob.create({
    data: {
      userId,
      ...data,
    },
  });
}

export async function getSavedJobs(userId: string) {
  return prisma.savedJob.findMany({
    where: { userId },
    orderBy: { savedAt: "desc" },
  });
}

export async function deleteSavedJob(userId: string, id: string) {
  // Ensure the user owns it
  await prisma.savedJob.deleteMany({
    where: {
      id,
      userId,
    },
  });
}

// ─── Job Applications (Tracking) ───

export type JobApplicationInput = {
  title: string;
  company: string;
  location?: string;
  jobUrl?: string;
  status?: string; // e.g. "APPLIED", "INTERVIEW", "OFFER", "REJECTED"
  notes?: string;
  cvId?: string;
};

export async function createApplication(userId: string, data: JobApplicationInput) {
  return prisma.jobApplication.create({
    data: {
      userId,
      ...data,
    },
  });
}

export async function getApplications(userId: string) {
  return prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { appliedAt: "desc" },
  });
}

export async function updateApplicationStatus(
  userId: string,
  id: string,
  status: string,
) {
  // Update only if it belongs to the user
  const app = await prisma.jobApplication.findFirst({
    where: { id, userId },
  });
  if (!app) throw new Error("Başvuru bulunamadı.");

  return prisma.jobApplication.update({
    where: { id },
    data: { status },
  });
}

export async function deleteApplication(userId: string, id: string) {
  await prisma.jobApplication.deleteMany({
    where: { id, userId },
  });
}

// ─── Available Jobs ───

export async function getAvailableJobs() {
  return prisma.job.findMany({
    orderBy: { postedAt: "desc" },
  });
}
