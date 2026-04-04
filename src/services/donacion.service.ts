import { createClient } from '@/lib/supabase/server';
import { CreateDonacionDTO } from '@/types/donacion.types';

export const getDonaciones = async (idusuarios?: string) => {
  const supabase = await createClient();
  let query = supabase
    .from('donaciones')
    .select('*')
    .order('fechadonacion', { ascending: false });

  if (idusuarios) {
    query = query.eq('usuarios_idusuarios', idusuarios);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const createDonacion = async (idusuarios: string | null, dto: CreateDonacionDTO) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('donaciones')
    .insert([{
      monto: dto.monto,
      metodopago: dto.metodopago,
      estadopago: 'completado',
      usuarios_idusuarios: idusuarios
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (dto.propositodonacion && data) {
    await supabase.from('donante').insert([{ // Requires view 'donante'
      propositodonacion: dto.propositodonacion,
      usuarios_idusuarios: idusuarios
    }]);
  }

  return data;
};
