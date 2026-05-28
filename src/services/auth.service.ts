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

  // 1. Iniciar sesión en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: dto.email,
    password: dto.password,
  });

  if (authError) {
    throw new Error(authError.message === 'Invalid login credentials' ? 'Credenciales inválidas' : authError.message);
  }

  // 2. Obtener el perfil del usuario de la base de datos
  const { data: usuario, error: dbError } = await supabase
    .schema('usuarios')
    .from('usuarios')
    .select('*')
    .eq('correo', dto.email)
    .single();

  if (dbError || !usuario) {
    throw new Error('Usuario no registrado en la base de datos de la plataforma');
  }

  // 3. Obtener rol del usuario
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
  
  // 1. Verificar si ya existe en la base de datos
  const { data: existing } = await supabase
    .schema('usuarios')
    .from('usuarios')
    .select('idusuarios')
    .eq('correo', dto.email)
    .single();

  if (existing) throw new Error('El correo ya está registrado');

  // 2. Registrar en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: dto.email,
    password: dto.password,
    options: {
      data: {
        nombrecompleto: dto.nombrecompleto,
        numerodocumento: dto.numerodocumento,
      }
    }
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // 3. Insertar perfil en la tabla de usuarios
  const passwordHash = hashPassword(dto.password);

  const { data: newUser, error: dbError } = await supabase
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

  if (dbError || !newUser) {
    throw new Error(dbError?.message || 'Error al insertar usuario en la base de datos');
  }

  const { contrasena, ...userWithoutPass } = newUser;
  const user = { ...userWithoutPass, rol: 'voluntario', esAdmin: false };
  const token = createToken({ id: user.idusuarios, rol: user.rol, esAdmin: user.esAdmin });

  return { user, token };
};
