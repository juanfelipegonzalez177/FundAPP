import { createClient } from '@/lib/supabase/server';

export const getCertificadosByUsuario = async (idusuarios: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('voluntariado')
    .from('certificados')
    .select(`
      *,
      actividades:actividades_idactividades (nombreactividad, fechainicio, fechafin)
    `)
    .eq('usuarios_idusuarios', idusuarios);

  if (error) throw new Error(error.message);
  return data;
};

export const getCertificadosDonacionByUsuario = async (idusuarios: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('donaciones')
    .from('donaciones')
    .select('*')
    .eq('usuarios_idusuarios', idusuarios)
    .eq('estadopago', 'Confirmada');

  if (error) throw new Error(error.message);
  return data;
};

export const validarYObtenerCertificado = async (numerodocumento: number, tipodocumento: string) => {
  const supabase = await createClient();
  // Busca usuario
  const { data: user, error: userError } = await supabase
    .schema('usuarios')
    .from('usuarios')
    .select('*')
    .eq('numerodocumento', numerodocumento)
    .eq('tipodocumento', tipodocumento)
    .eq('estadodecuenta', 'Activo')
    .single();

  if (userError || !user) throw new Error('Usuario no encontrado o inactivo');

  const certificados = await getCertificadosByUsuario(user.idusuarios);
  const donaciones = await getCertificadosDonacionByUsuario(user.idusuarios);

  return { user, certificados, donaciones };
};
