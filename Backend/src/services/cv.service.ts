import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../config/db";
import { env } from "../config/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// ─── Types ───

export type SectionScore = {
  name: string;
  score: number;
  status: "good" | "warning" | "bad";
  feedback: string;
};

export type AnalysisResult = {
  overallScore: number;
  sections: SectionScore[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

export type RewriteSection = {
  section: string;
  original: string;
  suggested: string;
  explanation: string;
};

export type RewriteResult = {
  sections: RewriteSection[];
  summary: string;
};

// ─── Prompts ───

const ANALYSIS_PROMPT = `
Sen bir profesyonel CV analiz uzmanısın. Sana verilen PDF formatındaki CV'yi detaylı olarak analiz et.

Aşağıdaki bölümleri 0-100 arası puanla ve her biri için kısa bir feedback yaz:
1. Kişisel Bilgiler — İletişim bilgileri, LinkedIn/GitHub linkleri vs.
2. İş Deneyimi — Kronolojik sıralama, görev tanımları, ölçülebilir başarılar
3. Eğitim — Okul, bölüm, GPA veya başarı bilgileri
4. Yetenekler — Teknik ve soft skill'ler, seviye belirtilmiş mi
5. Dil Becerileri — Diller ve seviyeleri
6. Özet / Profil — Profesyonel özet veya kariyer hedefi bölümü
7. ATS Uyumluluğu — Anahtar kelime yoğunluğu, format uygunluğu, tablo/grafik kullanımı

Her bölüm için "status" alanını şöyle belirle:
- score >= 80 → "good"
- score >= 60 → "warning"
- score < 60 → "bad"

Ayrıca:
- "strengths": CV'nin güçlü yönlerini listele (en az 3 madde)
- "weaknesses": CV'nin zayıf yönlerini listele (en az 3 madde)
- "suggestions": Somut iyileştirme önerileri listele (en az 4 madde)
- "overallScore": Tüm bölüm puanlarının ağırlıklı ortalaması (0-100)

SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir metin ekleme:

{
  "overallScore": <number>,
  "sections": [
    { "name": "<bölüm adı>", "score": <number>, "status": "<good|warning|bad>", "feedback": "<kısa feedback>" }
  ],
  "strengths": ["<madde>"],
  "weaknesses": ["<madde>"],
  "suggestions": ["<madde>"]
}
`.trim();

const REWRITE_PROMPT = `
Sen bir profesyonel CV yazarısın. Sana verilen PDF formatındaki CV'yi incele ve bölüm bölüm iyileştirme önerileri sun.

Her bölüm için:
- "section": Bölüm adı (örn: "Profesyonel Özet", "İş Deneyimi - Şirket Adı", "Yetenekler" vb.)
- "original": CV'deki mevcut metin (aynen kopyala, kısaltabilirsin ama anlamı bozma)
- "suggested": İyileştirilmiş, profesyonel versiyon (ölçülebilir başarılar ekle, aksiyon fiilleri kullan, ATS anahtar kelimeleri entegre et)
- "explanation": Neden bu değişikliği önerdiğini kısa açıkla

Kurallar:
- Mevcut bilgileri koru, yeni bilgi UYDURMA. Sadece ifadeleri güçlendir.
- Ölçülebilir başarılar eklerken "[rakam ekleyin]" gibi placeholder kullan, gerçekçi olmayan rakamlar uydurma.
- En az 4, en fazla 8 bölüm öner — sadece iyileştirme potansiyeli olan bölümleri seç.
- Eğer CV'de eksik bir bölüm varsa (örn: profesyonel özet yoksa), "original" alanına "Bu bölüm mevcut CV'de yok" yaz ve önerilen metni sun.
- "summary": Genel bir 2-3 cümlelik özet yaz — CV'nin güçlü yönlerini ve yapılan iyileştirmelerin genel etkisini açıkla.

SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir metin ekleme:

{
  "sections": [
    {
      "section": "<bölüm adı>",
      "original": "<mevcut metin>",
      "suggested": "<önerilen metin>",
      "explanation": "<açıklama>"
    }
  ],
  "summary": "<genel özet>"
}
`.trim();

// ─── Helpers ───

const UPLOADS_DIR = path.join(process.cwd(), "uploads", "cvs");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseGeminiJson<T>(raw: string): T {
  const jsonStr = raw
    .replace(/^```json?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(jsonStr);
}

async function callGemini(pdfBuffer: Buffer, prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBuffer.toString("base64"),
          },
        },
        { text: prompt },
      ],
    });
    return response.text ?? "";
  } catch (err: any) {
    const status = err?.status ?? err?.code;
    const msg = err?.message ?? "";
    console.error("[CV SERVICE] Gemini API error:", status, msg);

    if (status === 429) {
      throw new Error(
        "AI servisi şu an yoğun (rate limit). Lütfen birkaç dakika bekleyip tekrar deneyin.",
      );
    }
    if (status === 401 || status === 403) {
      throw new Error("Gemini API anahtarı geçersiz veya yetkisiz.");
    }
    throw new Error(
      `AI servisine bağlanırken hata oluştu: ${msg || "Bilinmeyen hata"}`,
    );
  }
}

// ─── Upload ───

export async function uploadCv(
  userId: string,
  file: { originalname: string; buffer: Buffer; size: number },
) {
  const userDir = path.join(UPLOADS_DIR, userId);
  ensureDir(userDir);

  const uniqueName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(userDir, uniqueName);
  const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");

  fs.writeFileSync(filePath, file.buffer);

  return prisma.cvUpload.create({
    data: {
      userId,
      fileName: file.originalname,
      filePath: relativePath,
      fileSize: file.size,
    },
  });
}

// ─── List ───

export async function getUserCvs(userId: string) {
  return prisma.cvUpload.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
    select: {
      id: true,
      fileName: true,
      fileSize: true,
      uploadedAt: true,
      analyzedAt: true,
      rewrittenAt: true,
      analysisResult: true,
      rewriteResult: true,
    },
  });
}

// ─── Delete ───

export async function deleteCv(userId: string, cvId: string) {
  const cv = await prisma.cvUpload.findFirst({
    where: { id: cvId, userId },
  });

  if (!cv) throw new Error("CV bulunamadı.");

  const fullPath = path.join(process.cwd(), cv.filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  return prisma.cvUpload.delete({ where: { id: cvId } });
}

// ─── Analyze ───

export async function analyzeCv(userId: string, cvId: string): Promise<AnalysisResult> {
  const cv = await prisma.cvUpload.findFirst({
    where: { id: cvId, userId },
  });
  if (!cv) throw new Error("CV bulunamadı.");

  const fullPath = path.join(process.cwd(), cv.filePath);
  if (!fs.existsSync(fullPath)) throw new Error("CV dosyası bulunamadı.");

  const pdfBuffer = fs.readFileSync(fullPath);
  const raw = await callGemini(pdfBuffer, ANALYSIS_PROMPT);

  let parsed: AnalysisResult;
  try {
    parsed = parseGeminiJson<AnalysisResult>(raw);
  } catch {
    throw new Error("AI yanıtı geçerli bir JSON formatında değil. Lütfen tekrar deneyin.");
  }

  await prisma.cvUpload.update({
    where: { id: cvId },
    data: {
      analysisResult: parsed as any,
      analyzedAt: new Date(),
    },
  });

  return parsed;
}

// ─── Rewrite ───

export async function rewriteCv(userId: string, cvId: string): Promise<RewriteResult> {
  const cv = await prisma.cvUpload.findFirst({
    where: { id: cvId, userId },
  });
  if (!cv) throw new Error("CV bulunamadı.");

  const fullPath = path.join(process.cwd(), cv.filePath);
  if (!fs.existsSync(fullPath)) throw new Error("CV dosyası bulunamadı.");

  const pdfBuffer = fs.readFileSync(fullPath);
  const raw = await callGemini(pdfBuffer, REWRITE_PROMPT);

  let parsed: RewriteResult;
  try {
    parsed = parseGeminiJson<RewriteResult>(raw);
  } catch {
    throw new Error("AI yanıtı geçerli bir JSON formatında değil. Lütfen tekrar deneyin.");
  }

  await prisma.cvUpload.update({
    where: { id: cvId },
    data: {
      rewriteResult: parsed as any,
      rewrittenAt: new Date(),
    },
  });

  return parsed;
}
