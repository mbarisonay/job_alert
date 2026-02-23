import { Search, Sparkles, Zap, Layers3 } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <AppLayout>
      <section className="flex flex-col gap-10 py-4">
        <Hero />
        <BentoGrid />
      </section>
    </AppLayout>
  )
}

function Hero() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
      <Badge className="mx-auto bg-slate-900 text-xs text-slate-300">
        <Sparkles className="mr-1.5 h-3 w-3 text-emerald-400" />
        Yapay zeka destekli iş eşleştirme
      </Badge>

      <div className="space-y-3">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
          Tüm ilanlar, tek yerde.{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            AI ile sana göre sıralanmış.
          </span>
        </h1>
        <p className="text-balance text-sm text-slate-400 sm:text-base">
          Farklı platformlardaki iş ilanlarını topluyor, profilini analiz edip
          her ilan için bir uyum skoru hesaplıyoruz. Sen sadece başvur butonuna
          odaklan.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5 shadow-lg shadow-slate-950/60">
          <Search className="ml-1 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Pozisyon, teknoloji veya şirket ara..."
            className="h-9 flex-1 border-0 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <Link to="/jobs">
            <Button size="sm" className="rounded-full px-4 text-xs">
              İşleri Gör
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          Örnek: &quot;Senior React Developer&quot;, &quot;Remote, AI&quot;,
          &quot;Istanbul, TypeScript&quot;
        </p>
      </div>
    </div>
  )
}

function BentoGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:auto-rows-[180px]">
      <Card className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            AI Uyum Skoru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-300">
            CV&apos;ni ve tercihlerini analiz ederek her ilan için kişiselleştirilmiş
            bir uyum yüzdesi hesaplıyoruz. Böylece &quot;%96 uyumlu&quot; gibi
            etiketlerle zamanını en iyi fırsatlara ayırabiliyorsun.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-2 ring-emerald-400/40">
              <span className="text-lg font-semibold text-emerald-400">
                96%
              </span>
            </div>
            <div className="space-y-1 text-left">
              <p className="text-sm font-medium text-slate-100">
                Senior Frontend Engineer
              </p>
              <p className="text-xs text-slate-400">
                Profiline göre &quot;çok yüksek uyum&quot; olarak işaretlendi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:row-span-2 bg-slate-900/60 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers3 className="h-4 w-4 text-cyan-400" />
            Toplanmış İlanlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-300">
            Farklı job board&apos;lar, şirket kariyer sayfaları ve remote iş
            platformlarından gelen ilanları tek ekranda topluyoruz.
          </p>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Tek arama ile birden fazla kaynağı tarayın.</li>
            <li>• Kopya ilanları otomatik birleştirin.</li>
            <li>• Tarihe ve kaynağa göre filtreleyin.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-amber-400" />
            Hızlı Başvuru Akışı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-300">
            Favori ilanlarını kaydet, tek tıkla başvuru akışını başlat. Profilini
            tekrar tekrar doldurmak zorunda kalma.
          </p>
          <p className="text-xs text-slate-500">
            Yakında: Otomatik CV uyarlama ve kapak mektubu önerileri.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

