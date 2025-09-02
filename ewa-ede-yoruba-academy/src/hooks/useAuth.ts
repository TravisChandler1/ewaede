import { signIn } from 'next-auth/react';

export interface SignUpCredentials {
  email: string;
  password: string;
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
          name: email.split('@')[0], // Use email prefix as name for now
          email,
          password,
          role: 'STUDENT', // Default role, will be updated based on form data
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