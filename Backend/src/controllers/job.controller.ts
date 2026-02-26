import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import * as jobService from "../services/job.service";

// ─── Saved Jobs ───

export async function saveJob(req: AuthRequest, res: Response) {
  const result = await jobService.saveJob(req.user!.userId, req.body);
  res.status(201).json({ success: true, data: result });
}

export async function getSavedJobs(req: AuthRequest, res: Response) {
  const jobs = await jobService.getSavedJobs(req.user!.userId);
  res.json({ success: true, data: jobs });
}

export async function removeSavedJob(req: AuthRequest, res: Response) {
  await jobService.deleteSavedJob(req.user!.userId, req.params.id as string);
  res.json({ success: true });
}

// ─── Job Applications (Tracking) ───

export async function addApplication(req: AuthRequest, res: Response) {
  const result = await jobService.createApplication(req.user!.userId, req.body);
  res.status(201).json({ success: true, data: result });
}

export async function getApplications(req: AuthRequest, res: Response) {
  const apps = await jobService.getApplications(req.user!.userId);
  res.json({ success: true, data: apps });
}

export async function updateApplicationStatus(req: AuthRequest, res: Response) {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, message: "Status gereklidir." });
    return;
  }
  const result = await jobService.updateApplicationStatus(
    req.user!.userId,
    req.params.id as string,
    status,
  );
  res.json({ success: true, data: result });
}

export async function removeApplication(req: AuthRequest, res: Response) {
  await jobService.deleteApplication(req.user!.userId, req.params.id as string);
  res.json({ success: true });
}

// ─── Available Jobs ───
export async function getAvailableJobs(_req: AuthRequest, res: Response) {
  const jobs = await jobService.getAvailableJobs();
  res.json({ success: true, data: jobs });
}
