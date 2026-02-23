import { Briefcase, MapPin, PiggyBank } from 'lucide-react'
import type { Job } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type JobCardProps = {
  job: Job
  isActive?: boolean
  onClick?: () => void
}

function getScoreVariant(score: number): 'success' | 'warning' {
  if (score >= 80) return 'success'
  return 'warning'
}

export function JobCard({ job, isActive, onClick }: JobCardProps) {
  const scoreVariant = getScoreVariant(job.aiScore)

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
      aria-label={`${job.title} - ${job.company}`}
    >
      <Card
        className={`flex gap-3 border-slate-800/70 bg-slate-900/70 transition hover:border-slate-600 hover:bg-slate-900 ${
          isActive ? 'border-slate-500 ring-1 ring-slate-400/40' : ''
        }`}
      >
        <div className="flex h-full items-start justify-center pl-4 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-50">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <CardHeader className="pb-2 pr-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold">
                  {job.title}
                </CardTitle>
                <p className="text-xs text-slate-400">{job.company}</p>
              </div>

              <Badge variant={scoreVariant}>
                {job.aiScore}% Uyumlu
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-wrap items-center gap-3 pb-3 pr-4">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{job.location}</span>
            </div>

            {job.salaryRange && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                <PiggyBank className="h-3.5 w-3.5 text-slate-400" />
                <span>{job.salaryRange}</span>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </button>
  )
}

