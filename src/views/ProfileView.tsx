import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Download,
  LogOut,
  ExternalLink,
  Shield,
  Smartphone,
  CheckCircle,
  Scissors,
  HelpCircle,
  Edit2,
  X,
  Sparkles,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface ProfileViewProps {
  onOpenInstallModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenInstallModal }) => {
  const { user, logout, updateUser, appointments, setActiveTab, isAdmin } = useApp();
  const { isInstalled, isInstallable } = usePWAInstall();
  const isOnline = useOnlineStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const totalCuts = appointments.filter((a) => a.status === 'concluido').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: editName,
      phone: editPhone,
      email: editEmail,
    });
    setIsEditing(false);
  };

  return (
    <div className="pb-28 px-4 pt-2 space-y-5">
      {/* User Info Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#131B2E] to-[#0A0D17] border border-white/10 p-5 shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Avatar with luxury gradient border */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E31837] to-[#0EA5E9] p-0.5 shadow-lg shadow-[#E31837]/30 shrink-0">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center text-white">
              <User className="w-8 h-8 text-[#0EA5E9]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-heading text-white truncate">
                {user?.name || 'Cliente'}
              </h2>
              {user?.isGuest && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  Visitante
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
            <p className="text-xs text-[#0EA5E9] font-mono mt-0.5">{user?.phone}</p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* User Mini Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
          <div className="bg-white/[0.03] p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block">Cortes Realizados</span>
            <span className="text-base font-bold text-white font-mono">{totalCuts}</span>
          </div>
          <div className="bg-white/[0.03] p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block">Nível de Fidelidade</span>
            <span className="text-xs font-bold text-[#0EA5E9] flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              VIP Prime
            </span>
          </div>
        </div>
      </div>

      {/* PWA App Installation Card */}
      <div className="rounded-3xl bg-[#0E1322] border border-[#0EA5E9]/30 p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/15 text-[#38BDF8] flex items-center justify-center shrink-0 border border-[#0EA5E9]/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">Aplicativo Bigode Grosso</h3>
            <p className="text-xs text-slate-400">
              {isInstalled
                ? 'App instalado e funcionando no modo nativo'
                : 'Instale na sua tela inicial para acesso rápido'}
            </p>
          </div>
        </div>

        {!isInstalled ? (
          <button
            onClick={onOpenInstallModal}
            className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0EA5E9] text-white text-xs font-bold shadow-md shadow-[#0EA5E9]/30 active:scale-95 transition"
          >
            <Download className="w-4 h-4" />
            <span>Instalar Aplicativo no Celular</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>PWA instalado com suporte offline ativo!</span>
          </div>
        )}
      </div>

      {/* Barbearia Info & Official Contacts */}
      <div className="rounded-3xl bg-[#0E1322] border border-white/[0.08] p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E31837]/20 flex items-center justify-center text-[#E31837]">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider">
              Dados da Barbearia
            </span>
            <h3 className="text-sm font-bold text-white font-heading">
              {BARBERSHOP_INFO.name}
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#E31837] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-white block">Endereço Oficial</span>
              <span className="text-slate-300 leading-relaxed block">
                {BARBERSHOP_INFO.address}
              </span>
              <a
                href={BARBERSHOP_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0EA5E9] font-semibold hover:underline inline-flex items-center gap-1 mt-1"
              >
                Como chegar (Google Maps)
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Telefone */}
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Telefone / WhatsApp</span>
              <span className="text-emerald-400 font-mono font-semibold">{BARBERSHOP_INFO.phone}</span>
            </div>
          </div>

          {/* Horário */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-white block">Horário de Funcionamento</span>
              <div className="mt-1.5 space-y-1 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                {BARBERSHOP_INFO.dailySchedule.map((sched, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{sched.day}</span>
                    <span className={`font-semibold ${sched.open ? 'text-amber-300 font-mono' : 'text-red-400'}`}>
                      {sched.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Direct CTA */}
        <a
          href={BARBERSHOP_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 active:scale-95 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Iniciar Conversa no WhatsApp</span>
        </a>
      </div>

      {/* Área Administrativa (Restrita) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#172138] via-[#101726] to-[#0A0D17] border border-[#0EA5E9]/30 p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E31837]/20 text-[#E31837] flex items-center justify-center shrink-0 border border-[#E31837]/30">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Somente Administração
            </div>
            <h3 className="text-sm font-bold text-white">Área Administrativa</h3>
            <p className="text-[11px] text-slate-400">
              Controle total de agendamentos e inclusão/exclusão de cortes
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E31837] to-[#BE122C] hover:from-[#FF2243] hover:to-[#D41432] text-white text-xs font-bold shadow-md shadow-[#E31837]/30 active:scale-95 transition"
        >
          <Lock className="w-4 h-4" />
          <span>{isAdmin ? 'Gerenciar Agendamentos & Cortes' : 'Acesso Restrito à Administração'}</span>
        </button>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="w-full min-h-[48px] rounded-2xl bg-white/[0.04] hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>{user?.isGuest ? 'Sair do Modo Visitante' : 'Sair da Conta'}</span>
      </button>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0E1322] border border-white/15 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-white">Editar Perfil</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Telefone</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#E31837] text-xs font-bold text-white shadow-md shadow-[#E31837]/30"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
