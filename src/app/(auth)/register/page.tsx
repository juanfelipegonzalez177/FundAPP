'use client';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { Card } from '@/components/shared/Card';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-[460px] animate-in fade-in zoom-in duration-300">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">Registro de Voluntario</h1>
        <RegisterForm />
      </Card>
    </div>
  );
}
