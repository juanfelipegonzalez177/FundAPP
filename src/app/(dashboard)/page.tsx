'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Users, Calendar, Heart, ArrowRight, TreePine, Droplet, BookOpen, Sprout, Sparkles, Award } from 'lucide-react';

// Counter Component for Animated Statistics
const Counter = ({ target, suffix = '', prefix = '', decimals = 0 }: { target: number; suffix?: string; prefix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / 2000, 1);
            setCount(progress * target);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [target]);

  return <span ref={elementRef}>{prefix}{count.toFixed(decimals)}{suffix}</span>;
};

// Typewriter Component for Dynamic Hero Text
const Typewriter = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullWord = words[currentWordIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(prev => prev.slice(0, -1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullWord.slice(0, currentText.length + 1));
      }, 80);
    }

    if (!isDeleting && currentText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="text-secondary font-extrabold border-r-4 border-accent pr-1.5 animate-pulse font-sans">
      {currentText}
    </span>
  );
};

export default function PublicPage() {
  const [stats, setStats] = useState({ totalVoluntarios: 47, actividadesActivas: 14, montoTotal: 1800000 });

  // Fetch public stats on load
  useEffect(() => {
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats({
            totalVoluntarios: typeof data.totalVoluntarios === 'number' ? data.totalVoluntarios : 47,
            actividadesActivas: typeof data.actividadesActivas === 'number' ? data.actividadesActivas : 14,
            montoTotal: typeof data.montoTotal === 'number' ? data.montoTotal : 1800000
          });
        }
      })
      .catch(err => console.error('Error fetching public stats:', err));
  }, []);

  // Format funds dynamically based on amount
  const getFundsConfig = (monto: number) => {
    if (monto >= 1000000) {
      return { target: monto / 1000000, decimals: 1, suffix: 'M' };
    } else if (monto >= 1000) {
      return { target: monto / 1000, decimals: 0, suffix: 'K' };
    } else {
      return { target: monto, decimals: 0, suffix: '' };
    }
  };

  const fundsConfig = getFundsConfig(stats.montoTotal);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const targets = document.querySelectorAll('.reveal');
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);


  return (
    <div className="flex flex-col w-full min-h-screen font-sans overflow-hidden bg-background text-text">
      
      {/* 🏠 HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-background overflow-hidden py-20">
        {/* Dynamic Forest Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070')` }}
        />
        {/* Modern dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-background/95 via-background/60 to-background/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D1F17]/40 to-background" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center z-10">
          
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-secondary text-sm font-semibold mb-6 animate-bounce shadow-sm">
            <Sparkles className="w-4 h-4" /> Plataforma Ecosocial de Voluntariado y Donaciones
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-md max-w-5xl font-display leading-tight">
            Transformando vidas para <br className="hidden sm:inline" />
            <Typewriter words={['conservar bosques', 'limpiar ecosistemas', 'educar comunidades', 'sembrar futuro']} />
          </h1>

          <p className="text-lg md:text-2xl text-emerald-100/90 font-medium mb-12 max-w-3xl leading-relaxed drop-shadow-sm">
            Únete a nuestra misión. Cada acción cuenta en la construcción de un mundo sostenible, resiliente y consciente.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/actividades" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-secondary hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
              Únete como voluntario <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link href="/donaciones" className="inline-flex items-center justify-center px-8 py-4 bg-surface/10 border-2 border-white/20 text-white rounded-2xl font-bold text-lg backdrop-blur-md hover:bg-surface/20 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer">
              Hacer una donación
            </Link>
          </div>

          {/* Animated Scroll Down Arrow */}
          <div className="absolute bottom-6 flex flex-col items-center justify-center animate-bounce opacity-70">
            <span className="text-xs uppercase tracking-widest text-emerald-100 font-bold mb-2">Explorar</span>
            <svg className="w-6 h-6 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* 📊 STATS SECTION (Glassmorphism) */}
      <section className="relative max-w-7xl mx-auto px-6 py-10 w-full -mt-16 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Card 1: Voluntarios */}
           <div className="bg-surface/65 backdrop-blur-xl border border-border-custom rounded-3xl p-8 shadow-xl hover:-translate-y-2.5 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4.5 shadow-sm">
                 <Users className="w-7 h-7" />
              </div>
              <h2 className="text-5xl font-extrabold text-text mb-1 tracking-tight">
                <Counter target={stats.totalVoluntarios} />
              </h2>
              <p className="text-text-muted font-bold text-sm tracking-wide uppercase">Voluntarios Activos</p>
           </div>
           
           {/* Card 2: Actividades */}
           <div className="bg-surface/65 backdrop-blur-xl border border-border-custom rounded-3xl p-8 shadow-xl hover:-translate-y-2.5 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl flex items-center justify-center mb-4.5 shadow-sm">
                 <Calendar className="w-7 h-7" />
              </div>
              <h2 className="text-5xl font-extrabold text-text mb-1 tracking-tight">
                <Counter target={stats.actividadesActivas} />
              </h2>
              <p className="text-text-muted font-bold text-sm tracking-wide uppercase">Actividades Disponibles</p>
           </div>
           
           {/* Card 3: Fondos */}
           <div className="bg-surface/65 backdrop-blur-xl border border-border-custom rounded-3xl p-8 shadow-xl hover:-translate-y-2.5 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-accent/10 border border-accent/20 text-accent rounded-2xl flex items-center justify-center mb-4.5 shadow-sm">
                 <Heart className="w-7 h-7" />
              </div>
              <h2 className="text-5xl font-extrabold text-text mb-1 tracking-tight">
                <Counter target={fundsConfig.target} decimals={fundsConfig.decimals} prefix="$" suffix={fundsConfig.suffix} />
              </h2>
              <p className="text-text-muted font-bold text-sm tracking-wide uppercase">Fondos Recaudados</p>
           </div>

        </div>
      </section>

      {/* 🌿 AREAS DE ACCIÓN SECTION */}
      <section className="w-full py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-20 reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-text font-display mb-4">Nuestras Áreas de Acción</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Intervenimos de manera estratégica en ecosistemas vulnerables para restaurar el equilibrio de la naturaleza y apoyar a las comunidades locales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1 */}
            <div className="group relative bg-surface border border-border-custom rounded-3xl p-8 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 reveal">
               <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                 <TreePine className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-text mb-3 font-display">Conservación de Bosques</h3>
               <p className="text-text-muted leading-relaxed text-sm">Reforestación, protección de flora local y regeneración guiada de espacios degradados y deforestados.</p>
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card 2 */}
            <div className="group relative bg-surface border border-border-custom rounded-3xl p-8 hover:-translate-y-2 hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 reveal">
               <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-inner">
                 <Droplet className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-text mb-3 font-display">Limpieza Acuática</h3>
               <p className="text-text-muted leading-relaxed text-sm">Organización de brigadas para reducir el plástico y proteger el ciclo hídrico de nuestros ríos y playas.</p>
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card 3 */}
            <div className="group relative bg-surface border border-border-custom rounded-3xl p-8 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 reveal">
               <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                 <BookOpen className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-text mb-3 font-display">Educación Comunitaria</h3>
               <p className="text-text-muted leading-relaxed text-sm">Enseñamos prácticas sostenibles a comunidades vulnerables para garantizar el futuro verde y empoderado.</p>
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card 4 */}
            <div className="group relative bg-surface border border-border-custom rounded-3xl p-8 hover:-translate-y-2 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 reveal">
               <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-inner">
                 <Sprout className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-text mb-3 font-display">Agricultura y Viveros</h3>
               <p className="text-text-muted leading-relaxed text-sm">Producción de material vegetal nativo en nuestros viveros comunitarios para su uso en reforestación activa.</p>
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/10 to-primary/10 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

          </div>
        </div>
      </section>

      {/* 🌲 MOTIVACIONAL HERO BANNER */}
      <section className="w-full bg-[#0D1F17] py-32 flex items-center justify-center text-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
        
        <div className="max-w-4xl px-6 relative z-10 reveal">
          <svg className="w-16 h-16 text-primary opacity-60 mx-auto mb-8 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-md">
            Tu tiempo y dedicación <br />
            pueden sanar el mundo.
          </h2>
          <div className="w-16 h-1.5 bg-accent mx-auto rounded-full"></div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION SECTION (RÁPIDOS ACCESOS) */}
      <section className="max-w-7xl mx-auto px-6 py-28 w-full">
        
        <div className="text-center mb-20 reveal">
          <h2 className="text-3xl md:text-5xl font-bold text-text font-display mb-4">Únete a la Causa</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-text-muted">Comienza tu viaje de restauración ambiental o apoya nuestros proyectos hoy mismo.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* CTA 1: Postúlate */}
           <Link href="/actividades" className="group block h-full reveal">
              <div className="bg-surface border border-border-custom rounded-3xl p-8 h-full flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:bg-gradient-to-br hover:from-surface hover:to-primary/5">
                 <div className="w-20 h-20 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-md">
                    <Calendar className="w-9 h-9 group-hover:rotate-6 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-bold text-text mb-4 font-display">Postúlate</h3>
                 <p className="text-text-muted mb-8 text-sm leading-relaxed">Inscríbete en nuestras brigadas ecosociales, talleres de siembra y eventos ecológicos presenciales.</p>
                 <span className="mt-auto text-primary font-bold inline-flex items-center gap-2 group-hover:gap-3.5 transition-all text-sm uppercase tracking-wider">
                   Ver Actividades <ArrowRight className="w-5 h-5" />
                 </span>
              </div>
           </Link>
           
           {/* CTA 2: Donaciones (Destacada en verde) */}
           <Link href="/donaciones" className="group block h-full reveal">
              <div className="bg-gradient-to-b from-primary to-primary/95 text-white rounded-3xl p-8 h-full flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/25 relative overflow-hidden">
                 {/* Decorative background glow */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                 
                 <div className="w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-md z-10">
                    <Heart className="w-9 h-9 group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 font-display z-10 text-white">Dar un Aporte</h3>
                 <p className="text-emerald-100/90 mb-8 text-sm leading-relaxed z-10">Financia herramientas de siembra, logística de transporte e insumos clave para rescatar especies endémicas.</p>
                 <span className="mt-auto text-accent font-bold inline-flex items-center gap-2 group-hover:gap-3.5 transition-all text-sm uppercase tracking-wider z-10">
                   Donar Ahora <ArrowRight className="w-5 h-5 text-accent" />
                 </span>
              </div>
           </Link>
           
           {/* CTA 3: Reconocimiento */}
           <Link href="/certificados" className="group block h-full reveal">
              <div className="bg-surface border border-border-custom rounded-3xl p-8 h-full flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 hover:bg-gradient-to-br hover:from-surface hover:to-accent/5">
                 <div className="w-20 h-20 bg-accent/10 text-accent border border-accent/20 rounded-full flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-md">
                    <Award className="w-9 h-9 group-hover:rotate-6 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-bold text-text mb-4 font-display">Certificados</h3>
                 <p className="text-text-muted mb-8 text-sm leading-relaxed">Descarga de forma segura tu certificado electrónico oficial que valida tus donaciones o labores voluntarias.</p>
                 <span className="mt-auto text-accent font-bold inline-flex items-center gap-2 group-hover:gap-3.5 transition-all text-sm uppercase tracking-wider">
                   Ver Certificados <ArrowRight className="w-5 h-5" />
                 </span>
              </div>
           </Link>
           
        </div>
      </section>

    </div>
  );
}
