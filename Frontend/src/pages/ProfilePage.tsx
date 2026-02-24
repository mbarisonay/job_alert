import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Briefcase,
  Calendar,
  Camera,
  ExternalLink,
  Github,
  GraduationCap,
  Languages,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  User,
  X,
} from "lucide-react";

const DUMMY_SKILLS = ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"];
const DUMMY_EXPERIENCES = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "NovaTech",
    startDate: "2022-01",
    endDate: null,
    isCurrent: true,
    description: "React ve Next.js ile enterprise ürün geliştirme.",
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "PixelWorks",
    startDate: "2020-03",
    endDate: "2022-01",
    isCurrent: false,
    description: "E-ticaret platformu frontend mimarisi.",
  },
];
const DUMMY_EDUCATION = [
  {
    id: "1",
    school: "İstanbul Teknik Üniversitesi",
    degree: "Lisans",
    field: "Bilgisayar Mühendisliği",
    startYear: "2016",
    endYear: "2020",
  },
];
const DUMMY_LANGUAGES = [
  { id: "1", name: "Türkçe", proficiency: "Native" },
  { id: "2", name: "İngilizce", proficiency: "Advanced" },
];
const DUMMY_PROJECTS = [
  {
    id: "1",
    name: "AI Job Aggregator",
    url: "https://github.com/example/job-agg",
    description: "Yapay zeka destekli iş ilanı toplayıcı.",
  },
];

export function ProfilePage() {
  const { user } = useAuthStore();
  const [skills, setSkills] = useState(DUMMY_SKILLS);
  const [skillInput, setSkillInput] = useState("");

  if (!user) return null;

  const completeness = 72;

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-emerald-400" />
        <h1 className="text-xl font-semibold">Profilim</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {/* Avatar & basic */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 ring-2 ring-emerald-400/40">
                  <span className="text-3xl font-semibold text-emerald-400">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white dark:border-slate-950 dark:bg-slate-700"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Senior Frontend Developer
                </p>
              </div>

              <Separator />

              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Profil Tamamlanma
                  </span>
                  <span className="font-medium text-emerald-500">
                    %{completeness}
                  </span>
                </div>
                <Progress value={completeness} />
              </div>
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoLine icon={<Mail className="h-4 w-4" />}>
                {user.email}
              </InfoLine>
              <InfoLine icon={<Phone className="h-4 w-4" />}>
                {user.phone || "Belirtilmedi"}
              </InfoLine>
              <InfoLine icon={<MapPin className="h-4 w-4" />}>
                İstanbul, Türkiye
              </InfoLine>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Bağlantılar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <LinkInput icon={<Linkedin className="h-4 w-4 text-sky-500" />} placeholder="linkedin.com/in/..." />
              <LinkInput icon={<Github className="h-4 w-4" />} placeholder="github.com/..." />
              <LinkInput icon={<LinkIcon className="h-4 w-4 text-emerald-400" />} placeholder="portfolio.dev/..." />
            </CardContent>
          </Card>

          {/* CV upload */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="pt-4">
              <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                <UploadCloud className="h-8 w-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  CV Yükle (PDF)
                </p>
                <p className="text-xs text-slate-400">
                  AI ile otomatik doldurma
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Dosya Seç
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div>
          <Tabs defaultValue="about">
            <TabsList className="flex-wrap">
              <TabsTrigger value="about">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Hakkımda
              </TabsTrigger>
              <TabsTrigger value="experience">
                <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                Deneyim
              </TabsTrigger>
              <TabsTrigger value="education">
                <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                Eğitim & Diller
              </TabsTrigger>
              <TabsTrigger value="skills">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Yetenekler & Projeler
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: About ── */}
            <TabsContent value="about">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base">
                    Hakkımda & Tercihler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kısa Özet / Biyografi
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Kendini kısaca tanıt..."
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                      defaultValue="5+ yıl deneyimli Frontend Developer. React, TypeScript ve modern web teknolojileri konusunda uzmanım."
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      AI Eşleştirme Tercihleri
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                          Beklenen Maaş (₺/ay)
                        </label>
                        <input
                          type="text"
                          placeholder="70.000 ₺"
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                          Çalışma Şekli
                        </label>
                        <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100">
                          <option>Remote</option>
                          <option>Hybrid</option>
                          <option>Ofis</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                          Tercih Edilen Şehirler
                        </label>
                        <input
                          type="text"
                          placeholder="İstanbul, Ankara"
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button size="sm">Kaydet</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 2: Experience ── */}
            <TabsContent value="experience">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">İş Deneyimi</CardTitle>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Yeni Ekle
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {DUMMY_EXPERIENCES.map((exp) => (
                    <div
                      key={exp.id}
                      className="relative rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Briefcase className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {exp.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {exp.company}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <Calendar className="h-3 w-3" />
                              {exp.startDate} –{" "}
                              {exp.isCurrent ? (
                                <Badge variant="success" className="text-[10px]">
                                  Devam ediyor
                                </Badge>
                              ) : (
                                exp.endDate
                              )}
                            </p>
                            {exp.description && (
                              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 3: Education & Languages ── */}
            <TabsContent value="education">
              <div className="space-y-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">Eğitim</CardTitle>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Yeni Ekle
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DUMMY_EDUCATION.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex items-start justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                            <GraduationCap className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {edu.school}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {edu.degree} – {edu.field}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {edu.startYear} – {edu.endYear}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">Diller</CardTitle>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Yeni Ekle
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {DUMMY_LANGUAGES.map((lang) => (
                        <div
                          key={lang.id}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
                        >
                          <Languages className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {lang.name}
                          </span>
                          <Badge className="text-[10px]">{lang.proficiency}</Badge>
                          <button
                            type="button"
                            className="ml-1 text-slate-400 hover:text-rose-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Tab 4: Skills & Projects ── */}
            <TabsContent value="skills">
              <div className="space-y-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-base">Yetenekler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Yetenek ekle... (Enter)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                      />
                      <Button size="sm" onClick={addSkill}>
                        Ekle
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill} className="gap-1.5 pr-1.5">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="rounded-full p-0.5 hover:bg-slate-600/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">Projeler</CardTitle>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Yeni Ekle
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DUMMY_PROJECTS.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex items-start justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {proj.name}
                          </h4>
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-0.5 inline-flex items-center gap-1 text-xs text-emerald-500 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {proj.url}
                            </a>
                          )}
                          {proj.description && (
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                              {proj.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function InfoLine({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
      <span className="text-slate-400">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function LinkInput({
  icon,
  placeholder,
}: {
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900/60">
      {icon}
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
      />
    </div>
  );
}
