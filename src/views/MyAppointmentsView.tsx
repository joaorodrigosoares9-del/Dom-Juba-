import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { Appointment } from '../types';

export const MyAppointmentsView: React.FC = () => {
  const { appointments, cancelAppointment, setActiveTab } = useApp();
  const [filter, setFilter] = useState<'proximos' | 'anteriores'>('proximos');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const upcomingAppointments = appointments.filter((apt) => {
    return apt.status === 'confirmado' && apt.date >= todayStr;
  });

  const pastAppointments = appointments.filter((apt) => {
    return apt.status !== 'confirmado' || apt.date < todayStr;
  });

  const displayedList = filter === 'proximos' ? upcomingAppointments : pastAppointments;

  // Add to Calendar helper
  const handleAddToCalendar = (apt: Appointment) => {
    const title = encodeURIComponent(`Don Juba: ${apt.serviceName} com ${apt.barberName}`);
    const details = encodeURIComponent(
      `Agendamento na Barbearia Don Juba.\nServiço: ${apt.serviceName}\nBarbeiro: ${apt.barberName}\nEndereço: ${BARBERSHOP_INFO.address}\nTelefone: ${BARBERSHOP_INFO.phone}`
    );
    const location = encodeURIComponent(BARBERSHOP_INFO.address);

    // Format start time
    const startIso = `${apt.date.replace(/-/g, '')}T${apt.time.replace(':', '')}00`;
    // Approx 1 hour duration
    const endHour = String(Number(apt.time.split(':')[0]) + 1).padStart(2, '0');
    const endIso = `${apt.date.replace(/-/g, '')}T${endHour}${apt.time.split(':')[1]}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  const handleWhatsAppConfirm = (apt: Appointment) => {
    const text = encodeURIComponent(
      `Olá! Gostaria de confirmar meu agendamento na Barbearia Don Juba:\n\n✂️ Serviço: ${apt.serviceName}\n👤 Barbeiro: ${apt.barberName}\n📅 Data: ${apt.date}\n⏰ Horário: ${apt.time}\nCliente: ${apt.userName}`
    );
    window.open(`https://wa.me/${BARBERSHOP_INFO.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="pb-28 px-4 pt-2 space-y-4">
      {/* Title & Filters */}
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Meus Agendamentos</h2>
        <p className="text-xs text-slate-400">Consulte seus horários agendados e histórico</p>
      </div>

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
              ? 'Que tal garantir seu corte ou barba com os mestres da Cabelo & Barba hoje mesmo?'
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

            return (
              <div
                key={apt.id}
                className={`rounded-2xl border p-4 space-y-3.5 shadow-xl transition-all ${
                  isConfirmed
                    ? 'bg-[#0E1424] border-white/10'
                    : 'bg-[#0A0D17] border-white/5 opacity-80'
                }`}
              >
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
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : isCancelled
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-blue-500/15 text-[#38BDF8] border border-blue-500/30'
                    }`}
                  >
                    {isConfirmed && <CheckCircle className="w-3 h-3" />}
                    {isCancelled && <XCircle className="w-3 h-3" />}
                    {isCompleted && <CheckCircle className="w-3 h-3" />}
                    {isConfirmed ? 'Confirmado' : isCancelled ? 'Cancelado' : 'Concluído'}
                  </span>
                </div>

                {/* Barber and Price details */}
                <div className="flex items-center justify-between py-2 border-y border-white/5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={apt.barberImage}
                      alt={apt.barberName}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
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
                  <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-xl text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-[#E31837]" />
                    <span className="truncate">{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-xl text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>{apt.time} ({apt.serviceDuration}m)</span>
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
