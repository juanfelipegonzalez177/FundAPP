'use client';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DonationForm } from '@/components/forms/DonationForm';

export default function DonacionesPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
        <div className="bg-surface rounded-3xl shadow-xl border border-border-custom p-6 md:p-12 flex flex-col md:flex-row gap-12 items-center min-h-[500px] transition-colors duration-300">
          
          {/* Form Column - 55% */}
          <div className="w-full md:w-[55%] flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold text-text font-display">Información de Pago</h2>
              <div className="w-12 h-1 bg-primary rounded-full mt-2"></div>
              <p className="text-text-muted mt-3 text-sm">Tu donación ayuda a restaurar ecosistemas degradados y a capacitar a las comunidades locales.</p>
            </div>
            
            <DonationForm />
          </div>

          {/* Graphic/Image Column - 45% */}
          <div className="w-full md:w-[45%] flex justify-center items-center">
            <div className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden shadow-2xl ring-8 ring-primary/10 transition-transform duration-500 hover:scale-[1.01]">
              <img 
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=600" 
                alt="Bosque Circular" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
