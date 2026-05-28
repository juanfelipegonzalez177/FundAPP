import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyToken } from '@/services/auth.service';
import { getCertificadosByUsuario } from '@/services/certificado.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tipo_documento, numero_documento, tipo } = body;
    
    if (!numero_documento || !tipo_documento || !tipo) {
      return NextResponse.json({ message: 'Faltan datos requeridos.' }, { status: 400 });
    }

    const supabase = await createClient();

    // Paso 1: buscar usuario por numerodocumento + tipodocumento
    const { data: usuario, error: userError } = await supabase
      .schema('usuarios')
      .from('usuarios')
      .select('idusuarios, nombrecompleto')
      .eq('numerodocumento', parseInt(numero_documento, 10))
      .eq('tipodocumento', tipo_documento)
      .single();

    if (userError || !usuario) {
      return NextResponse.json({ message: 'No se encontró un certificado para este documento' }, { status: 404 });
    }

    // Paso 2a: si tipo === 'participacion'
    if (tipo === 'participacion') {
      const { data: voluntarios, error: volError } = await supabase
        .schema('voluntariado')
        .from('voluntarios')
        .select('idvoluntarios')
        .eq('usuarios_idusuarios', usuario.idusuarios)
        .single();
        
      if (volError || !voluntarios) {
        return NextResponse.json({ message: 'No se encontró un certificado para este documento' }, { status: 404 });
      }

      const { data: certificados, error: certError } = await supabase
        .schema('voluntariado')
        .from('certificados')
        .select(`
          *,
          actividades:actividades_idactividades (
             nombreactividad, descripcion, fechainicio, fechafin
          )
        `)
        .eq('voluntarios_idvoluntarios', voluntarios.idvoluntarios)
        .order('idcertificados', { ascending: false })
        .limit(1);

      if (certError || !certificados || certificados.length === 0) {
        return NextResponse.json({ message: 'No se encontró un certificado para este documento' }, { status: 404 });
      }

      const cert = certificados[0];
      const act = Array.isArray(cert.actividades) ? cert.actividades[0] : cert.actividades;

      return NextResponse.json({
        data: {
          tipo: 'voluntariado',
          nombreVoluntario: usuario.nombrecompleto,
          actividad: act?.nombreactividad || cert.actividadasociada || 'Actividad Solidaria',
          fechaInicio: act?.fechainicio || new Date().toISOString(),
          fechaFin: act?.fechafin || new Date().toISOString()
        }
      });
    } 
    // Paso 2b: si tipo === 'donacion'
    else if (tipo === 'donacion') {
      const { data: donaciones, error: donError } = await supabase
        .schema('donaciones')
        .from('donaciones')
        .select(`
          *,
          comprobantes:comprobantes(codigocomprobante)
        `)
        .eq('usuarios_idusuarios', usuario.idusuarios)
        .eq('estadopago', 'Confirmada')
        .order('fechadonacion', { ascending: false })
        .limit(1);

      if (donError || !donaciones || donaciones.length === 0) {
        return NextResponse.json({ message: 'No se encontró un certificado para este documento' }, { status: 404 });
      }

      const donacion = donaciones[0];
      const comp = donacion.comprobantes ? (Array.isArray(donacion.comprobantes) ? donacion.comprobantes[0] : donacion.comprobantes) : null;

      return NextResponse.json({
        data: {
          tipo: 'donacion',
          nombreDonante: usuario.nombrecompleto,
          monto: donacion.monto,
          metodoPago: donacion.metodopago || 'Online',
          fechaDonacion: donacion.fechadonacion,
          codigoComprobante: comp?.codigocomprobante || donacion.iddonaciones || 'N/A'
        }
      });
    } else {
      return NextResponse.json({ message: 'Tipo de certificado inválido' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'No se encontró un certificado para este documento' }, { status: 500 });
  }
}

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
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const certs = await getCertificadosByUsuario(user.id);
    
    // Map certificates to include fallback fields for UI compatibility
    const mappedCerts = certs?.map((c: any) => ({
      ...c,
      estado: 'aprobado',
      created_at: new Date().toISOString(),
    })) || [];

    return NextResponse.json({ certificados: mappedCerts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
