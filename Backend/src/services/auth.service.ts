import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: {
    id: string;
    email: string;
    name: string;
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
      name: input.name,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: { id: user.id, email: user.email, name: user.name },
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
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
}
