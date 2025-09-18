import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

// Specific skeleton components for different content types
export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
      <Skeleton className="h-12 w-12 rounded-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("bg-gray-200", className)} />
  )
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function ButtonSkeleton() {
  return (
    <Skeleton className="h-10 w-24 rounded-lg" />
  )
}

export function AvatarSkeleton() {
  return (
    <Skeleton className="h-10 w-10 rounded-full" />
  )
}