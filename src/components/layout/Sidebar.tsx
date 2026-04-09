import React from 'react';
import Link from 'next/link';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-56px)] sticky top-[56px] shadow-sm">
      <div className="flex flex-col gap-2 p-4 mt-4">
        <span className="text-xs font-bold text-gray-400 uppercase mb-2">Administración</span>
        <Link href="/admin" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">Dashboard</Link>
        <Link href="/admin/actividades" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">Actividades</Link>
        <Link href="/admin/voluntarios" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">Voluntarios</Link>
        <Link href="/admin/postulaciones" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">Postulaciones</Link>
      </div>
    </div>
  );
};
