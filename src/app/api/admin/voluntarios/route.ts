import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyToken } from '@/services/auth.service';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user || user.rol !== 'admin') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: volData, error } = await supabase
      .schema('voluntariado')
      .from('voluntarios')
      .select('*');

    if (error) throw error;
    
    // Cross-schema manual join for usuarios
    const userIds = new Set<number>();
    volData?.forEach((v: any) => { if (v.usuarios_idusuarios) userIds.add(v.usuarios_idusuarios); });

    let usuariosMap: any = {};
    if (userIds.size > 0) {
      const { data: usersData } = await supabase.schema('usuarios').from('usuarios').select('*').in('idusuarios', Array.from(userIds));
      if (usersData) {
        usersData.forEach(u => usuariosMap[u.idusuarios] = u);
      }
    }

    const data = volData?.map((v: any) => ({ ...v, usuarios: usuariosMap[v.usuarios_idusuarios] })) || [];
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user || user.rol !== 'admin') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const body = await req.json();
    const { idusuarios, nuevoEstado } = body;
    if (!idusuarios || !nuevoEstado) throw new Error('Faltan datos requeridos (idusuarios, nuevoEstado)');

    const supabase = await createClient();
    const { data, error } = await supabase
      .schema('usuarios')
      .from('usuarios')
      .update({ estadodecuenta: nuevoEstado })
      .eq('idusuarios', idusuarios)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user || user.rol !== 'admin') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID de la tabla voluntarios requerido');

    const supabase = await createClient();
    const { error } = await supabase
      .schema('voluntariado')
      .from('voluntarios')
      .delete()
      .eq('idvoluntarios', id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
