import React from 'react';
import { Download, Share, PlusSquare, X, CheckCircle, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] bg-[#0E1322] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E31837] to-[#0EA5E9] p-0.5 shadow-xl shadow-[#E31837]/20 flex items-center justify-center">
            <img src="/pwa-192x192.png" alt="Bigode Grosso" className="w-full h-full rounded-2xl object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#0EA5E9] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              App Mobile PWA
            </div>
            <h3 className="text-lg font-bold font-heading text-white">Instalar Bigode Grosso</h3>
            <p className="text-xs text-slate-400">Acesso instantâneo sem gastar memória</p>
          </div>
        </div>

        {/* Status Content */}
        {isInstalled ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center my-4">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-emerald-300">App já instalado em seu dispositivo!</p>
            <p className="text-xs text-slate-400 mt-1">Você pode acessá-lo direto da sua tela de início.</p>
          </div>
        ) : isIOS ? (
          /* iOS Instructions */
          <div className="space-y-3.5 my-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              No iPhone ou iPad, instale em 2 toques rápidos:
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-[#0EA5E9]/20 text-[#38BDF8] flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </div>
                <div className="text-xs text-slate-200">
                  Toque no botão <strong className="text-white inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 inline text-[#0EA5E9]" /> Compartilhar</strong> na barra do Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-[#E31837]/20 text-[#FF4B64] flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </div>
                <div className="text-xs text-slate-200">
                  Role a lista e selecione <strong className="text-white inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline text-[#E31837]" /> Adicionar à Tela de Início</strong>.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Android / Chrome flow */
          <div className="space-y-3 my-4">
            <ul className="text-xs text-slate-300 space-y-2 bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.06]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31837]" />
                Funciona offline mesmo sem sinal de internet
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                Lembretes e notificações de agendamentos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Sem download pesado da App Store ou Play Store
              </li>
            </ul>

            {isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E31837] to-[#BE122C] hover:from-[#FF2243] hover:to-[#D41432] text-white font-bold text-sm shadow-lg shadow-[#E31837]/30 active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                Adicionar à Minha Tela Inicial
              </button>
            ) : (
              <div className="text-center p-3 text-xs text-slate-400 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                Para instalar, abra o menu do seu navegador (⋮) e toque em <strong className="text-white">"Instalar aplicativo"</strong> ou <strong className="text-white">"Adicionar à tela inicial"</strong>.
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 py-1"
          >
            Continuar usando no navegador
          </button>
        </div>
      </div>
    </div>
  );
};
