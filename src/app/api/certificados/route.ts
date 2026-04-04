import { NextResponse } from 'next/server';
import { verifyToken } from '@/services/auth.service';
import { getCertificados, solicitarCertificado, aprobarCertificado, rechazarCertificado } from '@/services/certificado.service';
import { generarCertificadoPDF } from '@/utils/pdf';
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
    const data = await getCertificados(personaId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserInfo(req);
    // Para simplificar, asumiremos que si hay info de usuario sacamos el ID.
    // Si no, personaId default null
    
    const body = await req.json();
    const personaId = user?.id || null;
    const data = await solicitarCertificado(personaId, body);
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

    if (body.estado === 'aprobado') {
      // Necesitamos info para pdf
      const supabase = await createClient();
      const { data: cert } = await supabase.from('certificados').select('*, personas(nombre)').eq('id', body.id).single();
      
      const buffer = generarCertificadoPDF({
        nombre: cert?.personas?.nombre || 'Usuario Desconocido',
        tipo: cert?.tipo_certificado === 'Donación' || cert?.tipo_certificado === 'donacion' ? 'donacion' : 'participacion',
        documento: cert?.numero_documento || 'SN'
      });

      // Dummy upload. En un proyecto real se subiría al storage de supabase.
      // const url = uploadToSupabaseStorage(...)
      const dummyUrl = `data:application/pdf;base64,${buffer.toString('base64')}`;
      
      const data = await aprobarCertificado(body.id, dummyUrl);
      return NextResponse.json(data);
    } else if (body.estado === 'rechazado') {
      const data = await rechazarCertificado(body.id);
      return NextResponse.json(data);
    }
    
    return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
