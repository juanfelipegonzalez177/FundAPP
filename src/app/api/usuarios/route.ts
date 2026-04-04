import { NextResponse } from 'next/server';
import { verifyToken } from '@/services/auth.service';
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
    if (!user || user.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const supabase = await createClient();
    const { data: usuarios, error } = await supabase.from('personas').select('idusuarios, nombrecompleto, correo, telefono, fecharegisto');
    
    if (error) throw new Error(error.message);
    
    return NextResponse.json(usuarios);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = getUserInfo(req);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await req.json();
    const supabase = await createClient();
    
    const idToUpdate = user.rol === 'admin' && body.id ? body.id : user.id;

    const { data, error } = await supabase.from('personas').update({
      telefono: body.telefono,
      direccion: body.direccion
    }).eq('idusuarios', idToUpdate).select().single();

    if (error) throw new Error(error.message);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
