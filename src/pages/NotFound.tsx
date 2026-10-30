import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.warn(
      '404: Tentativa de acesso a rota inexistente:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090E] text-white p-6">
      <div className="text-center max-w-sm">
        <h1 className="text-5xl font-bold mb-3 font-heading text-[#E31837]">404</h1>
        <p className="text-lg text-slate-300 mb-6">Página não encontrada</p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0EA5E9] text-white font-medium hover:bg-[#0284c7] transition-colors"
        >
          Voltar para o Início
        </a>
      </div>
    </div>
  );
}
