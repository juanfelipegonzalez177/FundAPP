import { NextResponse } from 'next/server';
import { verifyToken } from '@/services/auth.service';
import { getPostulaciones, createPostulacion, updateEstado } from '@/services/voluntario.service';
import { createClient } from '@/lib/supabase/server';

const getUserInfo = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(authHeader.split(' ')[1]);
  }
  return null;
};

export async function GET(req: Request) {
  try {
    const user = getUserInfo(req);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const personaId = user.rol === 'admin' ? undefined : user.id;
    const data = await getPostulaciones(personaId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Obtener la sesión real de la app usando el JWT propio de auth.service.ts
    // (Tu app no usa Supabase Auth nativo para el login, usa personas y jsonwebtoken)
    const user = getUserInfo(req);
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }
    
    // El id del token custom de tu app YA es el idusuarios de la tabla personas/usuarios
    const idUsuarioReal = user.id;

    const body = await req.json();
    const actividades_idactividades = Number(body.actividades_idactividades) || body.actividades_idactividades;
    
    // 4. Buscar en voluntariado.voluntarios usando el id de usuarios.usuarios
    let { data: voluntario } = await supabase
      .schema('voluntariado')
      .from('voluntarios')
      .select('idvoluntarios')
      .eq('usuarios_idusuarios', idUsuarioReal)
      .single();
      
    // 5. Si no existe en voluntarios, crearlo con el SP
    if (!voluntario) {
      const { error: spError } = await supabase.rpc('sp_registrarvoluntario', {
        p_idusuario: idUsuarioReal
      });
      
      if (spError) throw new Error(`Error en el SP: ${spError.message}`);
      
      // Consultamos de nuevo para obtener su nuevo idvoluntarios
      const { data: newV } = await supabase
        .schema('voluntariado')
        .from('voluntarios')
        .select('idvoluntarios')
        .eq('usuarios_idusuarios', idUsuarioReal)
        .single();
        
      if (!newV) throw new Error('No se pudo recuperar el ID del voluntario después de crearlo');
      voluntario = newV;
    }
    
    // 6. Hacer el insert en voluntariado.postulaciones con TODOS los campos requeridos
    const { data, error: insertError } = await supabase
      .schema('voluntariado')
      .from('postulaciones')
      .insert({
        voluntarios_idvoluntarios: voluntario.idvoluntarios,
        voluntarios_usuarios_idusuarios: idUsuarioReal,
        usuarios_idusuarios: idUsuarioReal,
        actividades_idactividades: actividades_idactividades,
        estadopostulacion: 'Pendiente',
        comentario: null
      })
      .select()
      .single();
      
    if (insertError) throw new Error(insertError.message);
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = getUserInfo(req);
    if (!user || user.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const body = await req.json();
    if (!body.id || !body.estado) throw new Error('Faltan datos');

    const data = await updateEstado(body.id, body.estado);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
