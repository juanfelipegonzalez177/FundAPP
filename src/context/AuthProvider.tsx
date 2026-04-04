'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { Usuario } from '@/types/persona.types';
import { LoginDTO } from '@/types/auth.types';
import { useRouter } from 'next/navigation';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<Usuario, 'contrasena'> & { rol: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await fetch('/api/auth', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginDTO) => {
    const res = await fetch('/api/auth?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const { user, token } = await res.json();
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);

    if (user.rol === 'admin') {
      router.push('/admin'); // Mapeado a la ruta administrativa existente
    } else {
      router.push('/');
    }
  };

  const register = async (data: any) => {
    const res = await fetch('/api/auth?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al registrarse');
    }

    const resData = await res.json();
    setUser(resData.user);
    setToken(resData.token);
    localStorage.setItem('token', resData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
