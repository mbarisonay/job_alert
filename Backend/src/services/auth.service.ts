import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    dateOfBirth?: Date | null;
  };
  token: string;
};

const SALT_ROUNDS = 12;

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw ApiError.conflict("Bu e-posta adresi zaten kayıtlı.");
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? undefined,
      dateOfBirth: user.dateOfBirth ?? undefined,
    },
    token,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw ApiError.unauthorized("E-posta veya parola hatalı.");
  }

  const isMatch = await bcrypt.compare(input.password, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized("E-posta veya parola hatalı.");
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? undefined,
      dateOfBirth: user.dateOfBirth ?? undefined,
    },
    token,
  };
}

// ── Update User ──

type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  dateOfBirth?: string | null;
};

export async function updateUser(userId: string, input: UpdateUserInput) {
  const data: Record<string, unknown> = {};

  if (input.firstName !== undefined) data.firstName = input.firstName;
  if (input.lastName !== undefined) data.lastName = input.lastName;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.dateOfBirth !== undefined) {
    data.dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : null;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
    },
  });

  return user;
}

// ── Change Password ──

export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("Kullanıcı bulunamadı.");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw ApiError.unauthorized("Mevcut şifre hatalı.");

  if (newPassword.length < 6) {
    throw ApiError.badRequest("Yeni şifre en az 6 karakter olmalıdır.");
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
}

// ── Delete Account ──

export async function deleteAccount(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("Kullanıcı bulunamadı.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw ApiError.unauthorized("Şifre hatalı.");

  // Cascade delete removes all related records (profile, experiences, etc.)
  await prisma.user.delete({ where: { id: userId } });
}

