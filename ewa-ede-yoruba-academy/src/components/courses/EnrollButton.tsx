'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  price: number;
}

export function EnrollButton({ 
  courseId, 
  isEnrolled, 
  isAuthenticated,
  price
}: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=/courses/${courseId}`);
      return;
    }

    if (isEnrolled) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to enroll in course');
      }

      toast({
        title: 'Enrollment successful!',
        description: 'You have been enrolled in this course.',
      });

      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to enroll in course',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              You are enrolled in this course
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleEnroll}
      disabled={isLoading}
      className="w-full py-6 text-lg font-medium"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : price > 0 ? (
        `Enroll for $${price.toFixed(2)}`
      ) : (
        'Enroll for Free'
      )}
    </Button>
  );
}
