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
      nombres_apellidos: user?.nombre || '',
      email: user?.email || '',
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <Input
        label="Nombres y Apellidos"
        type="text"
        error={errors.nombres_apellidos?.message}
        readOnly={!!user?.nombre}
        className={user?.nombre ? "opacity-75" : ""}
        {...register('nombres_apellidos', { required: 'Requerido' })}
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
        <span className="absolute left-3 top-9 text-gray-500 font-medium">$</span>
      </div>

      <Input
        label="Correo Electrónico"
        type="email"
        error={errors.email?.message}
        readOnly={!!user?.email}
        className={user?.email ? "opacity-75" : ""}
        {...register('email', { required: 'Requerido' })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Método de Pago</label>
        <select 
          className="flex w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
          {...register('metodo_pago', { required: 'Requerido' })}
        >
          <option value="">Selecciona un método</option>
          <option value="Tarjeta de crédito">Tarjeta de crédito</option>
          <option value="Transferencia">Transferencia</option>
          <option value="PSE">PSE</option>
          <option value="Nequi">Nequi</option>
          <option value="Daviplata">Daviplata</option>
        </select>
        {errors.metodo_pago && <span className="text-xs text-red-500">{errors.metodo_pago.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">¿A quién va dirigida esta donación?</label>
        <textarea
          className="flex w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F] min-h-[100px]"
          placeholder="Escribe un mensaje de apoyo..."
          {...register('descripcion')}
        />
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2" isLoading={submitting}>
        DONAR
      </Button>

      <div className="mt-4 p-4 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 shadow-sm text-center">
        Al confirmar su donación, en el apartado de certificación se le dará un certificado como reconocimiento por ayudar con esta gran causa 😊
      </div>
    </form>
  );
};
