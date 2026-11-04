import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  CalendarPlus,
  MessageCircle,
  AlertTriangle,
  FileText,
  Trash2,
  CalendarDays,
  BellRing,
  Sparkles,
  MapPin,
  Flame,
  Navigation,
  ExternalLink,
  ChevronRight,
  AlarmClock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { BARBERSHOP_INFO, SERVICES, BARBERS } from '../data/barbershopData';
import { Appointment } from '../types';

export const MyAppointmentsView: React.FC = () => {
  const { appointments, cancelAppointment, setActiveTab, user } = useApp();
  const [filter, setFilter] = useState<'proximos' | 'anteriores'>('proximos');
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update current time every 30 seconds for live countdown accuracy
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = useMemo(() => {
    return currentTime.toISOString().split('T')[0];
  }, [currentTime]);

  // Helper to parse date string (YYYY-MM-DD) and time string (HH:mm)
  const parseAppointmentDateTime = (dateStr: string, timeStr: string): Date => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, 0);
    } catch {
      return new Date();
    }
  };

  // Helper to calculate urgency and relative time info
  const calculateUrgency = (apt: Appointment) => {
    const aptDate = parseAppointmentDateTime(apt.date, apt.time);
    const diffMs = aptDate.getTime() - currentTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const isToday = apt.date === todayStr;

    // Tomorrow calculation
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const isTomorrow = apt.date === tomorrowStr;

    let urgencyLevel: 'imminent' | 'today' | 'tomorrow' | 'upcoming' | 'past' = 'upcoming';
    let badgeLabel = 'Agendado';
    let countdownText = `${apt.date} às ${apt.time}`;
    let isNear = false;

    if (diffMinutes < -45) {
      urgencyLevel = 'past';
      badgeLabel = 'Concluído';
      countdownText = 'Horário já finalizado';
    } else if (diffMinutes >= -45 && diffMinutes <= 0) {
      urgencyLevel = 'imminent';
      badgeLabel = 'ATENDIMENTO EM ANDAMENTO';
      countdownText = 'Seu horário começou agora!';
      isNear = true;
    } else if (diffMinutes > 0 && diffMinutes <= 120) {
      urgencyLevel = 'imminent';
      badgeLabel = 'HORÁRIO PRÓXIMO • COMEÇA EM BREVE';
      if (diffMinutes < 60) {
        countdownText = `Faltam apenas ${diffMinutes} min!`;
      } else {
        const remaining = diffMinutes % 60;
        countdownText = `Falta 1h ${remaining > 0 ? `${remaining}m` : ''}`;
      }
      isNear = true;
    } else if (isToday) {
      urgencyLevel = 'today';
      badgeLabel = 'SEU HORÁRIO É HOJE';
      countdownText = diffHours > 0 ? `Hoje às ${apt.time} (em ~${diffHours}h)` : `Hoje às ${apt.time}`;
      isNear = true;
    } else if (isTomorrow) {
      urgencyLevel = 'tomorrow';
      badgeLabel = 'LEMBRETE: AMANHÃ';
      countdownText = `Amanhã às ${apt.time}`;
      isNear = diffHours <= 36;
    } else if (diffDays <= 7) {
      urgencyLevel = 'upcoming';
      badgeLabel = `EM ${diffDays} DIAS`;
      countdownText = `Faltam ${diffDays} dias (${apt.date})`;
      isNear = false;
    }

    return {
      aptDate,
      diffMinutes,
      diffHours,
      diffDays,
      isToday,
      isTomorrow,
      urgencyLevel,
      badgeLabel,
      countdownText,
      isNear,
    };
  };

  // Filter appointments
  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        if (apt.status !== 'confirmado') return false;
        const aptDate = parseAppointmentDateTime(apt.date, apt.time);
        // Consider upcoming if within 45 mins after start or in future
        return aptDate.getTime() >= currentTime.getTime() - 45 * 60 * 1000;
      })
      .sort((a, b) => {
        const dateA = parseAppointmentDateTime(a.date, a.time).getTime();
        const dateB = parseAppointmentDateTime(b.date, b.time).getTime();
        return dateA - dateB;
      });
  }, [appointments, currentTime]);

  const pastAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (apt.status !== 'confirmado') return true;
      const aptDate = parseAppointmentDateTime(apt.date, apt.time);
      return aptDate.getTime() < currentTime.getTime() - 45 * 60 * 1000;
    });
  }, [appointments, currentTime]);

  const displayedList = filter === 'proximos' ? upcomingAppointments : pastAppointments;

  // Find the single nearest upcoming appointment
  const nearestUpcoming = upcomingAppointments[0] || null;
  const nearestUrgency = nearestUpcoming ? calculateUrgency(nearestUpcoming) : null;

  // Toast notification alert on mounting if there is an imminent or today appointment
  useEffect(() => {
    if (nearestUpcoming && nearestUrgency?.isNear) {
      const notifiedKey = `bigodegrosso_notified_${nearestUpcoming.id}_${nearestUpcoming.date}_${nearestUpcoming.time}`;
      if (!sessionStorage.getItem(notifiedKey)) {
        sessionStorage.setItem(notifiedKey, 'true');
        toast(
          nearestUrgency.urgencyLevel === 'imminent'
            ? '🔔 Horário Marcado Próximo!'
            : '📅 Lembrete de Agendamento Bigode Grosso',
          {
            description: `${nearestUpcoming.serviceName} com ${nearestUpcoming.barberName} — ${nearestUrgency.countdownText}.`,
            duration: 6000,
          }
        );
      }
    }
  }, [nearestUpcoming?.id, nearestUrgency?.isNear]);

  // Add to Calendar helper
  const handleAddToCalendar = (apt: Appointment) => {
    const title = encodeURIComponent(`Bigode Grosso: ${apt.serviceName} com ${apt.barberName}`);
    const details = encodeURIComponent(
      `Agendamento na Barbearia Bigode Grosso.\nServiço: ${apt.serviceName}\nBarbeiro: ${apt.barberName}\nEndereço: ${BARBERSHOP_INFO.address}\nTelefone: ${BARBERSHOP_INFO.phone}`
    );
    const location = encodeURIComponent(BARBERSHOP_INFO.address);

    const startIso = `${apt.date.replace(/-/g, '')}T${apt.time.replace(':', '')}00`;
    const endHour = String(Number(apt.time.split(':')[0]) + 1).padStart(2, '0');
    const endIso = `${apt.date.replace(/-/g, '')}T${endHour}${apt.time.split(':')[1]}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    safeOpenLink(gcalUrl);
  };

  const safeOpenLink = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleWhatsAppConfirm = (apt: Appointment) => {
    const text = encodeURIComponent(
      `Olá! Estou a caminho para o meu agendamento na Barbearia Bigode Grosso:\n\n✂️ Serviço: ${apt.serviceName}\n👤 Barbeiro: ${apt.barberName}\n📅 Data: ${apt.date}\n⏰ Horário: ${apt.time}\nCliente: ${apt.userName}`
    );
    safeOpenLink(`https://wa.me/${BARBERSHOP_INFO.phoneClean}?text=${text}`);
  };

  const handleOpenMaps = () => {
    safeOpenLink(BARBERSHOP_INFO.mapsUrl);
  };

  const handleTestAlert = () => {
    if (!nearestUpcoming || !nearestUrgency) return;
    toast.info('🔔 Alerta de Horário Próximo!', {
      description: `Seu agendamento de ${nearestUpcoming.serviceName} está confirmado para ${nearestUrgency.countdownText}! Não se atrase.`,
      duration: 5000,
    });
  };

  return (
    <div className="pb-28 px-4 pt-2 space-y-4">
      {/* Title & Filters */}
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Meus Agendamentos</h2>
        <p className="text-xs text-slate-400">Consulte seus horários marcados e notificações de atendimento</p>
      </div>

      {/* ========================================================================= */}
      {/* DESTAQUE VISUAL: NOTIFICAÇÃO DE HORÁRIO PRÓXIMO                           */}
      {/* ========================================================================= */}
      {filter === 'proximos' && nearestUpcoming && nearestUrgency && nearestUrgency.isNear && (
        <div className="relative overflow-hidden rounded-3xl border border-[#E31837]/40 bg-gradient-to-b from-[#1E1118] via-[#121626] to-[#0A0D18] p-4 shadow-[0_12px_40px_rgba(227,24,55,0.2)] animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Ambient background glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#E31837]/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#0EA5E9]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Header Badge */}
          <div className="relative flex items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31837] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E31837]"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-[#E31837] animate-bounce" />
                {nearestUrgency.badgeLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#E31837]/20 border border-[#E31837]/40 px-2.5 py-1 rounded-full text-red-200 text-[11px] font-bold">
              <Clock className="w-3 h-3 text-[#E31837]" />
              <span>{nearestUrgency.countdownText}</span>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="relative pt-3 pb-2 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wide text-slate-400 block">
                Próximo Atendimento
              </span>
              <h3 className="text-base font-extrabold text-white font-heading leading-tight flex items-center gap-1.5">
                {nearestUpcoming.serviceName}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span className="font-semibold text-white">{nearestUpcoming.barberName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#0EA5E9] font-mono font-bold">R$ {nearestUpcoming.servicePrice}</span>
              </p>
            </div>

            <div className="relative flex-shrink-0">
              <img
                src={nearestUpcoming.barberImage}
                alt={nearestUpcoming.barberName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E31837]/50 shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-[#0EA5E9] text-white p-1 rounded-full shadow">
                <Scissors className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Location & Time info box */}
          <div className="relative my-2.5 bg-black/40 border border-white/5 rounded-2xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-[#E31837] flex-shrink-0" />
              <div className="leading-tight">
                <span className="font-medium block text-[11px] text-white">Barbearia Bigode Grosso</span>
                <span className="text-[10px] text-slate-400">R. Vilma Dias de Souza - Candeias</span>
              </div>
            </div>

            <button
              onClick={handleOpenMaps}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-[11px] font-bold text-white flex items-center gap-1 transition"
            >
              <span>Como Chegar</span>
              <ExternalLink className="w-3 h-3 text-[#0EA5E9]" />
            </button>
          </div>

          {/* Action CTAs */}
          <div className="relative pt-1 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleWhatsAppConfirm(nearestUpcoming)}
              className="min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Avisar a Caminho</span>
            </button>

            <button
              onClick={handleTestAlert}
              className="min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition"
            >
              <AlarmClock className="w-4 h-4 text-amber-400" />
              <span>Ver Lembrete</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="grid grid-cols-2 p-1 bg-[#0E1322] border border-white/10 rounded-2xl">
        <button
          onClick={() => setFilter('proximos')}
          className={`min-h-[42px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === 'proximos'
              ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Próximos</span>
          {upcomingAppointments.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#0EA5E9] text-white text-[10px] font-extrabold flex items-center justify-center">
              {upcomingAppointments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilter('anteriores')}
          className={`min-h-[42px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === 'anteriores'
              ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Anteriores</span>
          <span className="text-[10px] text-slate-400">({pastAppointments.length})</span>
        </button>
      </div>

      {/* Appointments List */}
      {displayedList.length === 0 ? (
        <div className="text-center py-12 px-6 rounded-3xl bg-[#0E1322] border border-white/[0.06] space-y-3">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-slate-500">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {filter === 'proximos'
              ? 'Nenhum agendamento futuro encontrado'
              : 'Nenhum agendamento anterior'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {filter === 'proximos'
              ? 'Que tal garantir seu corte ou barba com os mestres da Bigode Grosso hoje mesmo?'
              : 'Seus cortes finalizados aparecerão aqui no seu histórico.'}
          </p>
          {filter === 'proximos' && (
            <button
              onClick={() => setActiveTab('agendar')}
              className="mt-3 px-5 min-h-[46px] rounded-2xl bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white font-bold text-xs shadow-lg shadow-[#E31837]/30 hover:scale-105 active:scale-95 transition"
            >
              Fazer Novo Agendamento
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedList.map((apt) => {
            const isConfirmed = apt.status === 'confirmado';
            const isCancelled = apt.status === 'cancelado';
            const isCompleted = apt.status === 'concluido';
            const urgency = calculateUrgency(apt);
            const isHighlighted = isConfirmed && filter === 'proximos' && apt.id === nearestUpcoming?.id;

            return (
              <div
                key={apt.id}
                className={`relative rounded-3xl border p-4 space-y-3.5 transition-all overflow-hidden ${
                  isHighlighted
                    ? 'bg-gradient-to-b from-[#181C30] via-[#0E1424] to-[#0A0D18] border-[#E31837]/60 shadow-[0_0_28px_rgba(227,24,55,0.22)]'
                    : isConfirmed
                    ? 'bg-[#0E1424] border-white/10 shadow-lg'
                    : 'bg-[#0A0D17] border-white/5 opacity-80'
                }`}
              >
                {/* Visual Highlight Badge for the approaching appointment */}
                {isHighlighted && (
                  <div className="bg-gradient-to-r from-[#E31837] via-[#C4122C] to-[#0EA5E9] -mx-4 -mt-4 mb-3 px-4 py-1.5 flex items-center justify-between text-white shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {urgency.isNear ? urgency.badgeLabel : 'PRÓXIMO NA SUA AGENDA'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {urgency.countdownText}
                    </span>
                  </div>
                )}

                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Agendamento
                    </span>
                    <h3 className="text-base font-bold font-heading text-white">
                      {apt.serviceName}
                    </h3>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isConfirmed
                        ? isHighlighted && urgency.isNear
                          ? 'bg-[#E31837]/20 text-red-200 border border-[#E31837]/40 animate-pulse'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : isCancelled
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-blue-500/15 text-[#38BDF8] border border-blue-500/30'
                    }`}
                  >
                    {isConfirmed && <CheckCircle className="w-3 h-3" />}
                    {isCancelled && <XCircle className="w-3 h-3" />}
                    {isCompleted && <CheckCircle className="w-3 h-3" />}
                    {isConfirmed
                      ? urgency.isNear && isHighlighted
                        ? 'Horário Próximo'
                        : 'Confirmado'
                      : isCancelled
                      ? 'Cancelado'
                      : 'Concluído'}
                  </span>
                </div>

                {/* Barber and Price details */}
                <div className="flex items-center justify-between py-2 border-y border-white/5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={apt.barberImage}
                      alt={apt.barberName}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">
                        Profissional
                      </span>
                      <span className="text-xs font-bold text-white leading-tight">
                        {apt.barberName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block leading-tight">Valor</span>
                    <span className="text-xs font-bold text-[#0EA5E9] font-mono leading-tight">
                      R$ {apt.servicePrice}
                    </span>
                  </div>
                </div>

                {/* Date & Time pills */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-2 p-2 rounded-xl text-slate-200 ${isHighlighted ? 'bg-white/[0.07] border border-white/10' : 'bg-white/[0.03]'}`}>
                    <Calendar className="w-3.5 h-3.5 text-[#E31837]" />
                    <span className="truncate font-medium">{apt.date}</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded-xl text-slate-200 ${isHighlighted ? 'bg-white/[0.07] border border-white/10' : 'bg-white/[0.03]'}`}>
                    <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span className="font-medium">{apt.time} ({apt.serviceDuration}m)</span>
                  </div>
                </div>

                {/* Notes if any */}
                {apt.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-white/[0.02] p-2 rounded-lg">
                    "{apt.notes}"
                  </p>
                )}

                {/* Action Buttons for active appointment */}
                {isConfirmed && (
                  <div className="pt-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddToCalendar(apt)}
                        className="min-h-[40px] flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-[#0EA5E9]" />
                        <span>Google Agenda</span>
                      </button>

                      <button
                        onClick={() => handleWhatsAppConfirm(apt)}
                        className="min-h-[40px] flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>

                    {/* Cancel action */}
                    {cancelingId === apt.id ? (
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 space-y-2 text-center animate-in fade-in">
                        <p className="text-xs text-red-300">
                          Tem certeza que deseja cancelar este agendamento?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              cancelAppointment(apt.id);
                              setCancelingId(null);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                          >
                            Sim, Cancelar
                          </button>
                          <button
                            onClick={() => setCancelingId(null)}
                            className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs"
                          >
                            Voltar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelingId(apt.id)}
                        className="w-full text-center text-[11px] text-slate-500 hover:text-red-400 py-1 transition flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Cancelar agendamento</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
