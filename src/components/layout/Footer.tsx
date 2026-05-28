'use client';
import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface border-t border-border-custom py-16 transition-colors duration-300 mt-auto">
      {/* Subtle top border gradient */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/30 via-secondary/40 to-primary/30 -mt-16 mb-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-text">
                Fundación <span className="text-primary font-sans font-extrabold">Biosferas</span>
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Trabajamos incansablemente por la restauración ecológica y el desarrollo ecosocial sostenible en ecosistemas vulnerables de América Latina.
            </p>
            <div className="text-xs text-text-muted mt-2">
              &copy; {new Date().getFullYear()} Fundación Biosferas.<br/>Todos los derechos reservados.
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-text text-sm uppercase tracking-wider">Enlaces Rápidos</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/actividades" className="text-text-muted hover:text-primary transition-colors">
                  Postulaciones
                </Link>
              </li>
              <li>
                <Link href="/donaciones" className="text-text-muted hover:text-primary transition-colors">
                  Hacer Donación
                </Link>
              </li>
              <li>
                <Link href="/certificados" className="text-text-muted hover:text-primary transition-colors">
                  Certificados
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-text text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@fundacionbiosferas.org</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+57 321 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-surface/50 border border-border-custom hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-surface/50 border border-border-custom hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-surface/50 border border-border-custom hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-text text-sm uppercase tracking-wider">Únete al Boletín</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Recibe actualizaciones semanales sobre proyectos ambientales y nuevas oportunidades de voluntariado.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por suscribirte!'); }} className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 min-w-0 bg-background border border-border-custom text-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/65"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white font-bold text-sm px-4 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-primary/10 cursor-pointer"
              >
                Suscribirme
              </button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
};
