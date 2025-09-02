import { signIn } from '@/auth';

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
  role?: string;
  callbackUrl?: string;
  redirect?: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
  callbackUrl?: string;
  redirect?: boolean;
}

// Helper function to get role-based dashboard URL
const getDashboardUrl = (role?: string): string => {
  if (!role) return '/dashboard';

  switch (role.toUpperCase()) {
    case 'STUDENT':
      return '/dashboard/student';
    case 'TEACHER':
    case 'PENDING_TEACHER':
      return '/dashboard/teacher';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

export interface SignInCredentials {
  email: string;
  password: string;
  callbackUrl?: string;
  redirect?: boolean;
}

export const useAuth = () => {
  const signUpWithCredentials = async ({
    email,
    password,
    name,
    role,
    callbackUrl,
    redirect = true,
  }: SignUpCredentials) => {
    try {
      // First, register the user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || email.split('@')[0], // Use provided name or email prefix as fallback
          email,
          password,
          role: role ? role.toUpperCase() : 'STUDENT', // Convert role to uppercase
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // Determine the correct dashboard URL based on role
      const dashboardUrl = callbackUrl || getDashboardUrl(role);

      // Then sign in the user
      if (redirect) {
        await signIn('credentials', {
          email,
          password,
          redirect: true,
          callbackUrl: dashboardUrl,
        });
        return { success: true };
      } else {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const signInWithCredentials = async ({
    email,
    password,
    callbackUrl = "/dashboard",
    redirect = true,
  }: SignInCredentials) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect,
        callbackUrl,
      });

      if (!redirect && result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    signUpWithCredentials,
    signInWithCredentials,
  };
}