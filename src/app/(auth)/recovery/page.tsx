'use client';
import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Input, Button } from '@/components/ui';
import Link from 'next/link';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  
  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Código enviado a ' + email);
  };

  return (
    <div className="w-full max-w-[460px]">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-center text-[#1A1A1A] mb-4">RECUPERAR CONTRASEÑA</h1>
        <p className="text-center text-sm text-gray-600 mb-6 font-medium">
          Ingresa tu correo electrónico y te enviaremos un código de recuperación
        </p>
        <form onSubmit={handleRecover} className="flex flex-col gap-4 w-full">
          <Input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com" 
            type="email" 
            required 
          />
          <Button type="submit" variant="primary">
            ENVIAR CÓDIGO
          </Button>
          <div className="text-center mt-2">
            <Link href="/login" className="text-sm font-medium text-[#2D6A4F] hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
