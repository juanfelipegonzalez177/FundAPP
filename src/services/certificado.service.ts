import { createClient } from '@/lib/supabase/server';
import { CreateCertificadoDTO } from '@/types/certificado.types';

export const getCertificados = async (idusuarios?: string) => {
  const supabase = await createClient();
  
  let query = supabase
    .from('certificados')
    .select('*');

  if (idusuarios) {
     const { data: user } = await supabase.from('personas').select('nombrecompleto').eq('idusuarios', idusuarios).single();
     if(user) query = query.eq('nombrevoluntario', user.nombrecompleto);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  return data.map(c => ({
    ...c,
    estado: 'aprobado',
    created_at: new Date().toISOString(),
    tipo_certificado: c.actividadasociada
  }));
};

export const solicitarCertificado = async (idusuarios: string | null, dto: any) => {
  const supabase = await createClient();
  let nombre = 'Usuario Anónimo';
  
  if (idusuarios) {
     const { data: user } = await supabase.from('personas').select('nombrecompleto').eq('idusuarios', idusuarios).single();
     if(user) nombre = user.nombrecompleto;
  }
  
  const { data, error } = await supabase
    .from('certificados')
    .insert([{
      nombrevoluntario: nombre,
      actividadasociada: dto.tipo_certificado || 'Voluntariado General'
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const aprobarCertificado = async (id: string, url: string) => {
  return { success: true };
};

export const rechazarCertificado = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from('certificados').delete().eq('idcertificados', id);
  if (error) throw new Error(error.message);
  return { success: true };
};
