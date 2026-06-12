import { cn } from '@/lib/utils'

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center min-h-[300px]', className)}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-brand-border rounded-full" />
        <div className="absolute inset-0 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}
