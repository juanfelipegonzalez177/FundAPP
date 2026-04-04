import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full text-center p-4 text-xs text-gray-500 shrink-0">
      &copy; {new Date().getFullYear()} Fundación Biosferas. Todos los derechos reservados.
    </footer>
  );
};
