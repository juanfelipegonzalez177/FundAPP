'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { LoginDTO } from '@/types/auth.types';
import Link from 'next/link';

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDTO>();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: LoginDTO) => {
    setSubmitting(true);
    setApiError('');
    try {
      await login(data);
    } catch (e: any) {
      setApiError(e.message || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {apiError && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{apiError}</div>}
      
      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="ejemplo@correo.com"
        error={errors.email?.message}
        {...register('email', { required: 'El correo es requerido', pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } })}
      />

      <div className="relative">
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'La contraseña es requerida' })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-xs text-gray-500 hover:text-gray-700"
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <div className="flex justify-center mt-2">
        <Link href="/recovery" className="text-sm font-medium text-[#2D6A4F] hover:underline">
          ¿Olvidó su contraseña?
        </Link>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2" isLoading={submitting || isLoading}>
        ENTRAR
      </Button>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
        <Link href="/register" className="text-sm font-medium text-[#2D6A4F] hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </form>
  );
};
