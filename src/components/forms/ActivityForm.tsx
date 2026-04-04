'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button } from '../ui';
import { CreateActividadDTO } from '@/types/actividad.types';
import { useNotif } from '../../context/NotifContext';

interface ActivityFormProps {
  onSuccess?: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateActividadDTO>();
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useNotif();

  const onSubmit = async (data: CreateActividadDTO) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      notify('Actividad creada exitosamente', 'success');
      reset();
      if (onSuccess) onSuccess();
    } catch {
      notify('Error al crear actividad', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <Input
        label="Nombre de la actividad"
        error={errors.nombre?.message}
        {...register('nombre', { required: 'Requerido' })}
      />
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          className="flex w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F] min-h-[80px]"
          {...register('descripcion')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fecha"
          type="date"
          error={errors.fecha?.message}
          {...register('fecha', { required: 'Requerido' })}
        />
        <Input
          label="Cupo máximo"
          type="number"
          error={errors.cupo_maximo?.message}
          {...register('cupo_maximo', { required: 'Requerido', valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Categoría</label>
        <select 
          className="flex w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
          {...register('categoria', { required: 'Requerido' })}
        >
          <option value="">Selecciona temáticas</option>
          <option value="Conservación y restauración de la biodiversidad">Conservación y restauración de la biodiversidad</option>
          <option value="Sistemas de gobernanza inclusiva, participativa e informada">Sistemas de gobernanza inclusiva, participativa e informada</option>
          <option value="Desarrollo humano y sectorial con enfoque de sostenibilidad">Desarrollo humano y sectorial con enfoque de sostenibilidad</option>
          <option value="Comunicación, educación ambiental y gestión del conocimiento">Comunicación, educación ambiental y gestión del conocimiento</option>
        </select>
        {errors.categoria && <span className="text-xs text-red-500">{errors.categoria.message}</span>}
      </div>

      <Button type="submit" variant="primary" className="mt-4" isLoading={submitting}>
        Guardar Actividad
      </Button>
    </form>
  );
};
