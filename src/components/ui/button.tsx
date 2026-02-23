import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
  }
>

const baseStyles =
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none'

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-slate-900 text-slate-50 hover:bg-slate-800',
  outline:
    'border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-900/40',
  ghost: 'bg-transparent text-slate-100 hover:bg-slate-800/60',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4',
  lg: 'h-10 px-6 text-base',
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className ?? '')}
      {...props}
    />
  )
}

