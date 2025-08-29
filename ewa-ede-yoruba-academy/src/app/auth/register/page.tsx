import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Ewa Ede Yoruba Academy',
  description: 'Create a new account to start learning Yoruba',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
