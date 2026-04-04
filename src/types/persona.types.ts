export interface Usuario {
  idusuarios: string;
  nombrecompleto: string;
  numerodocumento: string;
  tipodocumento: string | null;
  correo: string;
  contrasena: string;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  estadodecuenta: string | null;
  fecharegisto: string;
}

export type RolType = 'admin' | 'voluntario';
