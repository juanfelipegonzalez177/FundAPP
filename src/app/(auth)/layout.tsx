import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F0]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
