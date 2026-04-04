export interface Donacion {
  iddonaciones: string;
  fechadonacion: string;
  monto: number;
  estadopago: string;
  metodopago: string;
  usuarios_idusuarios: string | null;
}

export interface CreateDonacionDTO {
  monto: number;
  metodopago: string;
  propositodonacion?: string;
}
