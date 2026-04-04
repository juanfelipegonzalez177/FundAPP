'use client';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DonationForm } from '@/components/forms/DonationForm';

export default function DonacionesPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12 flex flex-col md:flex-row gap-12 items-center min-h-[500px]">
          
          <div className="w-full md:w-[55%] flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold text-[#1B4332] font-display">Información de Pago</h2>
              <p className="text-gray-600 mt-2">Tu donación ayuda a restaurar ecosistemas enteros.</p>
            </div>
            
            <DonationForm />
          </div>

          <div className="w-full md:w-[45%] flex justify-center items-center">
            <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl ring-8 ring-[#2D6A4F]/10">
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
