import { NextResponse } from 'next/server';
import { verifyToken } from '@/services/auth.service';
import { getDonaciones, createDonacion } from '@/services/donacion.service';
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
    const data = await getDonaciones(personaId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const payload = await req.json();

    const montoNum = parseInt(payload.monto, 10);
    if (isNaN(montoNum) || montoNum <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    const metodosPermitidos = ['Efectivo', 'Transferencia', 'Tarjeta Débito', 'Tarjeta Crédito', 'PSE', 'Nequi', 'Daviplata'];
    if (!metodosPermitidos.includes(payload.metodopago)) {
      return NextResponse.json({ error: 'Método de pago inválido' }, { status: 400 });
    }

    const proposito = payload.propositodonacion?.trim() ? payload.propositodonacion : 'Donación general';

    const user = getUserInfo(req);
    let idusuarios = null;

    if (user && user.id) {
      idusuarios = user.id;
    } else {
      if (!payload.correo || !payload.nombrecompleto) {
        return NextResponse.json({ error: 'Faltan datos de identificación para donante invitado' }, { status: 400 });
      }

      const { data: extUser } = await supabase
        .schema('usuarios')
        .from('usuarios')
        .select('idusuarios')
        .eq('correo', payload.correo)
        .single();
      
      if (extUser) {
        idusuarios = extUser.idusuarios;
      } else {
        const docTemp = Math.floor(Date.now() / 1000);
        const { data: newUser, error: errInsert } = await supabase
          .schema('usuarios')
          .from('usuarios')
          .insert([{
            nombrecompleto: payload.nombrecompleto,
            numerodocumento: docTemp,
            tipodocumento: 'CC',
            correo: payload.correo,
            contrasena: 'invitado_sin_contrasena',
            estadodecuenta: 'Activo'
          }])
          .select('idusuarios')
          .single();

        if (errInsert || !newUser) {
          return NextResponse.json({ error: 'Error al registrar donante invitado', details: errInsert }, { status: 500 });
        }
        idusuarios = newUser.idusuarios;
      }
    }

    // Insert en donante
    const { data: donante, error: errDonante } = await supabase
      .schema('donaciones')
      .from('donante')
      .insert([{
        propositodonacion: proposito,
        usuarios_idusuarios: idusuarios
      }])
      .select('idinvitados')
      .single();

    if (errDonante || !donante) {
      return NextResponse.json({ error: 'Error al crear registro de donante', details: errDonante }, { status: 500 });
    }

    // Insert en donaciones
    const { data: donacion, error: errDonacion } = await supabase
      .schema('donaciones')
      .from('donaciones')
      .insert([{
        monto: montoNum,
        metodopago: payload.metodopago,
        anonima: 'No',
        estadopago: 'Confirmada',
        usuarios_idusuarios: idusuarios,
        donante_idinvitados: donante.idinvitados
      }])
      .select('iddonaciones')
      .single();

    if (errDonacion || !donacion) {
      return NextResponse.json({ error: 'Error al procesar la donación', details: errDonacion }, { status: 500 });
    }

    return NextResponse.json({ iddonaciones: donacion.iddonaciones, mensaje: 'Donación procesada correctamente' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
