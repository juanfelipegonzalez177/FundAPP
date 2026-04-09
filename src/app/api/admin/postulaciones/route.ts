import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyToken } from '@/services/auth.service';

function getToken(req: Request) {
  const authHeader = req.headers.get('Authorization');
  return authHeader?.split(' ')[1] ?? null;
}

export async function GET(req: Request) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const user = verifyToken(token);
    if (!user || user.rol !== 'admin') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: pData, error } = await supabase
      .schema('voluntariado')
      .from('postulaciones')
      .select(`
        idpostulaciones,
        fechapostulacion,
        estadopostulacion,
        comentario,
        actividades(*),
        voluntarios(*)
      `)
      .order('fechapostulacion', { ascending: false });

    if (error) throw error;
    
    // Cross-schema manual join for usuarios
    const userIds = new Set<number>();
    pData?.forEach((p: any) => { if (p.voluntarios?.usuarios_idusuarios) userIds.add(p.voluntarios.usuarios_idusuarios); });

    let usuariosMap: any = {};
    if (userIds.size > 0) {
      const { data: usersData } = await supabase.schema('usuarios').from('usuarios').select('idusuarios, nombrecompleto, correo').in('idusuarios', Array.from(userIds));
      if (usersData) {
        usersData.forEach(u => usuariosMap[u.idusuarios] = u);
      }
    }

    const data = pData?.map((p: any) => {
      let v = p.voluntarios || {};
      return {
        ...p,
        voluntarios: {
          ...v,
          usuarios: usuariosMap[v.usuarios_idusuarios]
        }
      }
    }) || [];
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const user = verifyToken(token);
    if (!user || user.rol !== 'admin') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const body = await req.json();
    const { idpostulaciones, nuevoEstado } = body;

    const estadosValidos = ['Aprobada', 'Rechazada', 'Cancelada'];
    if (!idpostulaciones || !estadosValidos.includes(nuevoEstado)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const supabase = await createClient();

    if (nuevoEstado === 'Aprobada') {
      // Call stored procedure — it updates the estado AND generates the certificate
      const { error: spError } = await supabase.schema('voluntariado').rpc('sp_aprobarpostulacion', {
        p_idpostulacion: idpostulaciones,
      });
      if (spError) throw spError;
    } else {
      // For Rechazada / Cancelada — direct update
      const { error: updateError } = await supabase
        .schema('voluntariado')
        .from('postulaciones')
        .update({ estadopostulacion: nuevoEstado })
        .eq('idpostulaciones', idpostulaciones);
      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
