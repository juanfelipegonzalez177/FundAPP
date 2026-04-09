export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  donaciones: {
    Tables: {
      donaciones: {
        Row: { iddonaciones: number, fechadonacion: string, monto: number, estadopago: 'Pendiente'|'Confirmada'|'Rechazada'|'Anulada', metodopago: 'Efectivo'|'Transferencia'|'Tarjeta Débito'|'Tarjeta Crédito'|'PSE'|'Nequi'|'Daviplata', anonima: 'Si'|'No', usuarios_idusuarios: number, donante_idinvitados: number }
        Insert: Partial<{ iddonaciones: number, fechadonacion: string, monto: number, estadopago: 'Pendiente'|'Confirmada'|'Rechazada'|'Anulada', metodopago: 'Efectivo'|'Transferencia'|'Tarjeta Débito'|'Tarjeta Crédito'|'PSE'|'Nequi'|'Daviplata', anonima: 'Si'|'No', usuarios_idusuarios: number, donante_idinvitados: number }>
        Update: Partial<{ iddonaciones: number, fechadonacion: string, monto: number, estadopago: 'Pendiente'|'Confirmada'|'Rechazada'|'Anulada', metodopago: 'Efectivo'|'Transferencia'|'Tarjeta Débito'|'Tarjeta Crédito'|'PSE'|'Nequi'|'Daviplata', anonima: 'Si'|'No', usuarios_idusuarios: number, donante_idinvitados: number }>
      }
      donante: {
        Row: { idinvitados: number, propositodonacion: string, usuarios_idusuarios: number }
        Insert: Partial<{ idinvitados: number, propositodonacion: string, usuarios_idusuarios: number }>
        Update: Partial<{ idinvitados: number, propositodonacion: string, usuarios_idusuarios: number }>
      }
    }
  }
  usuarios: {
    Tables: {
      usuarios: {
        Row: { idusuarios: number, nombrecompleto: string, numerodocumento: number, tipodocumento: string, correo: string, contrasena: string, telefono: string, direccion: string, ciudad: string, estadodecuenta: 'Activo'|'Inactivo'|'Suspendido', fecharegisto: string }
        Insert: Partial<{ idusuarios: number, nombrecompleto: string, numerodocumento: number, tipodocumento: string, correo: string, contrasena: string, telefono: string, direccion: string, ciudad: string, estadodecuenta: 'Activo'|'Inactivo'|'Suspendido', fecharegisto: string }>
        Update: Partial<{ idusuarios: number, nombrecompleto: string, numerodocumento: number, tipodocumento: string, correo: string, contrasena: string, telefono: string, direccion: string, ciudad: string, estadodecuenta: 'Activo'|'Inactivo'|'Suspendido', fecharegisto: string }>
      }
      roles: {
        Row: { idroles: number, nombrerol: string }
        Insert: Partial<{ idroles: number, nombrerol: string }>
        Update: Partial<{ idroles: number, nombrerol: string }>
      }
      roles_has_usuarios: {
        Row: { roles_idroles: number, usuarios_idusuarios: number }
        Insert: Partial<{ roles_idroles: number, usuarios_idusuarios: number }>
        Update: Partial<{ roles_idroles: number, usuarios_idusuarios: number }>
      }
      notificaciones: {
        Row: { idnotificaciones: number, mensaje: string, fechaenvio: string, usuarios_idusuarios: number }
        Insert: Partial<{ idnotificaciones: number, mensaje: string, fechaenvio: string, usuarios_idusuarios: number }>
        Update: Partial<{ idnotificaciones: number, mensaje: string, fechaenvio: string, usuarios_idusuarios: number }>
      }
    }
  }
  voluntariado: {
    Tables: {
      voluntarios: {
        Row: { idvoluntarios: number, usuarios_idusuarios: number, usuarios_idusuarios_ref: number }
        Insert: Partial<{ idvoluntarios: number, usuarios_idusuarios: number, usuarios_idusuarios_ref: number }>
        Update: Partial<{ idvoluntarios: number, usuarios_idusuarios: number, usuarios_idusuarios_ref: number }>
      }
      actividades: {
        Row: { idactividades: number, nombreactividad: string, descripcion: string, fechainicio: string, fechafin: string, ubicaciones_idubicaciones: number }
        Insert: Partial<{ idactividades: number, nombreactividad: string, descripcion: string, fechainicio: string, fechafin: string, ubicaciones_idubicaciones: number }>
        Update: Partial<{ idactividades: number, nombreactividad: string, descripcion: string, fechainicio: string, fechafin: string, ubicaciones_idubicaciones: number }>
      }
      postulaciones: {
        Row: { idpostulaciones: number, fechapostulacion: string, estadopostulacion: string, comentario: string, diasespera: number, voluntarios_idvoluntarios: number, voluntarios_usuarios_idusuarios: number, usuarios_idusuarios: number, actividades_idactividades: number }
        Insert: Partial<{ idpostulaciones: number, fechapostulacion: string, estadopostulacion: string, comentario: string, diasespera: number, voluntarios_idvoluntarios: number, voluntarios_usuarios_idusuarios: number, usuarios_idusuarios: number, actividades_idactividades: number }>
        Update: Partial<{ idpostulaciones: number, fechapostulacion: string, estadopostulacion: string, comentario: string, diasespera: number, voluntarios_idvoluntarios: number, voluntarios_usuarios_idusuarios: number, usuarios_idusuarios: number, actividades_idactividades: number }>
      }
      certificados: {
        Row: { idcertificados: number, nombrevoluntario: string, actividadasociada: string, voluntarios_idvoluntarios: number, voluntarios_usuarios_idusuarios: number, usuarios_idusuarios: number, actividades_idactividades: number }
        Insert: Partial<{ idcertificados: number, nombrevoluntario: string, actividadasociada: string, voluntarios_idvoluntarios: number, voluntarios_usuarios_idusuarios: number, usuarios_idusuarios: number, actividades_idactividades: number }>
        Update: Partial<{ idcertificados: number, nombrevoluntario: string, actividadasociada: string, voluntarios_idvoluntarios: number, voluntarios_usuarios_idusuarios: number, usuarios_idusuarios: number, actividades_idactividades: number }>
      }
    }
  }
  ubicaciones: {
    Tables: {
      ubicaciones: {
        Row: { idubicaciones: number, nombreubicacion: string, direccionubicacion: string, cuposdisponibles: number }
        Insert: Partial<{ idubicaciones: number, nombreubicacion: string, direccionubicacion: string, cuposdisponibles: number }>
        Update: Partial<{ idubicaciones: number, nombreubicacion: string, direccionubicacion: string, cuposdisponibles: number }>
      }
    }
  }
  coordinacion: {
    Tables: {
      coordinadores: {
        Row: { idcoordinadores: number, arearesponsable: string, usuarios_idusuarios: number }
        Insert: Partial<{ idcoordinadores: number, arearesponsable: string, usuarios_idusuarios: number }>
        Update: Partial<{ idcoordinadores: number, arearesponsable: string, usuarios_idusuarios: number }>
      }
    }
  }
  seguridad: {
    Tables: {
      [key: string]: any
    }
  }
  public: {
    Tables: {
      [key: string]: any
    }
  }
}