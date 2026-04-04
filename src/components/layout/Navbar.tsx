'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Read user

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `relative font-medium transition-colors duration-200 ${isActive ? 'text-[#2D6A4F]' : 'text-gray-600 hover:text-[#1B4332]'
      }`;
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[#1B4332]">FundApp</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="/" className={getLinkClass('/')}>Inicio</Link>

              {/* Conditionally reveal if user is logged in */}
              {user && (
                <>
                  <Link href="/actividades" className={getLinkClass('/actividades')}>Postúlate</Link>
                  <Link href="/certificados" className={getLinkClass('/certificados')}>Certificados</Link>
                </>
              )}

              {/* Donaciones always visible */}
              <Link href="/donaciones" className={getLinkClass('/donaciones')}>Hacer Donación</Link>

              {user && (
                <Link href="/perfil" className={getLinkClass('/perfil')}>Mi Perfil</Link>
              )}

              {user?.rol === 'admin' && (
                <Link href="/admin" className={getLinkClass('/admin')}>Panel Admin</Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700 font-medium">Hola, {user.nombrecompleto?.split(' ')[0]}</div>
                <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-[#1B4332] px-3 py-2">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-[#1B4332] text-white px-5 py-2.5 rounded-full hover:bg-[#081c15] hover:shadow-lg hover:shadow-[#1B4332]/20 transition-all">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-[#1B4332] focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2D6A4F] hover:bg-gray-50 rounded-md">Inicio</Link>

            {user && (
              <>
                <Link href="/actividades" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2D6A4F] hover:bg-gray-50 rounded-md">Postúlate</Link>
                <Link href="/certificados" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2D6A4F] hover:bg-gray-50 rounded-md">Certificados</Link>
              </>
            )}

            <Link href="/donaciones" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2D6A4F] hover:bg-gray-50 rounded-md">Donaciones</Link>

            {user && (
              <Link href="/perfil" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2D6A4F] hover:bg-gray-50 rounded-md">Mi Perfil</Link>
            )}

            {!user ? (
              <div className="mt-6 flex flex-col gap-2 px-3">
                <Link href="/login" className="w-full text-center py-2 text-sm font-semibold border border-gray-300 rounded-md text-gray-700">Iniciar Sesión</Link>
                <Link href="/register" className="w-full text-center py-2 text-sm font-semibold bg-[#1B4332] text-white rounded-md">Registrarse</Link>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-2 px-3">
                <button onClick={logout} className="w-full text-center py-2 text-sm font-semibold border border-red-200 text-red-600 rounded-md hover:bg-red-50">Cerrar Sesión</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
