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

export const useAuth = () => {
  const signUpWithCredentials = async ({
    email,
    password,
    name,
    role,
    callbackUrl = "/dashboard",
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

      // Then sign in the user
      if (redirect) {
        await signIn('credentials', {
          email,
          password,
          redirect: true,
          callbackUrl,
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
      if (redirect) {
        await signIn('credentials', {
          email,
          password,
          redirect: true,
          callbackUrl,
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

  return {
    signUpWithCredentials,
    signInWithCredentials,
  };
}