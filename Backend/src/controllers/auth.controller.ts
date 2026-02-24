import type { Request, Response } from "express";
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
