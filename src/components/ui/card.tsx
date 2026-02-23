import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-800 bg-slate-900/60 text-slate-100 shadow-sm',
        className ?? '',
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={cn('flex flex-col gap-1 p-4', className ?? '')} {...props} />
  )
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3
      className={cn(
        'text-base font-semibold leading-tight tracking-tight',
        className ?? '',
      )}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p
      className={cn('text-sm text-slate-400 leading-snug', className ?? '')}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-4 pt-0', className ?? '')} {...props} />
}

