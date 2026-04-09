import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!)
      await jwtVerify(token, secret)
    } catch {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}