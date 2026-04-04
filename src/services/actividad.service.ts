import { createClient } from '@/lib/supabase/server';
import { CreateActividadDTO, UpdateActividadDTO } from '@/types/actividad.types';

export const getActividades = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('actividades')
    .select('*')
    .order('fechainicio', { ascending: false });

  if (error) throw new Error(error.message);
  return data as any[];
};

export const createActividad = async (dto: CreateActividadDTO) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('actividades')
    .insert(dto as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateActividad = async (id: string, dto: UpdateActividadDTO) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('actividades')
    .update(dto as any)
    .eq('idactividades', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteActividad = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('actividades')
    .delete()
    .eq('idactividades', id);

  if (error) throw new Error(error.message);
  return true;
};