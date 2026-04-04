import { NextResponse } from 'next/server';
import { login, register, verifyToken } from '@/services/auth.service';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const body = await req.json();

    if (action === 'register') {
      const data = await register(body);
      return NextResponse.json(data, { status: 201 });
    } else {
      const data = await login(body);
      return NextResponse.json(data);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    
    const supabase = await createClient();
    const { data: persona } = await supabase.from('personas').select('*').eq('idusuarios', decoded.id).single();
    if (!persona) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    
    const { contrasena, ...safeUser } = persona as any;
    return NextResponse.json({ user: { ...safeUser, rol: decoded.rol } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
