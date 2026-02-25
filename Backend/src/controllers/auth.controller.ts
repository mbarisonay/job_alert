import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import * as authService from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw ApiError.badRequest(
      "email, password, firstName ve lastName alanları zorunludur.",
    );
  }

  const result = await authService.register({
    email,
    password,
    firstName,
    lastName,
    phone,
    dateOfBirth,
  });

  res.status(201).json({
    success: true,
    message: "Kayıt başarılı.",
    data: result,
  });
}

export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest("email ve password alanları zorunludur.");
  }

  const result = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: "Giriş başarılı.",
    data: result,
  });
}

export async function updateUserController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const user = await authService.updateUser(req.user!.userId, req.body);
  res.json({ success: true, data: user });
}

export async function changePasswordController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw ApiError.badRequest("oldPassword ve newPassword alanları zorunludur.");
  }

  await authService.changePassword(req.user!.userId, oldPassword, newPassword);
  res.json({ success: true, message: "Şifre başarıyla değiştirildi." });
}

export async function deleteAccountController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { password } = req.body;

  if (!password) {
    throw ApiError.badRequest("Hesap silmek için şifre gereklidir.");
  }

  await authService.deleteAccount(req.user!.userId, password);
  res.json({ success: true, message: "Hesap başarıyla silindi." });
}

