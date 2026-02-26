import cron from "node-cron";
import { prisma } from "../config/db";

// Dummy jobs to seed the database if it's empty
const DUMMY_JOBS = [
  {
    title: "Senior React Developer",
    company: "TechVista",
    location: "İstanbul, Remote",
    salaryRange: "85.000 – 120.000₺",
    type: "Remote",
    description: "Modern React ve TypeScript kullanarak yeni nesil SaaS platformumuzun frontend mimarisini oluşturacak, component library geliştirip ekibe teknik liderlik yapacak bir Senior Developer arıyoruz.",
    requirements: ["5+ yıl React / TypeScript deneyimi", "State management (Zustand/Redux) tecrübesi", "Design system ve component library deneyimi", "CI/CD ve test otomasyonu bilgisi", "Takım liderliği deneyimi"],
    tags: ["React", "TypeScript", "Zustand", "Tailwind CSS", "Vite"],
    aiScore: 97
  },
  {
    title: "Frontend Architect",
    company: "FinFlow",
    location: "Ankara, Hybrid",
    salaryRange: "100.000 – 140.000₺",
    type: "Hybrid",
    description: "Fintech ürünlerimizin frontend altyapısını tasarlayacak, mikro-frontend mimarisi kuracak ve 8 kişilik frontend takımına teknik yönlendirme sağlayacak bir Frontend Architect arıyoruz.",
    requirements: ["7+ yıl frontend deneyimi", "Mikro-frontend mimarisi bilgisi", "React + TypeScript ustalığı", "Performans optimizasyonu tecrübesi", "Takım mentorlüğü"],
    tags: ["React", "TypeScript", "Micro Frontend", "Performance", "Node.js"],
    aiScore: 93
  },
  {
    title: "Fullstack Developer",
    company: "GreenTech Solutions",
    location: "İstanbul, Remote",
    salaryRange: "70.000 – 100.000₺",
    type: "Remote",
    description: "Sürdürülebilir enerji platformumuzun hem frontend hem backend geliştirmelerini yapacak bir Fullstack Developer arıyoruz.",
    requirements: ["React ve Node.js deneyimi", "PostgreSQL veya MongoDB", "REST API tasarımı", "Docker temel bilgisi", "Agile/Scrum deneyimi"],
    tags: ["React", "Node.js", "PostgreSQL", "Docker", "TypeScript"],
    aiScore: 89
  },
  {
    title: "React Native Developer",
    company: "AppForge",
    location: "İzmir, Ofis",
    salaryRange: "60.000 – 85.000₺",
    type: "Ofis",
    description: "Mobil uygulamamızı React Native ile geliştirmeye devam edecek, yeni özellikler ekleyecek ve performans iyileştirmeleri yapacak bir React Native Developer arıyoruz.",
    requirements: ["2+ yıl React Native deneyimi", "iOS ve Android bilgisi", "TypeScript", "REST API entegrasyonu", "App Store / Play Store yayınlama"],
    tags: ["React Native", "TypeScript", "iOS", "Android", "Firebase"],
    aiScore: 82
  },
  {
    title: "UI/UX Developer",
    company: "Creatify Studio",
    location: "İstanbul, Hybrid",
    salaryRange: "65.000 – 90.000₺",
    type: "Hybrid",
    description: "Design system oluşturma, Figma'dan koda dönüştürme ve animasyon implementasyonu konularında çalışacak, tasarım ve geliştirme arasında köprü olacak bir UI/UX Developer arıyoruz.",
    requirements: ["React ve CSS/Tailwind ileri seviye", "Figma deneyimi", "Animasyon kütüphaneleri (Framer Motion)", "Erişilebilirlik (a11y) bilgisi", "Design token bilgisi"],
    tags: ["React", "Tailwind CSS", "Figma", "Framer Motion", "Design System"],
    aiScore: 78
  },
  {
    title: "DevOps & Platform Engineer",
    company: "CloudScale",
    location: "Remote / Türkiye",
    salaryRange: "$60k – $85k",
    type: "Remote",
    description: "Kubernetes cluster yönetimi, CI/CD pipeline'ları ve altyapı otomasyonu konularında deneyimli bir DevOps Engineer arıyoruz. IaC araçları ile çalışacaksınız.",
    requirements: ["AWS veya GCP sertifikası", "Kubernetes & Helm", "Terraform / Pulumi", "GitHub Actions / GitLab CI", "Monitoring (Datadog / Grafana)"],
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker"],
    aiScore: 58
  }
];

async function runJobMatcher() {
  console.log("[CRON] Running Job Matcher...");
  try {
    // 1. Seed dummy jobs if db is empty
    const jobCount = await prisma.job.count();
    if (jobCount === 0) {
      console.log("[CRON] DB is empty. Seeding dummy jobs...");
      await prisma.job.createMany({ data: DUMMY_JOBS });
      console.log("[CRON] Seeded jobs successfully.");
    }

    // 2. Fetch jobs
    const recentJobs = await prisma.job.findMany({
      orderBy: { postedAt: "desc" },
    });

    // 3. For every user, find matches
    const users = await prisma.user.findMany({
      include: { profile: true }
    });

    for (const user of users) {
      if (!user.profile) continue;

      const skills: string[] = user.profile.skills.map((s: string) => s.toLowerCase());

      for (const job of recentJobs) {
        const jobTagsLower: string[] = job.tags.map((t: string) => t.toLowerCase());
        const matchCount = jobTagsLower.filter((t: string) => skills.includes(t)).length;

        if (matchCount > 0) {
          const existingNotification = await prisma.notification.findFirst({
            where: {
              userId: user.id,
              title: { contains: job.title }
            }
          });

          if (!existingNotification) {
            await prisma.notification.create({
              data: {
                userId: user.id,
                title: `Yeni İş Fırsatı: ${job.title}`,
                message: `${job.company} şirketinde sana uygun olabilecek bir ilan bulduk. Yeteneklerinin bir kısmı (${matchCount} yetenek) bu ilanla eşleşiyor.`,
                type: "JOB_MATCH",
                link: `/dashboard/recommended?jobId=${job.id}`
              }
            });
            console.log(`[CRON] Notification created for User ${user.email} -> Job: ${job.title}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("[CRON] Job Matcher failed:", error);
  }
}

export function startJobMatcherCron() {
  console.log("[CRON] Starting Job Matcher cron service...");

  // Run immediately on startup to populate db and notifications over mocks
  runJobMatcher();

  // Run every 10 minutes
  cron.schedule("*/10 * * * *", () => {
    runJobMatcher();
  });
}
