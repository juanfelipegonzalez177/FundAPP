import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createClient } from '@/lib/supabase/server';
import { LoginDTO, RegisterDTO } from '@/types/auth.types';

function hashSHA256(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export const hashPassword = (password: string) => {
  return hashSHA256(password);
};

export const verifyPasswordHash = (password: string, hash: string) => {
  return hashSHA256(password) === hash;
};

export const createToken = (payload: any) => {
  const secret = process.env.SUPABASE_JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

export const verifyToken = (token: string) => {
  try {
    const secret = process.env.SUPABASE_JWT_SECRET!;
    return jwt.verify(token, secret) as any;
  } catch (error) {
    return null;
  }
};

export const login = async (dto: LoginDTO) => {
  const supabase = await createClient();
  const { data: usuario, error } = await supabase
    .schema('usuarios')
    .from('usuarios')
    .select('*')
    .eq('correo', dto.email)
    .single();

  if (error || !usuario) throw new Error('Credenciales inválidas');

  const isValid = verifyPasswordHash(dto.password, usuario.contrasena);
  if (!isValid) throw new Error('Credenciales inválidas');

  // Obtener rol
  const { data: userRole } = await supabase
    .schema('usuarios')
    .from('roles_has_usuarios')
    .select('roles_idroles')
    .eq('usuarios_idusuarios', usuario.idusuarios)
    .single();

  let rolLiteral = 'voluntario';
  if (userRole) {
     const { data: rolData } = await supabase
       .schema('usuarios')
       .from('roles')
       .select('nombrerol')
       .eq('idroles', userRole.roles_idroles)
       .single();
     if (rolData && rolData.nombrerol === 'Administrador General') {
       rolLiteral = 'admin';
     }
  }

  const { contrasena, ...userWithoutPass } = usuario;
  const user = { ...userWithoutPass, rol: rolLiteral, esAdmin: rolLiteral === 'admin' };
  
  const token = createToken({ id: user.idusuarios, rol: user.rol, esAdmin: user.esAdmin });
  return { user, token };
};

export const register = async (dto: RegisterDTO) => {
  const supabase = await createClient();
  
  const { data: existing } = await supabase
    .schema('usuarios')
    .from('usuarios')
    .select('idusuarios')
    .eq('correo', dto.email)
    .single();

  if (existing) throw new Error('El correo ya está registrado');

  const passwordHash = hashPassword(dto.password);

  const { data: newUser, error } = await supabase
    .schema('usuarios')
    .from('usuarios')
    .insert([{
      nombrecompleto: dto.nombrecompleto,
      numerodocumento: parseInt(dto.numerodocumento, 10) || Date.now(),
      tipodocumento: 'CC',
      correo: dto.email,
      contrasena: passwordHash,
      estadodecuenta: 'Activo'
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  const { contrasena, ...userWithoutPass } = newUser;
  const user = { ...userWithoutPass, rol: 'voluntario', esAdmin: false };
  const token = createToken({ id: user.idusuarios, rol: user.rol, esAdmin: user.esAdmin });

  return { user, token };
};
