'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface TeacherApprovalButtonProps extends ButtonProps {
  teacherId: string;
  action: 'APPROVE' | 'REJECT';
}

export function TeacherApprovalButton({
  teacherId,
  action,
  children,
  ...props
}: TeacherApprovalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/teachers/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const data = await response.json();
      
      toast.success(
        action === 'APPROVE' 
          ? 'Teacher approved successfully!' 
          : 'Teacher application rejected.'
      );
      
      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAction}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
