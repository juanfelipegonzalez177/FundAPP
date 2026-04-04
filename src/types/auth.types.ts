import { Usuario } from './persona.types';

export interface AuthResponse {
  user: Omit<Usuario, 'contrasena'> & { rol: string };
  token: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  nombrecompleto: string;
  numerodocumento: string;
  email: string;
  password: string;
}
