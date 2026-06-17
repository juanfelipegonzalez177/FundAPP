'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { LoginDTO } from '@/types/auth.types';
import Link from 'next/link';

export const LoginForm = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginDTO>();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const onSubmit = async (data: LoginDTO) => {
    setSubmitting(true);
    setApiError('');
    setResendMessage('');
    try {
      await login(data);
    } catch (e: any) {
      setApiError(e.message || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    const email = getValues('email');
    if (!email) {
      setApiError('Por favor introduce tu correo electrónico primero.');
      return;
    }
    setResending(true);
    setResendMessage('');
    setApiError('');
    try {
      const res = await fetch('/api/auth?action=resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al reenviar el correo.');
      }
      setResendMessage('Correo de confirmación reenviado con éxito. Por favor, revisa tu bandeja de entrada.');
    } catch (e: any) {
      setApiError(e.message || 'Error al reenviar el correo.');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {apiError === 'Email not confirmed' ? (
        <div className="text-amber-800 text-sm bg-amber-50 p-4 rounded-lg border border-amber-200 flex flex-col gap-2">
          <p className="font-semibold">⚠️ Correo electrónico no confirmado</p>
          <p>Tu correo electrónico no ha sido verificado. Por favor, revisa tu bandeja de entrada o haz clic abajo para reenviar el correo de confirmación.</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="mt-2 text-left text-xs font-semibold text-amber-700 hover:text-amber-900 underline disabled:opacity-50 transition-colors duration-200"
          >
            {resending ? 'Reenviando...' : 'Reenviar correo de confirmación'}
          </button>
        </div>
      ) : (
        apiError && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {apiError}
          </div>
        )
      )}

      {resendMessage && (
        <div className="text-emerald-800 text-sm bg-emerald-50 p-3 rounded-lg border border-emerald-200">
          ✓ {resendMessage}
        </div>
      )}
      
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
        <Link href="/recovery" className="text-sm font-medium text-primary hover:underline">
          ¿Olvidó su contraseña?
        </Link>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2" isLoading={submitting || isLoading}>
        ENTRAR
      </Button>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
        <Link href="/register" className="text-sm font-medium text-primary hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </form>
  );
};
