import React from 'react';
import { ArrowLeft, MessageCircle, Download, Scissors } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInstallModal }) => {
  const { activeTab, bookingState, goBack, canGoBack } = useApp();
  const { isInstallable, isInstalled } = usePWAInstall();

  // Determine Title based on current view
  let title = BARBERSHOP_INFO.name;
  let subtitle = 'Barbearia Premium';

  if (activeTab === 'inicio') {
    title = BARBERSHOP_INFO.name;
    subtitle = 'Vitória da Conquista';
  } else if (activeTab === 'agendar') {
    title = 'Agendar Horário';
    const stepNames = [
      '',
      'Passo 1/5: Escolha o Serviço',
      'Passo 2/5: Escolha o Barbeiro',
      'Passo 3/5: Escolha a Data',
      'Passo 4/5: Escolha o Horário',
      'Passo 5/5: Confirmar Detalhes',
    ];
    subtitle = stepNames[bookingState.step] || 'Novo Agendamento';
  } else if (activeTab === 'agendamentos') {
    title = 'Meus Agendamentos';
    subtitle = 'Histórico e Próximos';
  } else if (activeTab === 'perfil') {
    title = 'Meu Perfil';
    subtitle = 'Informações & Barbearia';
  } else if (activeTab === 'admin') {
    title = 'Painel Administrativo';
    subtitle = 'Controle de Agendamentos & Cortes';
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0F19]/95 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left Side: Back Button or Brand Logo */}
        <div className="flex items-center gap-3">
          {canGoBack ? (
            <button
              onClick={goBack}
              aria-label="Voltar"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 text-white transition-all border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#E31837] to-[#8C0B1E] text-white shadow-lg shadow-[#E31837]/25 border border-white/20">
              <Scissors className="w-5 h-5" />
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-base font-bold font-heading text-white tracking-wide line-clamp-1">
              {title}
            </h1>
            <span className="text-[11px] font-medium text-slate-400 line-clamp-1">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Right Side: Quick Action (Install or WhatsApp) */}
        <div className="flex items-center gap-2">
          {/* In-App Install shortcut button if installable */}
          {!isInstalled && isInstallable && onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              title="Instalar App no celular"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-[#38BDF8] text-xs font-semibold hover:bg-[#0EA5E9]/25 active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Instalar</span>
            </button>
          )}

          {/* Direct WhatsApp button with sanitized link */}
          <a
            href={BARBERSHOP_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp da Barbearia"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-400 border border-emerald-500/30 transition shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
