'use client';

import React, { createContext } from 'react';
import { Usuario } from '@/types/persona.types';
import { LoginDTO, RegisterDTO } from '@/types/auth.types';

export interface AuthContextProps {
  user: Omit<Usuario, 'contrasena'> & { rol: string } | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
