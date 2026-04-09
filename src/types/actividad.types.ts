export interface Actividad {
  idactividades: string;
  nombreactividad: string;
  descripcion: string | null;
  fechainicio: string;
  fechafin: string | null;
  ubicaciones_idubicaciones: string | null;
  cupo_disponible?: number; // Calculado opcionalmente
}

export interface CreateActividadDTO {
  nombreactividad: string;
  descripcion: string;
  fechainicio: string;
  fechafin?: string;
  cuposdisponibles?: number;
}

export interface UpdateActividadDTO extends Partial<CreateActividadDTO> {}
