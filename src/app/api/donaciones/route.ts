import { NextResponse } from 'next/server';
import { verifyToken } from '@/services/auth.service';
import { getDonaciones, createDonacion } from '@/services/donacion.service';

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
    const user = getUserInfo(req);
    
    const body = await req.json();
    const data = await createDonacion(user ? user.id : null, body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
