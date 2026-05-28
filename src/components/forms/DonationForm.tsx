'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { CreateDonacionDTO } from '@/types/donacion.types';
import { useNotif } from '../../context/NotifContext';

export const DonationForm = () => {
  const { user } = useAuth();
  const { notify } = useNotif();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateDonacionDTO>({
    defaultValues: {
      nombrecompleto: user?.nombrecompleto || '',
      correo: user?.correo || '',
    }
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: CreateDonacionDTO) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/donaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al donar');
      notify('¡Donación exitosa! Muchas gracias por tu ayuda.', 'success');
      reset();
    } catch {
      notify('Hubo un error al procesar tu donación.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full text-text">
      <Input
        label="Nombres y Apellidos"
        type="text"
        error={errors.nombrecompleto?.message as any}
        readOnly={!!user?.nombrecompleto}
        className={user?.nombrecompleto ? "opacity-60 bg-surface/50 cursor-not-allowed" : ""}
        {...register('nombrecompleto' as any, { required: 'Requerido' })}
      />

      <div className="relative">
        <Input
          label="Monto a Donar"
          type="number"
          placeholder="0"
          className="pl-8"
          error={errors.monto?.message}
          {...register('monto', { required: 'Requerido', min: { value: 1000, message: 'Mínimo $1000' } })}
        />
        <span className="absolute left-4.5 top-[39px] text-text-muted font-semibold text-sm">$</span>
      </div>

      <Input
        label="Correo Electrónico"
        type="email"
        error={errors.correo?.message as any}
        readOnly={!!user?.correo}
        className={user?.correo ? "opacity-60 bg-surface/50 cursor-not-allowed" : ""}
        {...register('correo' as any, { required: 'Requerido' })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text/85">Método de Pago</label>
        <select 
          className="flex w-full rounded-xl border border-border-custom bg-surface text-text px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          {...register('metodopago' as any, { required: 'Requerido' })}
        >
          <option value="" className="bg-surface text-text">Selecciona un método</option>
          <option value="Tarjeta Crédito" className="bg-surface text-text">Tarjeta Crédito</option>
          <option value="Transferencia" className="bg-surface text-text">Transferencia</option>
          <option value="PSE" className="bg-surface text-text">PSE</option>
          <option value="Nequi" className="bg-surface text-text">Nequi</option>
          <option value="Daviplata" className="bg-surface text-text">Daviplata</option>
        </select>
        {errors.metodopago && <span className="text-xs text-red-500 font-medium">{errors.metodopago.message as any}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text/85">¿A quién va dirigida esta donación?</label>
        <textarea
          className="flex w-full rounded-xl border border-border-custom bg-surface text-text px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px]"
          placeholder="Escribe un mensaje de apoyo..."
          {...register('propositodonacion' as any)}
        />
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2 cursor-pointer shadow-sm" isLoading={submitting}>
        DONAR AHORA
      </Button>

      <div className="mt-4 p-4 border border-border-custom bg-primary/5 dark:bg-primary/10 rounded-2xl text-xs text-text-muted/90 shadow-sm text-center leading-relaxed font-semibold">
        Al confirmar tu donación, recibirás un certificado de donación electrónico oficial como reconocimiento por apoyar nuestra gran causa ecosocial. 😊
      </div>
    </form>
  );
};
