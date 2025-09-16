import Link from 'next/link';
import { AlertTriangle, Home, LogIn } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-[#ef4444] mr-2" />
          <h1 className="font-bold text-2xl text-white">Authentication Error</h1>
        </div>

        <p className="text-[#a1a1aa] mb-6">
          There was an issue with your authentication. This might be due to a configuration problem or session timeout.
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#2a2a2a] hover:bg-[#374151] text-white rounded-lg font-medium transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}