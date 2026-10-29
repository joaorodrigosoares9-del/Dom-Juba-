import React, { useState } from 'react';
import {
  ShieldAlert,
  Scissors,
  CalendarCheck,
  Plus,
  Trash2,
  Edit3,
  Clock,
  MessageCircle,
  Search,
  Lock,
  Unlock,
  ArrowLeft,
  Sparkles,
  X,
  Check,
  ShieldCheck,
  UserPlus,
  Mail,
  KeyRound,
  Crown,
  Database,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Service, AppointmentStatus, AdminAccount } from '../types';

export const AdminView: React.FC = () => {
  const {
    user,
    isAdmin,
    adminAccounts,
    adminEmails,
    masterOwnerEmail,
    verifyAdminEmail,
    loginAsAdmin,
    setAdminPassword,
    logoutAdmin,
    addAdminAccount,
    removeAdminAccount,
    appointments,
    services,
    isServicesLoading,
    addService,
    updateService,
    deleteService,
    updateAppointmentStatus,
    deleteAppointment,
    setActiveTab,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'servicos' | 'agendamentos' | 'admins'>('servicos');

  // Login form states for unauthenticated admin access
  const [loginEmailInput, setLoginEmailInput] = useState(
    user && !user.isGuest ? user.email : masterOwnerEmail
  );
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [isSettingPasswordMode, setIsSettingPasswordMode] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state for appointments
  const [appointmentFilter, setAppointmentFilter] = useState<'todos' | 'confirmado' | 'concluido' | 'cancelado'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // New Service Modal state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('60');
  const [newServiceDuration, setNewServiceDuration] = useState('35');
  const [newServiceCategory, setNewServiceCategory] = useState<'cabelo' | 'barba' | 'combo' | 'tratamento'>('cabelo');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceImage, setNewServiceImage] = useState(
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80'
  );

  // Edit Service modal / inline state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editCategory, setEditCategory] = useState<'cabelo' | 'barba' | 'combo' | 'tratamento'>('cabelo');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');

  // New Admin email state
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');
  const [newAdminNameInput, setNewAdminNameInput] = useState('');
  const [newAdminInitialPassword, setNewAdminInitialPassword] = useState('');

  // Change Own Password state (inside admin panel)
  const [ownNewPasswordInput, setOwnNewPasswordInput] = useState('');

  // Preset Barbershop Photos for cuts & styling
  const presetPhotos = [
    { label: 'Corte Tesoura/Máquina', url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80' },
    { label: 'Barba & Navalha', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=80' },
    { label: 'Combo Completo', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80' },
    { label: 'Barboterapia Toalha', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=700&q=80' },
    { label: 'Alinhamento & Fade', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80' },
  ];

  // ==============================================================
  // 1. GATEWAY: AUTHENTICATION FOR AUTHORIZED ADMINS ONLY
  // ==============================================================
  if (!isAdmin) {
    const cleanEmail = (loginEmailInput || '').trim().toLowerCase();
    const { isAuthorized, hasSetPassword, admin } = verifyAdminEmail(cleanEmail);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isAuthorized) return;

      setIsSubmitting(true);
      if (!hasSetPassword || isSettingPasswordMode) {
        // User is setting their custom password for the first time
        if (newPasswordInput.trim().length < 4) {
          alert('A senha deve ter no mínimo 4 caracteres.');
          setIsSubmitting(false);
          return;
        }
        if (newPasswordInput !== confirmPasswordInput) {
          alert('As senhas digitadas não coincidem.');
          setIsSubmitting(false);
          return;
        }
        await setAdminPassword(newPasswordInput, cleanEmail);
      } else {
        // Standard password login
        await loginAsAdmin(loginPasswordInput, cleanEmail);
      }
      setIsSubmitting(false);
    };

    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-5 text-center">
        {/* Lock / Security Shield Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#E31837] to-[#BE122C] flex items-center justify-center mb-4 text-white shadow-xl shadow-[#E31837]/35 border border-white/10">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0EA5E9]/15 text-[#38BDF8] border border-[#0EA5E9]/30 mb-2">
          <Database className="w-3.5 h-3.5" />
          <span>Sincronização Firestore Ativa</span>
        </div>

        <h2 className="text-xl font-bold font-heading text-white">Painel da Administração</h2>
        <p className="text-xs text-slate-300 max-w-xs mt-1 mb-6">
          Acesso exclusivo para administradores cadastrados da Barbearia Don Juba.
        </p>

        {/* Security Warning for regular clients or visitors */}
        {user && user.isGuest && (
          <div className="w-full max-w-xs bg-amber-500/10 border border-amber-500/25 p-3 rounded-2xl mb-4 text-left">
            <span className="text-[11px] font-bold text-amber-300 block">Aviso aos Visitantes:</span>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              Visitantes e clientes não têm acesso à área administrativa. Digite seu e-mail cadastrado como admin e sua senha para desbloquear.
            </p>
          </div>
        )}

        {/* Main Authentication Card */}
        <div className="w-full max-w-xs bg-[#0E1322] border border-white/15 p-4 rounded-3xl shadow-2xl text-left space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              E-mail do Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={loginEmailInput}
                onChange={(e) => {
                  setLoginEmailInput(e.target.value);
                  setIsSettingPasswordMode(false);
                }}
                placeholder="exemplo@gmail.com"
                className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            {/* Email Status Indicator */}
            {cleanEmail && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                {isAuthorized ? (
                  <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> E-mail de Administrador Autorizado
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold inline-flex items-center gap-1">
                    <X className="w-3 h-3" /> E-mail não cadastrado como administrador
                  </span>
                )}
              </div>
            )}
          </div>

          {/* If email is NOT authorized */}
          {!isAuthorized && cleanEmail && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-300">
              Apenas e-mails cadastrados previamente pelo proprietário da Don Juba podem desbloquear este painel.
              <div className="mt-1 text-[10px] text-slate-400">
                Proprietário Master: <strong className="text-white">{masterOwnerEmail}</strong>
              </div>
            </div>
          )}

          {/* Form when authorized */}
          {isAuthorized && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-1">
              {/* CASE 1: FIRST ACCESS -> MUST CHOOSE PASSWORD */}
              {!hasSetPassword || isSettingPasswordMode ? (
                <div className="space-y-2.5">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-left">
                    <span className="text-[11px] font-bold text-emerald-300 block">
                      🔑 Escolha a sua Senha
                    </span>
                    <p className="text-[10px] text-emerald-200/90 mt-0.5">
                      Você ainda não definiu sua senha pessoal. Crie sua senha de administrador agora:
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 mb-1">
                      Nova Senha *
                    </label>
                    <input
                      type="password"
                      required
                      autoFocus
                      placeholder="Mínimo 4 caracteres"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E31837]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 mb-1">
                      Confirme a Nova Senha *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repita sua senha"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E31837]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white font-bold text-xs shadow-lg shadow-[#E31837]/35 active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSubmitting ? 'Salvando no Firestore...' : 'Definir Senha e Entrar'}</span>
                  </button>
                </div>
              ) : (
                /* CASE 2: REGULAR ADMIN LOGIN WITH CHOSEN PASSWORD */
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] text-slate-300">
                        Sua Senha de Administrador
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSettingPasswordMode(true)}
                        className="text-[10px] text-[#0EA5E9] hover:underline"
                      >
                        Redefinir senha
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        autoFocus
                        placeholder="Digite sua senha"
                        value={loginPasswordInput}
                        onChange={(e) => setLoginPasswordInput(e.target.value)}
                        className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#E31837]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white font-bold text-xs shadow-lg shadow-[#E31837]/35 active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isSubmitting ? 'Verificando...' : 'Desbloquear Painel'}</span>
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        <button
          onClick={() => setActiveTab('inicio')}
          className="mt-6 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao aplicativo</span>
        </button>
      </div>
    );
  }

  // ==============================================================
  // 2. AUTHENTICATED ADMIN PANEL (FIRESTORE PERSISTENCE & REAL-TIME)
  // ==============================================================

  const isMasterOwner = user?.email.toLowerCase() === masterOwnerEmail.toLowerCase();

  // Metrics
  const totalRevenue = appointments
    .filter((a) => a.status !== 'cancelado')
    .reduce((sum, a) => sum + (a.servicePrice || 0), 0);
  const confirmedCount = appointments.filter((a) => a.status === 'confirmado').length;
  const completedCount = appointments.filter((a) => a.status === 'concluido').length;

  const filteredAppointments = appointments.filter((apt) => {
    if (appointmentFilter !== 'todos' && apt.status !== appointmentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        apt.userName.toLowerCase().includes(q) ||
        apt.userPhone.includes(q) ||
        apt.serviceName.toLowerCase().includes(q) ||
        apt.barberName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Add Service to Firestore
  const handleCreateServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    await addService({
      name: newServiceName.trim(),
      description: newServiceDesc.trim() || 'Serviço executado com precisão e técnica pela equipe Don Juba.',
      price: Number(newServicePrice) || 60,
      durationMinutes: Number(newServiceDuration) || 35,
      category: newServiceCategory,
      imageUrl: newServiceImage,
      popular: true,
    });

    setIsAddServiceOpen(false);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('60');
    setNewServiceDuration('35');
  };

  // Open Edit Service Modal
  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setEditName(service.name);
    setEditPrice(String(service.price));
    setEditDuration(String(service.durationMinutes));
    setEditCategory(service.category);
    setEditDesc(service.description);
    setEditImage(service.imageUrl);
  };

  // Save Edit Service to Firestore
  const handleSaveEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editName.trim()) return;

    await updateService(editingService.id, {
      name: editName.trim(),
      price: Number(editPrice) || 60,
      durationMinutes: Number(editDuration) || 35,
      category: editCategory,
      description: editDesc.trim(),
      imageUrl: editImage,
    });

    setEditingService(null);
  };

  // Handle Add New Admin to Firestore
  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmailInput.trim()) return;

    const ok = await addAdminAccount(
      newAdminEmailInput,
      newAdminNameInput || newAdminEmailInput.split('@')[0],
      newAdminInitialPassword || undefined
    );
    if (ok) {
      setNewAdminEmailInput('');
      setNewAdminNameInput('');
      setNewAdminInitialPassword('');
    }
  };

  // Handle Change Own Password in Firestore
  const handleChangeOwnPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownNewPasswordInput.trim()) return;
    const ok = await setAdminPassword(ownNewPasswordInput, user?.email);
    if (ok) {
      setOwnNewPasswordInput('');
    }
  };

  return (
    <div className="pb-28 px-4 pt-2 space-y-4">
      {/* Admin Top Header Banner with Real-time indicator */}
      <div className="bg-gradient-to-r from-[#172138] via-[#101726] to-[#0A0D17] border border-[#0EA5E9]/35 rounded-2xl p-3.5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E31837] to-[#0EA5E9] flex items-center justify-center text-white shadow-md shrink-0">
            {isMasterOwner ? <Crown className="w-5 h-5 text-amber-300" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore em Tempo Real</span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white font-heading truncate max-w-[190px]">
              {user?.email}
            </h2>
            <span className="text-[10px] text-slate-300">
              {isMasterOwner ? 'Proprietário Don Juba (Master)' : 'Administrador'}
            </span>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition shrink-0"
        >
          Sair
        </button>
      </div>

      {/* 3 Main Management Tabs */}
      <div className="grid grid-cols-3 p-1 bg-[#0E1322] border border-white/10 rounded-2xl text-[11px]">
        <button
          onClick={() => setAdminTab('servicos')}
          className={`min-h-[42px] rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            adminTab === 'servicos'
              ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Cortes ({services.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('agendamentos')}
          className={`min-h-[42px] rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            adminTab === 'agendamentos'
              ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Agendamentos ({appointments.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('admins')}
          className={`min-h-[42px] rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            adminTab === 'admins'
              ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Equipe & Senhas</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: GESTÃO DO CATÁLOGO DE CORTES (FIRESTORE REAL-TIME CRUD) */}
      {/* ============================================================== */}
      {adminTab === 'servicos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Catálogo de Cortes</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Firestore Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Adicione, edite ou remova cortes. As alterações são sincronizadas na hora para todos os clientes.
              </p>
            </div>

            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="px-3 min-h-[38px] rounded-xl bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white font-bold text-xs shadow-md shadow-[#E31837]/30 flex items-center gap-1.5 active:scale-95 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Corte</span>
            </button>
          </div>

          {/* Service Cards List */}
          {isServicesLoading && services.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#0EA5E9]" />
              <span>Carregando catálogo do Firestore...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl bg-[#0E1322] border border-white/10 p-3.5 flex gap-3.5 items-center shadow-lg hover:border-white/20 transition"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-900">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate font-heading">
                        {service.name}
                      </h4>
                      <span className="text-sm font-black text-[#0EA5E9] font-mono shrink-0 ml-2">
                        R$ {service.price}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span className="inline-flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-[#0EA5E9]" />
                        {service.durationMinutes} min
                      </span>
                      <span>•</span>
                      <span className="capitalize text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons: Edit & Delete */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(service)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                      title="Editar Corte"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja remover o corte "${service.name}" do Firestore?`)) {
                          deleteService(service.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"
                      title="Retirar do Catálogo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: GESTÃO DE AGENDAMENTOS (FIRESTORE REAL-TIME) */}
      {/* ============================================================== */}
      {adminTab === 'agendamentos' && (
        <div className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
            <div className="bg-[#0E1322] border border-white/5 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block">Total Agendados</span>
              <span className="text-lg font-bold text-white font-mono">{appointments.length}</span>
            </div>
            <div className="bg-[#0E1322] border border-white/5 p-3 rounded-2xl">
              <span className="text-[10px] text-emerald-400 block">Confirmados</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{confirmedCount}</span>
            </div>
            <div className="bg-[#0E1322] border border-white/5 p-3 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-amber-400 block">Faturamento Prev.</span>
              <span className="text-base font-bold text-amber-400 font-mono">R$ {totalRevenue}</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por cliente, telefone ou serviço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            {/* Status Pills */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'confirmado', label: 'Confirmados' },
                { id: 'concluido', label: 'Concluídos' },
                { id: 'cancelado', label: 'Cancelados' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAppointmentFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition ${
                    appointmentFilter === tab.id
                      ? 'bg-[#0EA5E9] text-white shadow-sm'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-10 bg-[#0E1322] border border-white/5 rounded-2xl text-slate-400 text-xs">
              Nenhum agendamento encontrado no Firestore para este filtro.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => {
                const isConfirmed = apt.status === 'confirmado';
                const isCompleted = apt.status === 'concluido';
                const isCancelled = apt.status === 'cancelado';

                return (
                  <div
                    key={apt.id}
                    className="rounded-2xl bg-[#0E1322] border border-white/10 p-3.5 space-y-3 shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{apt.userName}</h4>
                          <span className="text-[10px] font-mono text-[#0EA5E9] bg-[#0EA5E9]/10 px-1.5 py-0.5 rounded">
                            {apt.userPhone}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">
                          {apt.serviceName} • <strong className="text-emerald-400">R$ {apt.servicePrice}</strong>
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isCompleted
                            ? 'bg-blue-500/15 text-[#38BDF8] border border-blue-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {isConfirmed ? 'Confirmado' : isCompleted ? 'Concluído' : 'Cancelado'}
                      </span>
                    </div>

                    <div className="bg-white/[0.03] p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-300 border border-white/5">
                      <span>Barbeiro: <strong className="text-white">{apt.barberName}</strong></span>
                      <span className="font-mono text-white font-semibold">
                        {apt.date} às {apt.time}
                      </span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        Observação: "{apt.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 gap-2 border-t border-white/5">
                      <a
                        href={`https://wa.me/55${apt.userPhone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(apt.userName)},%20aqui%20%C3%A9%20da%20Barbearia%20Don%20Juba%20sobre%20seu%20hor%C3%A1rio%20agendado!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chamar</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        {!isCompleted && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'concluido')}
                            className="px-2 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-[#38BDF8] text-[11px] font-bold border border-blue-500/30 transition"
                          >
                            Concluir
                          </button>
                        )}
                        {!isConfirmed && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmado')}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 transition"
                          >
                            Confirmar
                          </button>
                        )}
                        {!isCancelled && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelado')}
                            className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-[11px] font-bold border border-amber-500/30 transition"
                          >
                            Cancelar
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm('Deseja excluir definitivamente este agendamento do Firestore?')) {
                              deleteAppointment(apt.id);
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: EQUIPE DE ADMINISTRADORES & GESTÃO DE SENHAS */}
      {/* ============================================================== */}
      {adminTab === 'admins' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Equipe Administrativa & Senhas</h3>
            <p className="text-[11px] text-slate-400">
              Gerencie quem tem autorização para gerenciar a barbearia. As contas são armazenadas com segurança no Firestore.
            </p>
          </div>

          {/* List of Admins in Firestore */}
          <div className="space-y-2">
            {adminAccounts.map((admin) => {
              const isMaster = admin.email.toLowerCase() === masterOwnerEmail.toLowerCase();

              return (
                <div
                  key={admin.id}
                  className="rounded-2xl bg-[#0E1322] border border-white/10 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isMaster ? 'bg-amber-500/20 text-amber-400' : 'bg-[#0EA5E9]/20 text-[#0EA5E9]'
                    }`}>
                      {isMaster ? <Crown className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-mono truncate">
                          {admin.email}
                        </span>
                        {admin.hasSetCustomPassword ? (
                          <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                            Senha Ativa
                          </span>
                        ) : (
                          <span className="text-[9px] bg-amber-500/15 text-amber-400 px-1.5 py-0.2 rounded font-semibold">
                            Pendente Definição
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {isMaster ? 'Proprietário Principal (Master)' : `${admin.name || 'Administrador'}`}
                      </span>
                    </div>
                  </div>

                  {!isMaster && (
                    <button
                      onClick={() => {
                        if (confirm(`Remover acesso de ${admin.email} do Firestore?`)) {
                          removeAdminAccount(admin.id, admin.email);
                        }
                      }}
                      className="p-2 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                      title="Remover Administrador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form to Add New Admin */}
          <div className="rounded-2xl bg-[#0E1322] border border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#0EA5E9]" />
              <h4 className="text-xs font-bold text-white">Cadastrar Novo Administrador</h4>
            </div>

            <form onSubmit={handleAddAdminSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[10px] text-slate-300 mb-1">E-mail do Novo Admin *</label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@gmail.com"
                  value={newAdminEmailInput}
                  onChange={(e) => setNewAdminEmailInput(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 mb-1">Nome / Cargo (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Gerente Mateus"
                  value={newAdminNameInput}
                  onChange={(e) => setNewAdminNameInput(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 mb-1">Senha Inicial (Opcional)</label>
                <input
                  type="password"
                  placeholder="Deixe em branco para o admin escolher no 1º acesso"
                  value={newAdminInitialPassword}
                  onChange={(e) => setNewAdminInitialPassword(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-bold text-xs shadow-md shadow-[#0EA5E9]/25 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Administrador no Firestore</span>
              </button>
            </form>
          </div>

          {/* Form to Change Own Admin Password */}
          <div className="rounded-2xl bg-[#0E1322] border border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#E31837]" />
              <h4 className="text-xs font-bold text-white">Alterar Minha Senha de Acesso</h4>
            </div>
            <p className="text-[10px] text-slate-400">
              Atualize sua senha pessoal a qualquer momento. A nova senha será salva no Firestore.
            </p>

            <form onSubmit={handleChangeOwnPasswordSubmit} className="space-y-2.5">
              <input
                type="password"
                required
                placeholder="Digite a nova senha desejada"
                value={ownNewPasswordInput}
                onChange={(e) => setOwnNewPasswordInput(e.target.value)}
                className="w-full min-h-[44px] bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E31837]"
              />

              <button
                type="submit"
                className="w-full min-h-[42px] rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 active:scale-95 transition"
              >
                Salvar Nova Senha no Firestore
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADICIONAR NOVO CORTE AO FIRESTORE */}
      {/* ============================================================== */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0E1322] border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#E31837]" />
                <h3 className="text-base font-bold font-heading text-white">Adicionar Novo Corte</h3>
              </div>
              <button
                onClick={() => setIsAddServiceOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateServiceSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Nome do Corte / Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fade Navalhado Don Juba"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E31837]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white font-mono focus:outline-none focus:border-[#E31837]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Duração (min) *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={5}
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white font-mono focus:outline-none focus:border-[#E31837]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Categoria
                </label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value as any)}
                  className="w-full min-h-[44px] bg-[#141A2E] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E31837]"
                >
                  <option value="cabelo">Cabelo</option>
                  <option value="barba">Barba</option>
                  <option value="combo">Combo</option>
                  <option value="tratamento">Tratamento</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Descrição do Serviço
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva as técnicas, acabamento e produtos utilizados..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E31837] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Foto do Corte
                </label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {presetPhotos.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewServiceImage(preset.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                        newServiceImage === preset.url
                          ? 'border-[#E31837] scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Ou cole o link de uma imagem personalizada"
                  value={newServiceImage}
                  onChange={(e) => setNewServiceImage(e.target.value)}
                  className="w-full min-h-[38px] bg-white/[0.05] border border-white/10 rounded-xl px-2.5 text-[11px] text-white focus:outline-none focus:border-[#E31837]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="flex-1 min-h-[44px] rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-[#E31837] to-[#BE122C] text-xs font-bold text-white shadow-md shadow-[#E31837]/30"
                >
                  Salvar no Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDITAR CORTE EXISTENTE NO FIRESTORE */}
      {/* ============================================================== */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0E1322] border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#0EA5E9]" />
                <h3 className="text-base font-bold font-heading text-white">Editar Corte</h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Nome do Corte *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white font-mono focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Duração (min) *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={5}
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full min-h-[44px] bg-white/[0.05] border border-white/10 rounded-xl px-3 text-xs text-white font-mono focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Categoria
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="w-full min-h-[44px] bg-[#141A2E] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="cabelo">Cabelo</option>
                  <option value="barba">Barba</option>
                  <option value="combo">Combo</option>
                  <option value="tratamento">Tratamento</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Link da Foto
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full min-h-[38px] bg-white/[0.05] border border-white/10 rounded-xl px-2.5 text-[11px] text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 min-h-[44px] rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-xs font-bold text-white shadow-md shadow-[#0EA5E9]/30"
                >
                  Atualizar no Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
