'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../shared/Spinner';

export const AuthGuard = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (adminOnly && user.rol !== 'admin') {
        router.push('/actividades');
      }
    }
  }, [user, isLoading, adminOnly, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  
  if (!user || (adminOnly && user.rol !== 'admin')) return null;

  return <>{children}</>;
};
