'use client';
import { LoginForm } from '@/components/forms/LoginForm';
import { Card } from '@/components/shared/Card';

export default function LoginPage() {
  return (
    <div className="w-full max-w-[460px] animate-in fade-in zoom-in duration-300">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">Iniciar Sesión</h1>
        <LoginForm />
      </Card>
    </div>
  );
}
