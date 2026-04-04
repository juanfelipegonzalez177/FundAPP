'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../shared/Spinner';

export const AuthGuard = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (requireAdmin && user.rol !== 'admin') {
        router.push('/actividades');
      }
    }
  }, [user, isLoading, requireAdmin, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  
  if (!user || (requireAdmin && user.rol !== 'admin')) return null;

  return <>{children}</>;
};
