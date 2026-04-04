import { NextResponse } from 'next/server';
import { verifyToken } from '@/services/auth.service';
import { getActividades, createActividad, updateActividad, deleteActividad } from '@/services/actividad.service';

const getUserInfo = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(authHeader.split(' ')[1]);
  }
  return null;
};

export async function GET(req: Request) {
  try {
    const data = await getActividades();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserInfo(req);
    if (!user || user.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const body = await req.json();
    const data = await createActividad(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = getUserInfo(req);
    if (!user || user.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID requerido');

    const body = await req.json();
    const data = await updateActividad(id, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = getUserInfo(req);
    if (!user || user.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID requerido');

    await deleteActividad(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
