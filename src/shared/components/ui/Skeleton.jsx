import { clsx } from 'clsx'

export function Skeleton({ className, ...props }) {
  return <div className={clsx('skeleton', className)} {...props} />
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}
