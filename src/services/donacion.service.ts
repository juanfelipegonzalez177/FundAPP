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

export const createDonacion = async (
  idusuarios: string | null, 
  dto: CreateDonacionDTO
) => {
  const supabase = await createClient();

  // PASO 1: Crear el donante primero
  const { data: donante, error: errorDonante } = await supabase
    .schema('donaciones')
    .from('donante')
    .insert([{
      propositodonacion: dto.propositodonacion || 'Donación voluntaria general',
      usuarios_idusuarios: idusuarios ? parseInt(idusuarios, 10) : null
    }])
    .select()
    .single();

  if (errorDonante) throw new Error(errorDonante.message);

  // PASO 2: Crear la donación con el id del donante
  const { data, error } = await supabase
    .schema('donaciones')
    .from('donaciones')
    .insert([{
      monto: dto.monto,
      metodopago: dto.metodopago as any,
      estadopago: 'Confirmada',         // ✅ valor automático y confirmado
      anonima: 'No',                   // ✅ requerido: 'Si' o 'No'
      usuarios_idusuarios: idusuarios ? parseInt(idusuarios, 10) : null,
      donante_idinvitados: donante.idinvitados  // ✅ FK requerida
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
