import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useAuthStore } from "@/store/authStore";
import { apiRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { CustomSelect } from "@/components/ui/custom-select";
import { Combobox } from "@/components/ui/combobox";
import { TR_CITIES, TR_UNIVERSITIES } from "@/data/turkey";
import { SKILL_SUGGESTIONS, MAX_SKILLS } from "@/data/skills";
import { toast } from "@/components/ui/toaster";
import { Spinner } from "@/components/ui/spinner";
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

// ─── Types ───
type Experience = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
};

type Education = {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
};

type Lang = {
  id: string;
  name: string;
  proficiency: string;
};

type Project = {
  id: string;
  name: string;
  url: string;
  description: string;
};

const WORK_OPTIONS = ["Remote", "Hybrid", "Ofis"];

const PROFICIENCY_OPTIONS = [
  { value: "Beginner", label: "Başlangıç" },
  { value: "Intermediate", label: "Orta" },
  { value: "Advanced", label: "İleri" },
  { value: "Native", label: "Ana Dil" },
];

let _id = 100;
function uid() {
  return String(++_id);
}

// ─── Shared input classes ───
const INPUT =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100";

// ─── Component ───
export function ProfilePage() {
  const { user } = useAuthStore();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Lang[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [workPrefs, setWorkPrefs] = useState<string[]>([]);
  const [preferredCities, setPreferredCities] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [salary, setSalary] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [modal, setModal] = useState<
    "experience" | "education" | "language" | "project" | null
  >(null);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiRequest<any>("/api/profile", "GET");
      if (data) {
        if (data.experiences) {
          setExperiences(
            data.experiences.map((e: any) => ({
              id: e.id,
              title: e.title,
              company: e.company,
              startDate: e.startDate?.slice(0, 7) ?? "",
              endDate: e.endDate?.slice(0, 7) ?? null,
              isCurrent: e.isCurrent,
              description: e.description ?? "",
            })),
          );
        }
        if (data.educations) {
          setEducations(
            data.educations.map((e: any) => ({
              id: e.id,
              school: e.school,
              degree: e.degree,
              field: e.fieldOfStudy ?? "",
              startYear: e.startDate ? new Date(e.startDate).getFullYear().toString() : "",
              endYear: e.endDate ? new Date(e.endDate).getFullYear().toString() : "",
            })),
          );
        }
        if (data.languages) setLanguages(data.languages);
        if (data.projects) {
          setProjects(
            data.projects.map((p: any) => ({
              id: p.id,
              name: p.name,
              url: p.url ?? "",
              description: p.description ?? "",
            })),
          );
        }
        if (data.profile) {
          setBio(data.profile.bio ?? "");
          setSalary(data.profile.expectedSalary?.toString() ?? "");
          setWorkPrefs(
            data.profile.workPreference
              ? data.profile.workPreference.split(",")
              : [],
          );
          setSkills(data.profile.skills ?? []);
          setLinkedinUrl(data.profile.linkedinUrl ?? "");
          setGithubUrl(data.profile.githubUrl ?? "");
          setPortfolioUrl(data.profile.portfolioUrl ?? "");
          setPreferredCities(
            data.profile.location
              ? data.profile.location.split(",").map((s: string) => s.trim())
              : [],
          );
        }
      }
    } catch {
      // first load may have no profile yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!user) return null;

  const filledSections = [
    bio.length > 0,
    experiences.length > 0,
    educations.length > 0,
    skills.length > 0,
    languages.length > 0,
    linkedinUrl.length > 0 || githubUrl.length > 0,
    projects.length > 0,
  ];
  const completeness = Math.round(
    (filledSections.filter(Boolean).length / filledSections.length) * 100,
  );

  async function handleSaveAbout() {
    setSaving(true);
    try {
      await apiRequest("/api/profile/about", "PUT", {
        bio,
        expectedSalary: salary ? parseInt(salary.replace(/\D/g, ""), 10) : null,
        workPreference: workPrefs.join(","),
        location: preferredCities.join(", "),
        skills,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
      });
      toast.success("Tercihler başarıyla kaydedildi.");
    } catch {
      toast.error("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
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

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Bağlantılar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <LinkInput
                icon={<Linkedin className="h-4 w-4 text-sky-500" />}
                placeholder="linkedin.com/in/..."
                value={linkedinUrl}
                onChange={setLinkedinUrl}
              />
              <LinkInput
                icon={<Github className="h-4 w-4" />}
                placeholder="github.com/..."
                value={githubUrl}
                onChange={setGithubUrl}
              />
              <LinkInput
                icon={<LinkIcon className="h-4 w-4 text-emerald-400" />}
                placeholder="portfolio.dev/..."
                value={portfolioUrl}
                onChange={setPortfolioUrl}
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="pt-4">
              <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                <UploadCloud className="h-8 w-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  CV Yükle (PDF)
                </p>
                <p className="text-xs text-slate-400">AI ile otomatik doldurma</p>
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
                      className={INPUT}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
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
                          className={INPUT}
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                          Çalışma Şekli
                        </label>
                        <Combobox
                          options={WORK_OPTIONS}
                          value=""
                          onChange={() => {}}
                          multiple
                          multipleValues={workPrefs}
                          onMultipleChange={setWorkPrefs}
                          placeholder="Çalışma şekli seçin..."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                          Tercih Edilen Şehirler
                        </label>
                        <Combobox
                          options={TR_CITIES}
                          value=""
                          onChange={() => {}}
                          multiple
                          multipleValues={preferredCities}
                          onMultipleChange={setPreferredCities}
                          placeholder="Şehir seçin..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      disabled={saving}
                      onClick={handleSaveAbout}
                      className="gap-2"
                    >
                      {saving && <Spinner size="sm" />}
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 2: Experience ── */}
            <TabsContent value="experience">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">İş Deneyimi</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setModal("experience")}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Yeni Ekle
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experiences.length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-400">
                      Henüz deneyim eklenmedi.
                    </p>
                  )}
                  {experiences.map((exp) => (
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
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          onClick={async () => {
                            try {
                              await apiRequest(`/api/profile/experiences/${exp.id}`, "DELETE");
                              setExperiences((p) => p.filter((e) => e.id !== exp.id));
                              toast.success("Deneyim silindi.");
                            } catch {
                              toast.error("Silme sırasında hata oluştu.");
                            }
                          }}
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setModal("education")}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Yeni Ekle
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {educations.length === 0 && (
                      <p className="py-6 text-center text-sm text-slate-400">
                        Henüz eğitim eklenmedi.
                      </p>
                    )}
                    {educations.map((edu) => (
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
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          onClick={async () => {
                            try {
                              await apiRequest(`/api/profile/educations/${edu.id}`, "DELETE");
                              setEducations((p) => p.filter((e) => e.id !== edu.id));
                              toast.success("Eğitim silindi.");
                            } catch {
                              toast.error("Silme sırasında hata oluştu.");
                            }
                          }}
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setModal("language")}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Yeni Ekle
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {languages.length === 0 && (
                      <p className="py-4 text-center text-sm text-slate-400">
                        Henüz dil eklenmedi.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {languages.map((lang) => (
                        <div
                          key={lang.id}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
                        >
                          <Languages className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {lang.name}
                          </span>
                          <Badge className="text-[10px]">
                            {lang.proficiency}
                          </Badge>
                          <button
                            type="button"
                            className="ml-1 text-slate-400 hover:text-rose-500 transition-colors"
                            onClick={async () => {
                              try {
                                await apiRequest(`/api/profile/languages/${lang.id}`, "DELETE");
                                setLanguages((p) => p.filter((l) => l.id !== lang.id));
                                toast.success("Dil silindi.");
                              } catch {
                                toast.error("Silme sırasında hata oluştu.");
                              }
                            }}
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
                    {skills.length < MAX_SKILLS ? (
                      <SkillAutocomplete
                        value={skillInput}
                        onChange={setSkillInput}
                        onAdd={(val) => {
                          const parts = val
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s.length > 0);
                          setSkills((prev) => {
                            const next = [...prev];
                            for (const part of parts) {
                              if (
                                !next.includes(part) &&
                                next.length < MAX_SKILLS
                              ) {
                                next.push(part);
                              }
                            }
                            return next;
                          });
                          setSkillInput("");
                        }}
                        existing={skills}
                      />
                    ) : (
                      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
                        Maksimum {MAX_SKILLS} yetenek ekleyebilirsiniz. Yeni
                        eklemek için mevcut bir yeteneği kaldırın.
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} className="gap-1.5 pr-1.5">
                            {skill}
                            <button
                              type="button"
                              onClick={() =>
                                setSkills((p) => p.filter((s) => s !== skill))
                              }
                              className="rounded-full p-0.5 hover:bg-slate-600/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-right text-xs text-slate-400">
                      {skills.length}/{MAX_SKILLS}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">Projeler</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setModal("project")}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Yeni Ekle
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projects.length === 0 && (
                      <p className="py-6 text-center text-sm text-slate-400">
                        Henüz proje eklenmedi.
                      </p>
                    )}
                    {projects.map((proj) => (
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
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          onClick={async () => {
                            try {
                              await apiRequest(`/api/profile/projects/${proj.id}`, "DELETE");
                              setProjects((p) => p.filter((pr) => pr.id !== proj.id));
                              toast.success("Proje silindi.");
                            } catch {
                              toast.error("Silme sırasında hata oluştu.");
                            }
                          }}
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

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* ── Experience Modal ── */}
      <Modal
        open={modal === "experience"}
        onClose={() => setModal(null)}
        title="Yeni Deneyim Ekle"
      >
        <ExperienceForm
          onSave={async (exp) => {
            try {
              const saved = await apiRequest<Experience>(
                "/api/profile/experiences",
                "POST",
                exp,
              );
              setExperiences((p) => [saved, ...p]);
              setModal(null);
              toast.success("Deneyim başarıyla eklendi.");
            } catch {
              toast.error("Deneyim eklenirken hata oluştu.");
            }
          }}
        />
      </Modal>

      {/* ── Education Modal ── */}
      <Modal
        open={modal === "education"}
        onClose={() => setModal(null)}
        title="Yeni Eğitim Ekle"
      >
        <EducationForm
          onSave={async (edu) => {
            try {
              const saved = await apiRequest<any>(
                "/api/profile/educations",
                "POST",
                {
                  school: edu.school,
                  degree: edu.degree,
                  fieldOfStudy: edu.field || null,
                  startDate: edu.startYear ? `${edu.startYear}-01-01` : new Date().toISOString(),
                  endDate: edu.endYear ? `${edu.endYear}-01-01` : null,
                },
              );
              setEducations((p) => [
                {
                  id: saved.id,
                  school: saved.school,
                  degree: saved.degree,
                  field: saved.fieldOfStudy ?? "",
                  startYear: edu.startYear,
                  endYear: edu.endYear,
                },
                ...p,
              ]);
              setModal(null);
              toast.success("Eğitim başarıyla eklendi.");
            } catch {
              toast.error("Eğitim eklenirken hata oluştu.");
            }
          }}
        />
      </Modal>

      {/* ── Language Modal ── */}
      <Modal
        open={modal === "language"}
        onClose={() => setModal(null)}
        title="Yeni Dil Ekle"
      >
        <LanguageForm
          onSave={async (lang) => {
            try {
              const saved = await apiRequest<Lang>(
                "/api/profile/languages",
                "POST",
                lang,
              );
              setLanguages((p) => [...p, saved]);
              setModal(null);
              toast.success("Dil başarıyla eklendi.");
            } catch {
              toast.error("Dil eklenirken hata oluştu.");
            }
          }}
        />
      </Modal>

      {/* ── Project Modal ── */}
      <Modal
        open={modal === "project"}
        onClose={() => setModal(null)}
        title="Yeni Proje Ekle"
      >
        <ProjectForm
          onSave={async (proj) => {
            try {
              const saved = await apiRequest<Project>(
                "/api/profile/projects",
                "POST",
                proj,
              );
              setProjects((p) => [saved, ...p]);
              setModal(null);
              toast.success("Proje başarıyla eklendi.");
            } catch {
              toast.error("Proje eklenirken hata oluştu.");
            }
          }}
        />
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Helper components
// ═══════════════════════════════════════════════

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
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900/60">
      {icon}
      <input
        type="text"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
      />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
      {children}
    </label>
  );
}

// ═══════════════════════════════════════════════
// Modal Forms
// ═══════════════════════════════════════════════

function ExperienceForm({ onSave }: { onSave: (e: Experience) => void | Promise<void> }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !startDate) return;
    setLoading(true);
    try {
      await onSave({
        id: uid(),
        title: title.trim(),
        company: company.trim(),
        startDate,
        endDate: isCurrent ? null : endDate || null,
        isCurrent,
        description: description.trim(),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Pozisyon *</FieldLabel>
          <input
            className={INPUT}
            placeholder="Frontend Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <FieldLabel>Şirket *</FieldLabel>
          <input
            className={INPUT}
            placeholder="Şirket Adı"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Başlangıç *</FieldLabel>
          <input
            type="month"
            className={INPUT}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <FieldLabel>Bitiş</FieldLabel>
          <input
            type="month"
            className={INPUT}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isCurrent}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
        />
        Halen bu pozisyonda çalışıyorum
      </label>

      <div>
        <FieldLabel>Açıklama</FieldLabel>
        <textarea
          rows={3}
          className={INPUT}
          placeholder="Bu pozisyondaki görevleriniz..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="sm" disabled={loading} className="gap-2">
          {loading && <Spinner size="sm" />}
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}

const OTHER_LABEL = "Diğer (Manuel Giriş)";

function EducationForm({ onSave }: { onSave: (e: Education) => void | Promise<void> }) {
  const [school, setSchool] = useState("");
  const [customSchool, setCustomSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [loading, setLoading] = useState(false);

  const isOther = school === OTHER_LABEL;
  const finalSchool = isOther ? customSchool.trim() : school.trim();

  async function handle(e: FormEvent) {
    e.preventDefault();
    if (!finalSchool || !degree.trim()) return;
    setLoading(true);
    try {
      await onSave({
        id: uid(),
        school: finalSchool,
        degree: degree.trim(),
        field: field.trim(),
        startYear,
        endYear,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <FieldLabel>Okul / Üniversite *</FieldLabel>
        <Combobox
          options={[...TR_UNIVERSITIES, OTHER_LABEL]}
          value={school}
          onChange={(val) => {
            setSchool(val);
            if (val !== OTHER_LABEL) setCustomSchool("");
          }}
          placeholder="Üniversite arayın..."
        />
      </div>

      {isOther && (
        <div>
          <FieldLabel>Okul Adını Yazın *</FieldLabel>
          <input
            className={INPUT}
            placeholder="Okul / Kurum adı"
            value={customSchool}
            onChange={(e) => setCustomSchool(e.target.value)}
            autoFocus
            required
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Derece *</FieldLabel>
          <input
            className={INPUT}
            placeholder="Lisans"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
          />
        </div>
        <div>
          <FieldLabel>Bölüm</FieldLabel>
          <input
            className={INPUT}
            placeholder="Bilgisayar Mühendisliği"
            value={field}
            onChange={(e) => setField(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Başlangıç Yılı</FieldLabel>
          <input
            type="number"
            className={INPUT}
            placeholder="2016"
            min={1950}
            max={2030}
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Bitiş Yılı</FieldLabel>
          <input
            type="number"
            className={INPUT}
            placeholder="2020"
            min={1950}
            max={2030}
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="sm" disabled={loading} className="gap-2">
          {loading && <Spinner size="sm" />}
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}

function LanguageForm({ onSave }: { onSave: (l: Lang) => void | Promise<void> }) {
  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState("Intermediate");
  const [loading, setLoading] = useState(false);

  async function handle(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSave({ id: uid(), name: name.trim(), proficiency });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <FieldLabel>Dil *</FieldLabel>
        <input
          className={INPUT}
          placeholder="İngilizce"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <FieldLabel>Seviye</FieldLabel>
        <CustomSelect
          options={PROFICIENCY_OPTIONS}
          value={proficiency}
          onChange={setProficiency}
          placeholder="Seviye seçin"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="sm" disabled={loading} className="gap-2">
          {loading && <Spinner size="sm" />}
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}

function ProjectForm({ onSave }: { onSave: (p: Project) => void | Promise<void> }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSave({
        id: uid(),
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <FieldLabel>Proje Adı *</FieldLabel>
        <input
          className={INPUT}
          placeholder="AI Job Aggregator"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <FieldLabel>URL</FieldLabel>
        <input
          className={INPUT}
          placeholder="https://github.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div>
        <FieldLabel>Açıklama</FieldLabel>
        <textarea
          rows={3}
          className={INPUT}
          placeholder="Projeyi kısaca tanımlayın..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="sm" disabled={loading} className="gap-2">
          {loading && <Spinner size="sm" />}
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════
// Skill Autocomplete
// ═══════════════════════════════════════════════

function SkillAutocomplete({
  value,
  onChange,
  onAdd,
  existing,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: (v: string) => void;
  existing: string[];
}) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions =
    value.trim().length >= 1
      ? SKILL_SUGGESTIONS.filter(
          (s) =>
            s.toLocaleLowerCase("tr").includes(value.toLocaleLowerCase("tr")) &&
            !existing.includes(s),
        ).slice(0, 8)
      : [];

  const showDropdown = focused && suggestions.length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Yetenek ekle... (virgülle ayırarak çoklu ekle)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(value);
              setFocused(false);
            }
          }}
          className={INPUT}
        />
        <Button
          size="sm"
          type="button"
          onClick={() => {
            onAdd(value);
            setFocused(false);
          }}
        >
          Ekle
        </Button>
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onAdd(s);
                setFocused(false);
              }}
              className="flex w-full items-center px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
