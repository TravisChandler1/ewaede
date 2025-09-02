import SigninPage from '@/components/auth/SigninPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Ewa Ede Yoruba Academy',
  description: 'Sign in to your Ewa Ede Yoruba Academy account',
};

export default function SignInPage() {
  return <SigninPage />;
}
