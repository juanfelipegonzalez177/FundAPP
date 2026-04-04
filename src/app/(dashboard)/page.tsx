'use client';
import React from 'react';
import Link from 'next/link';

export default function PublicPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white font-sans animate-in fade-in duration-500">
      
      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-br from-[#0f2a20] via-[#1B4332] to-[#2D6A4F] overflow-hidden">
        {/* Background Decorative patterns */}
        <div className="absolute inset-0 opacity-10">
           <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                 <pattern id="leaf-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M50 15c-15-5-25 10-25 25s10 30 25 35c15-5 25-20 25-35s-10-30-25-25z" fill="currentColor"/>
                 </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#leaf-pattern)"></rect>
           </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-48 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg max-w-4xl font-serif">
            Transformando vidas, un voluntariado a la vez
          </h1>
          <p className="text-lg md:text-2xl text-emerald-100 font-medium mb-10 max-w-2xl leading-relaxed drop-shadow-md">
            Únete a nuestra misión ecosocial. Cada acción cuenta en la construcción de un mundo sostenible y consciente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/actividades" className="px-8 py-4 bg-white text-[#1B4332] rounded-full font-bold text-lg hover:scale-105 hover:bg-emerald-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300">
              Únete como voluntario
            </Link>
            <Link href="/donaciones" className="px-8 py-4 bg-[#2D6A4F] border-2 border-emerald-400 text-white rounded-full font-bold text-lg hover:bg-emerald-600 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-900/50">
              Hacer una donación
            </Link>
          </div>
        </div>
        
        {/* Custom SVG Curve Bottom */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.96,189.92,106.67,243.68,98.24,286.72,67.6,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full -mt-10 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-[#1B4332] rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-1">150+</h2>
              <p className="text-gray-500 font-medium">Voluntarios Activos</p>
           </div>
           
           <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-1">30+</h2>
              <p className="text-gray-500 font-medium">Actividades Realizadas</p>
           </div>
           
           <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-1">$50M</h2>
              <p className="text-gray-500 font-medium">Fondos Donados</p>
           </div>
        </div>
      </section>

      {/* TEMÁTICAS AMBIENTALES */}
      <section className="w-full bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1B4332] mb-4">Nuestras Áreas de Acción</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Intervenimos estratégicamente en ecosistemas vulnerables para restaurar el equilibrio natural y apoyar a las comunidades locales.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-8 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
               <div className="w-14 h-14 bg-white rounded-xl shadow-sm text-emerald-600 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-[#1B4332] mb-3">Conservación de Bosques</h3>
               <p className="text-gray-600 leading-relaxed text-sm">Reforestación, protección de flora local y regeneración de espacios deforestados.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-8 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
               <div className="w-14 h-14 bg-white rounded-xl shadow-sm text-teal-600 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-[#1B4332] mb-3">Limpieza de Ecosistemas Acuáticos</h3>
               <p className="text-gray-600 leading-relaxed text-sm">Organización de brigadas para reducir el plástico y proteger nuestros ríos y playas.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-8 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
               <div className="w-14 h-14 bg-white rounded-xl shadow-sm text-[#1B4332] flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
               </div>
               <h3 className="text-xl font-bold text-[#1B4332] mb-3">Educación Comunitaria</h3>
               <p className="text-gray-600 leading-relaxed text-sm">Enseñamos prácticas sostenibles a comunidades vulnerables para garantizar el futuro verde.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-8 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
               <div className="w-14 h-14 bg-white rounded-xl shadow-sm text-lime-600 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
               </div>
               <h3 className="text-xl font-bold text-[#1B4332] mb-3">Agricultura y Viveros</h3>
               <p className="text-gray-600 leading-relaxed text-sm">Producción de material vegetal en nuestros viveros para su uso en reforestación activa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN MOTIVACIONAL */}
      <section className="w-full bg-[#1B4332] py-24 flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="max-w-4xl px-6 relative z-10">
          <svg className="w-16 h-16 text-emerald-400 opacity-50 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight tracking-tight">Tu tiempo puede cambiar el mundo</h2>
        </div>
      </section>

      {/* CALL TO ACTION ACCESOS RÁPIDOS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Únete a la Causa</h2>
          <p className="text-gray-500">Comienza tu viaje o apoya nuestros proyectos hoy mismo.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* CTA 1 */}
           <Link href="/actividades" className="group block h-full">
              <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 h-full flex flex-col items-center text-center hover:border-[#2D6A4F] hover:shadow-xl hover:shadow-[#2D6A4F]/10 transition-all duration-300">
                 <div className="w-20 h-20 bg-emerald-50 text-[#2D6A4F] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2D6A4F] group-hover:text-white transition-colors duration-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Postúlate</h3>
                 <p className="text-gray-600 mb-6">Regístrate en nuestras actividades de voluntariado y asiste a nuestros eventos.</p>
                 <span className="mt-auto text-[#2D6A4F] font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">Ver Actividades <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
              </div>
           </Link>
           
           {/* CTA 2 */}
           <Link href="/donaciones" className="group block h-full">
              <div className="bg-gradient-to-b from-[#1B4332] to-[#0f2a20] rounded-3xl p-8 h-full flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:shadow-[#1B4332]/30 hover:-translate-y-1 transition-all duration-300">
                 <div className="w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-[#1B4332] transition-colors duration-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">Dar un Aporte</h3>
                 <p className="text-emerald-100/80 mb-6">Tu donación ayuda a financiar herramientas y logística para restaurar los ecosistemas.</p>
                 <span className="mt-auto text-emerald-400 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">Donar Ahora <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
              </div>
           </Link>
           
           {/* CTA 3 */}
           <Link href="/certificados" className="group block h-full">
              <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 h-full flex flex-col items-center text-center hover:border-amber-400 hover:shadow-xl hover:shadow-amber-400/10 transition-all duration-300">
                 <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-400 group-hover:text-white transition-colors duration-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Reconocimiento</h3>
                 <p className="text-gray-600 mb-6">Valida tu trabajo duro expedicionando tu certificado de participación con valor legal.</p>
                 <span className="mt-auto text-amber-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">Ver Certificados <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
              </div>
           </Link>
        </div>
      </section>

      {/* FOOTER BLOCK */}
      <footer className="w-full border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div>
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center text-white font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>
                </div>
                <span className="font-bold text-lg text-[#1B4332]">FundApp</span>
             </div>
             <p className="text-sm text-gray-500 leading-relaxed max-w-xs">Plataforma oficial de Fundación Biosferas para la gestión de proyectos de voluntariado y donaciones.</p>
           </div>
           
           <div>
              <h4 className="font-bold text-gray-900 mb-4">Contacto</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                 <li className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> info@fundacionbiosferas.org</li>
                 <li className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> +57 321 000 0000</li>
                 <li className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Bogotá, Colombia</li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-bold text-gray-900 mb-4">Aviso Legal</h4>
              <p className="text-xs text-gray-400 mb-4">&copy; {new Date().getFullYear()} Fundación Biosferas. Todos los derechos reservados.</p>
              <div className="flex gap-4">
                 <Link href="#" className="text-gray-400 hover:text-[#1B4332]">Privacidad</Link>
                 <Link href="#" className="text-gray-400 hover:text-[#1B4332]">Términos</Link>
              </div>
           </div>
        </div>
      </footer>

    </div>
  );
}
