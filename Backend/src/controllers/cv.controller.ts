import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import * as cvService from "../services/cv.service";
import { ApiError } from "../utils/ApiError";

// ─── Upload ───

export async function uploadController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const file = req.file;

  if (!file) {
    throw ApiError.badRequest("PDF dosyası gereklidir.");
  }
  if (file.mimetype !== "application/pdf") {
    throw ApiError.badRequest("Sadece PDF dosyaları kabul edilmektedir.");
  }

  const cv = await cvService.uploadCv(req.user!.userId, {
    originalname: file.originalname,
    buffer: file.buffer,
    size: file.size,
  });

  res.status(201).json({ success: true, data: cv });
}

// ─── List ───

export async function listController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const cvs = await cvService.getUserCvs(req.user!.userId);
  res.json({ success: true, data: cvs });
}

// ─── Delete ───

export async function deleteController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    await cvService.deleteCv(req.user!.userId, req.params.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "CV silinirken hata oluştu.";
    throw ApiError.badRequest(message);
  }
  res.json({ success: true });
}

// ─── Analyze ───

export async function analyzeController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  let result;
  try {
    result = await cvService.analyzeCv(req.user!.userId, req.params.id);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "CV analizi sırasında bir hata oluştu.";
    throw ApiError.badRequest(message);
  }
  res.json({ success: true, data: result });
}

// ─── Rewrite ───

export async function rewriteController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  let result;
  try {
    result = await cvService.rewriteCv(req.user!.userId, req.params.id);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "CV yeniden yazma sırasında bir hata oluştu.";
    throw ApiError.badRequest(message);
  }
  res.json({ success: true, data: result });
}
