
import RegisterForm from '@/app/ui/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};


export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[480px] flex-col space-y-2.5 p-4 md:-mt-32">
        <RegisterForm />
      </div>
    </main>
  );
}