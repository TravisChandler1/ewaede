interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ fullScreen = true, className = '' }: LoadingProps) {
  const containerClasses = fullScreen 
    ? 'flex items-center justify-center min-h-[calc(100vh-4rem)]' 
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}
