import SigninPage from '@/components/auth/SigninPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Ẹwà Èdè Yorùbá Academy',
  description: 'Sign in to your Ẹwà Èdè Yorùbá Academy account',
};

export default function SignInPage() {
  return <SigninPage />;
}
