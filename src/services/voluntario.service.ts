import { createClient } from '@/lib/supabase/server';
import { CreatePostulacionDTO } from '@/types/voluntario.types';

export const getPostulaciones = async (idusuarios?: string) => {
  const supabase = await createClient();
  let query = supabase
    .schema('voluntariado')
    .from('postulaciones')
    .select(`*, voluntarios!inner(*), actividades(*)`); // Use standard PostgREST join on inner

  if (idusuarios) {
    const { data: vol } = await supabase
      .schema('voluntariado')
      .from('voluntarios')
      .select('idvoluntarios')
      .eq('usuarios_idusuarios', idusuarios)
      .single();

    if (vol) query = query.eq('voluntarios_idvoluntarios', vol.idvoluntarios);
    else return [];
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const createPostulacion = async (idusuarios: string, dto: CreatePostulacionDTO) => {
  const supabase = await createClient();

  let idvoluntarios = '';
  const { data: volExists } = await supabase
    .schema('voluntariado')
    .from('voluntarios')
    .select('idvoluntarios')
    .eq('usuarios_idusuarios', idusuarios)
    .single();

  if (volExists) {
    idvoluntarios = volExists.idvoluntarios;
  } else {
    const { data: newVol, error: errVol } = await supabase
      .schema('voluntariado')
      .from('voluntarios')
      .insert([{ usuarios_idusuarios: idusuarios, usuarios_idusuarios_ref: idusuarios }])
      .select('idvoluntarios')
      .single();
    if (errVol) throw new Error(errVol.message);
    idvoluntarios = newVol.idvoluntarios;
  }

  const { data: existing } = await supabase
    .schema('voluntariado')
    .from('postulaciones')
    .select('idpostulaciones')
    .eq('voluntarios_idvoluntarios', idvoluntarios)
    .eq('actividades_idactividades', dto.actividades_idactividades)
    .single();

  if (existing) throw new Error('Ya estás postulado a esta actividad');

  const { data, error } = await supabase
    .schema('voluntariado')
    .from('postulaciones')
    .insert([{
      voluntarios_idvoluntarios: idvoluntarios,
      voluntarios_usuarios_idusuarios: idusuarios,
      usuarios_idusuarios: idusuarios,
      actividades_idactividades: dto.actividades_idactividades,
      estadopostulacion: 'pendiente'
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateEstado = async (idpostulaciones: string, estadopostulacion: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('voluntariado')
    .from('postulaciones')
    .update({ estadopostulacion })
    .eq('idpostulaciones', idpostulaciones)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
