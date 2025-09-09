'use client';

interface PageLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PageLoading({
  message = "Loading...",
  size = 'md'
}: PageLoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f0f]/95 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Spinner */}
        <div className="relative">
          <div
            className={`${sizeClasses[size]} border-4 border-[#4f46e5]/20 rounded-full animate-spin`}
          />
          <div
            className={`${sizeClasses[size]} border-4 border-transparent border-t-[#4f46e5] rounded-full absolute top-0 left-0 animate-spin`}
            style={{ animationDuration: '0.8s' }}
          />
        </div>

        {/* Loading Text */}
        <p className={`${textSizeClasses[size]} text-[#a1a1aa] font-medium animate-pulse`}>
          {message}
        </p>

        {/* Animated Dots */}
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-[#4f46e5] rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}