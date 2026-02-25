import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import * as profileService from "../services/profile.service";

export async function getProfile(req: AuthRequest, res: Response) {
  const profile = await profileService.getFullProfile(req.user!.userId);
  res.json({ success: true, data: profile });
}

export async function uploadAvatar(req: AuthRequest, res: Response) {
  const file = (req as any).file;
  if (!file) {
    res.status(400).json({ success: false, message: "Dosya yüklenmedi." });
    return;
  }
  const result = await profileService.uploadAvatar(req.user!.userId, file);
  res.json({ success: true, data: result });
}

export async function saveAbout(req: AuthRequest, res: Response) {
  const data = req.body as profileService.UpsertProfileInput;
  const profile = await profileService.upsertProfile(req.user!.userId, data);
  res.json({ success: true, data: profile });
}

// ── Experience ──
export async function createExperience(req: AuthRequest, res: Response) {
  const result = await profileService.addExperience(
    req.user!.userId,
    req.body as profileService.ExperienceInput,
  );
  res.status(201).json({ success: true, data: result });
}

export async function removeExperience(req: AuthRequest, res: Response) {
  await profileService.deleteExperience(req.user!.userId, req.params.id);
  res.json({ success: true });
}

// ── Education ──
export async function createEducation(req: AuthRequest, res: Response) {
  const result = await profileService.addEducation(
    req.user!.userId,
    req.body as profileService.EducationInput,
  );
  res.status(201).json({ success: true, data: result });
}

export async function removeEducation(req: AuthRequest, res: Response) {
  await profileService.deleteEducation(req.user!.userId, req.params.id);
  res.json({ success: true });
}

// ── Language ──
export async function createLanguage(req: AuthRequest, res: Response) {
  const result = await profileService.addLanguage(
    req.user!.userId,
    req.body as profileService.LanguageInput,
  );
  res.status(201).json({ success: true, data: result });
}

export async function removeLanguage(req: AuthRequest, res: Response) {
  await profileService.deleteLanguage(req.user!.userId, req.params.id);
  res.json({ success: true });
}

// ── Project ──
export async function createProject(req: AuthRequest, res: Response) {
  const result = await profileService.addProject(
    req.user!.userId,
    req.body as profileService.ProjectInput,
  );
  res.status(201).json({ success: true, data: result });
}

export async function removeProject(req: AuthRequest, res: Response) {
  await profileService.deleteProject(req.user!.userId, req.params.id);
  res.json({ success: true });
}
