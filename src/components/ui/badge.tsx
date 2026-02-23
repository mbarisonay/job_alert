import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700/80',
  success:
    'border-transparent bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/40',
  warning:
    'border-transparent bg-amber-500/10 text-amber-400 ring-1 ring-amber-400/40',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className ?? '',
      )}
      {...props}
    />
  )
}

