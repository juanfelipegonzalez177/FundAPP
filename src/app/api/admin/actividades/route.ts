import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyToken } from '@/services/auth.service';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user || !user.esAdmin) {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .schema('voluntariado')
      .from('actividades')
      .select('*')
      .order('fechainicio', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
