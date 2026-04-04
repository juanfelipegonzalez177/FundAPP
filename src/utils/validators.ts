export const validarEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validarPassword = (password: string) => {
  return password.length >= 8;
};

export const validarFecha = (fecha: string) => {
  // DD/MM/YYYY support check
  if (!fecha) return false;
  return true; // Simplificado para la UI real-time, se puede mejorar
};
