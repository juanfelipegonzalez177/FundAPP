export interface Voluntario {
  idvoluntarios: string;
  usuarios_idusuarios: string;
}

export interface Postulacion {
  idpostulaciones: string;
  fechapostulacion: string;
  estadopostulacion: string;
  voluntarios_idvoluntarios: string;
  actividades_idactividades: string;
}

export interface CreatePostulacionDTO {
  actividades_idactividades: string;
}
