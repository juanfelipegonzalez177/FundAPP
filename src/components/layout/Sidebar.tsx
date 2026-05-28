'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-3 ${
      isActive 
        ? 'bg-primary/15 text-primary font-bold shadow-sm' 
        : 'text-text/70 hover:bg-primary/10 hover:text-primary'
    }`;
  };

  return (
    <div className="w-64 bg-surface border-r border-border-custom flex flex-col h-[calc(100vh-80px)] sticky top-[80px] shadow-sm transition-all duration-300 shrink-0">
      <div className="flex flex-col gap-2 p-4 mt-4">
        <span className="text-xs font-bold text-text-muted/65 uppercase tracking-wider px-4 mb-2">Administración</span>
        
        <Link href="/admin" className={getLinkClass('/admin')}>
          📊 Dashboard
        </Link>
        <Link href="/admin/actividades" className={getLinkClass('/admin/actividades')}>
          🌿 Actividades
        </Link>
        <Link href="/admin/voluntarios" className={getLinkClass('/admin/voluntarios')}>
          👥 Voluntarios
        </Link>
        <Link href="/admin/postulaciones" className={getLinkClass('/admin/postulaciones')}>
          📝 Postulaciones
        </Link>
      </div>
    </div>
  );
};
