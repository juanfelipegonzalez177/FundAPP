'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `relative py-2 font-semibold text-sm transition-colors duration-300 ${
      isActive ? 'text-primary' : 'text-text/75 hover:text-primary'
    }`;
  };

  return (
    <nav className="w-full bg-surface/85 backdrop-blur-xl border-b border-border-custom sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold group-hover:rotate-6 transition-transform shadow-md shadow-primary/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-text">
                Fundación <span className="text-primary font-sans font-extrabold">Biosferas</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="/" className={getLinkClass('/')}>
                Inicio
                {pathname === '/' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
              </Link>

              {user && user.rol !== 'admin' && (
                <>
                  <Link href="/actividades" className={getLinkClass('/actividades')}>
                    Postúlate
                    {pathname === '/actividades' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                  </Link>
                  <Link href="/certificados" className={getLinkClass('/certificados')}>
                    Certificados
                    {pathname === '/certificados' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                  </Link>
                  <Link href="/donaciones" className={getLinkClass('/donaciones')}>
                    Hacer Donación
                    {pathname === '/donaciones' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                  </Link>
                </>
              )}

              {!user && (
                <Link href="/donaciones" className={getLinkClass('/donaciones')}>
                  Hacer Donación
                  {pathname === '/donaciones' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                </Link>
              )}

              {user && user.rol !== 'admin' && (
                <Link href="/perfil" className={getLinkClass('/perfil')}>
                  Mi Perfil
                  {pathname === '/perfil' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                </Link>
              )}

              {user?.rol === 'admin' && (
                <Link href="/admin" className={getLinkClass('/admin')}>
                  Panel Admin
                  {pathname?.startsWith('/admin') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface/50 hover:bg-primary/10 border border-border-custom text-text transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-text">Hola, {user.nombrecompleto?.split(' ')[0]}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    user.rol === 'admin'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-border-custom text-text/80'
                  }`}>
                    {user.rol === 'admin' ? 'Administrador' : 'Voluntario'}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="flex items-center gap-2 text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-text/85 hover:text-primary px-3 py-2 transition-colors duration-300">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="text-sm font-bold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu Toggle & Theme Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {/* Theme Toggle Button Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface/50 hover:bg-primary/10 border border-border-custom text-text transition-all duration-300 flex items-center justify-center cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Custom Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-xl text-text hover:bg-primary/10 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full left-0 bg-surface/95 border-b border-border-custom shadow-xl transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-text hover:text-primary hover:bg-primary/10 rounded-xl transition-all">Inicio</Link>

          {user && user.rol !== 'admin' && (
            <>
              <Link href="/actividades" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-text hover:text-primary hover:bg-primary/10 rounded-xl transition-all">Postúlate</Link>
              <Link href="/certificados" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-text hover:text-primary hover:bg-primary/10 rounded-xl transition-all">Certificados</Link>
              <Link href="/donaciones" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-text hover:text-primary hover:bg-primary/10 rounded-xl transition-all">Donaciones</Link>
              <Link href="/perfil" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-text hover:text-primary hover:bg-primary/10 rounded-xl transition-all">Mi Perfil</Link>
            </>
          )}

          {!user && (
            <Link href="/donaciones" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-text hover:text-primary hover:bg-primary/10 rounded-xl transition-all">Donaciones</Link>
          )}

          {user?.rol === 'admin' && (
            <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-text hover:text-primary hover:bg-primary/10 rounded-xl transition-all">Panel Admin</Link>
          )}

          {!user ? (
            <div className="mt-6 flex flex-col gap-2 px-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 text-sm font-bold border border-border-custom rounded-xl text-text hover:bg-primary/10 transition-colors">Iniciar Sesión</Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 text-sm font-bold bg-primary text-white rounded-xl hover:bg-secondary">Registrarse</Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-2 px-3">
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }} 
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-505 hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
