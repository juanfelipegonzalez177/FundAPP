'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button } from '@/components/ui';
import { RegisterDTO } from '@/types/auth.types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotif } from '../../context/NotifContext';

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterDTO>();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { notify } = useNotif();

  const onSubmit = async (data: RegisterDTO) => {
    setSubmitting(true);
    setApiError('');
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Error al registrar.');
      
      notify('Registro exitoso. Inicia sesión.', 'success');
      router.push('/login');
    } catch (e: any) {
      setApiError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {apiError && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{apiError}</div>}
      
      <Input
        label="Nombres y Apellidos"
        type="text"
        placeholder="Juan Pérez"
        error={errors.nombrecompleto?.message}
        {...register('nombrecompleto', { required: 'El nombre es requerido' })}
      />

      <Input
        label="Número de Documento (Opcional)"
        type="text"
        placeholder="12345678"
        error={errors.numerodocumento?.message}
        {...register('numerodocumento')}
      />

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="ejemplo@correo.com"
        error={errors.email?.message}
        {...register('email', { required: 'El correo es requerido' })}
      />

      <div className="relative">
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'La contraseña es requerida', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-xs text-gray-500 hover:text-gray-700"
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-4" isLoading={submitting}>
        REGISTRARSE
      </Button>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">¿Ya tienes cuenta? </span>
        <Link href="/login" className="text-sm font-medium text-[#2D6A4F] hover:underline">
          Inicia sesión aquí
        </Link>
      </div>
    </form>
  );
};
