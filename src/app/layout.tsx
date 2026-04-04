import { AuthProvider } from '@/context/AuthProvider';
import { NotifProvider } from '@/context/NotifContext';
import './globals.css';

export const metadata = {
  title: 'FundApp — Fundación Biosferas',
  description: 'Plataforma para conectar voluntarios en proyectos ambientales.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        <NotifProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NotifProvider>
      </body>
    </html>
  );
}
