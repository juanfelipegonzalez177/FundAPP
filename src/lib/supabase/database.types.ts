export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      personas: {
        Row: {
          idusuarios: string
          nombrecompleto: string
          numerodocumento: string
          tipodocumento: string | null
          correo: string
          contrasena: string
          telefono: string | null
          direccion: string | null
          ciudad: string | null
          estadodecuenta: string | null
          fecharegisto: string
        }
        Insert: Omit<Database['public']['Tables']['personas']['Row'], 'idusuarios' | 'fecharegisto'> & { idusuarios?: string, fecharegisto?: string }
        Update: Partial<Database['public']['Tables']['personas']['Insert']>
      }
      roles: {
        Row: {
          idroles: string
          nombrerol: string
        }
      }
      roles_has_usuarios: {
        Row: {
          roles_idroles: string
          usuarios_idusuarios: string
        }
        Insert: { roles_idroles: string, usuarios_idusuarios: string }
      }
      actividades: {
        Row: {
          idactividades: string
          nombreactividad: string
          descripcion: string | null
          fechainicio: string
          fechafin: string | null
          ubicaciones_idubicaciones: string | null
        }
        Insert: Omit<Database['public']['Tables']['actividades']['Row'], 'idactividades'> & { idactividades?: string }
        Update: Partial<Database['public']['Tables']['actividades']['Insert']>
      }
      voluntarios: {
        Row: {
          idvoluntarios: string
          usuarios_idusuarios: string
        }
        Insert: { idvoluntarios?: string, usuarios_idusuarios: string }
      }
      postulaciones: {
        Row: {
          idpostulaciones: string
          fechapostulacion: string
          estadopostulacion: string
          voluntarios_idvoluntarios: string
          actividades_idactividades: string
        }
        Insert: Omit<Database['public']['Tables']['postulaciones']['Row'], 'idpostulaciones' | 'fechapostulacion'> & { idpostulaciones?: string, fechapostulacion?: string }
        Update: Partial<Database['public']['Tables']['postulaciones']['Insert']>
      }
      certificados: {
        Row: {
          idcertificados: string
          nombrevoluntario: string
          actividadasociada: string
        }
        Insert: Omit<Database['public']['Tables']['certificados']['Row'], 'idcertificados'> & { idcertificados?: string }
        Update: Partial<Database['public']['Tables']['certificados']['Insert']>
      }
      donaciones: {
        Row: {
          iddonaciones: string
          fechadonacion: string
          monto: number
          estadopago: string
          metodopago: string
          usuarios_idusuarios: string | null
        }
        Insert: Omit<Database['public']['Tables']['donaciones']['Row'], 'iddonaciones' | 'fechadonacion'> & { iddonaciones?: string, fechadonacion?: string }
      }
      donante: {
        Row: {
          idinvitados: string
          propositodonacion: string | null
          usuarios_idusuarios: string | null
        }
        Insert: Omit<Database['public']['Tables']['donante']['Row'], 'idinvitados'> & { idinvitados?: string }
      }
    }
  }
}
