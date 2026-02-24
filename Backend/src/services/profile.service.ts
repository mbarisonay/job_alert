import { prisma } from "../config/db";

export async function getFullProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
      profile: true,
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
      projects: true,
      languages: true,
    },
  });
  return user;
}

// ── About / Preferences ──

export type UpsertProfileInput = {
  bio?: string;
  expectedSalary?: number;
  workPreference?: string;
  location?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
};

export async function upsertProfile(userId: string, data: UpsertProfileInput) {
  return prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}

// ── Experience ──

export type ExperienceInput = {
  title: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string;
};

export async function addExperience(userId: string, data: ExperienceInput) {
  return prisma.experience.create({
    data: {
      userId,
      title: data.title,
      company: data.company,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isCurrent: data.isCurrent ?? false,
      description: data.description ?? null,
    },
  });
}

export async function deleteExperience(userId: string, id: string) {
  return prisma.experience.deleteMany({ where: { id, userId } });
}

// ── Education ──

export type EducationInput = {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string | null;
};

export async function addEducation(userId: string, data: EducationInput) {
  return prisma.education.create({
    data: {
      userId,
      school: data.school,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy ?? null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
}

export async function deleteEducation(userId: string, id: string) {
  return prisma.education.deleteMany({ where: { id, userId } });
}

// ── Language ──

export type LanguageInput = {
  name: string;
  proficiency: string;
};

export async function addLanguage(userId: string, data: LanguageInput) {
  return prisma.language.create({
    data: { userId, ...data },
  });
}

export async function deleteLanguage(userId: string, id: string) {
  return prisma.language.deleteMany({ where: { id, userId } });
}

// ── Project ──

export type ProjectInput = {
  name: string;
  url?: string;
  description?: string;
};

export async function addProject(userId: string, data: ProjectInput) {
  return prisma.project.create({
    data: {
      userId,
      name: data.name,
      url: data.url ?? null,
      description: data.description ?? null,
    },
  });
}

export async function deleteProject(userId: string, id: string) {
  return prisma.project.deleteMany({ where: { id, userId } });
}
