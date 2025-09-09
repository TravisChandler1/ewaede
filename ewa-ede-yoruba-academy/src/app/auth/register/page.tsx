import SimpleRegisterForm from '@/components/auth/SimpleRegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Ẹwà Èdè Yorùbá Academy',
  description: 'Create a new account to start learning Yoruba',
};

export default function RegisterPage() {
  return <SimpleRegisterForm />;
}
