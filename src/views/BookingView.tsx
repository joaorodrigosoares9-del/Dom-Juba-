import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  Clock,
  User,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BARBERS, BARBERSHOP_INFO, SERVICES, TIME_SLOTS } from '../data/barbershopData';
import { Barber, Service } from '../types';

export const BookingView: React.FC = () => {
  const {
    user,
    bookingState,
    setBookingStep,
    selectService,
    selectBarber,
    selectDate,
    selectTime,
    setBookingNotes,
    confirmAppointment,
    services,
  } = useApp();

  const { step, selectedService, selectedBarber, selectedDate, selectedTime, notes } = bookingState;

  // Category filter for step 1
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'cabelo' | 'barba' | 'combo' | 'tratamento'>('todos');

  // Customer form details in step 5
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');

  // Calendar State for step 3
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  // Generate calendar days
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === today.getMonth() && calendarYear === today.getFullYear()) return;
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const filteredServices = services.filter((s) => {
    if (categoryFilter === 'todos') return true;
    return s.category === categoryFilter;
  });

  // Slide variant for smooth horizontal page transitions
  const slideVariants = {
    initial: { opacity: 0, x: 25 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -25 },
  };

  return (
    <div className="pb-28 px-4 pt-2">
      {/* 5-Step Stepper Header */}
      <div className="mb-5 bg-[#0E1322] border border-white/[0.08] p-3.5 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Etapa {step} de 5
          </span>
          <span className="text-xs font-bold text-[#E31837]">
            {step === 1 && 'Serviço'}
            {step === 2 && 'Profissional'}
            {step === 3 && 'Data'}
            {step === 4 && 'Horário'}
            {step === 5 && 'Confirmação'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                s <= step
                  ? 'bg-gradient-to-r from-[#E31837] to-[#0EA5E9]'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: ESCOLHER SERVIÇO */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Escolha o seu Serviço</h2>
              <p className="text-xs text-slate-400">Selecione o corte, barba ou tratamento desejado</p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'cabelo', label: 'Cabelo' },
                { id: 'barba', label: 'Barba' },
                { id: 'combo', label: 'Combos' },
                { id: 'tratamento', label: 'Tratamento' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    categoryFilter === tab.id
                      ? 'bg-[#E31837] text-white shadow-md shadow-[#E31837]/30'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Services List */}
            <div className="space-y-3">
              {filteredServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => selectService(service)}
                    className={`cursor-pointer rounded-2xl p-3.5 flex gap-3.5 border transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#151D30] border-[#E31837] shadow-xl shadow-[#E31837]/20 ring-1 ring-[#E31837]'
                        : 'bg-[#0E1322] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-slate-900 border border-white/10">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white font-heading">
                            {service.name}
                          </h3>
                          <span className="text-sm font-extrabold text-[#0EA5E9] font-mono">
                            R$ {service.price}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 text-[#0EA5E9]" />
                          {service.durationMinutes} minutos
                        </span>
                        <span className="text-xs font-bold text-[#E31837] flex items-center gap-1">
                          Selecionar
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: ESCOLHER PROFISSIONAL */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Escolha o Barbeiro</h2>
              <p className="text-xs text-slate-400">Nossa equipe conta com 5 mestres especialistas</p>
            </div>

            {/* Quick Option: Any Barber Available */}
            <div
              onClick={() => selectBarber(null)}
              className="cursor-pointer rounded-2xl p-4 bg-gradient-to-r from-[#172033] to-[#0E1322] border border-[#0EA5E9]/40 hover:border-[#0EA5E9] shadow-lg flex items-center justify-between active:scale-[0.98] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0EA5E9]/20 text-[#0EA5E9] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Qualquer Barbeiro Disponível</h3>
                  <p className="text-xs text-slate-300">Primeiro horário mais rápido para você</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#0EA5E9]" />
            </div>

            {/* Barbers List */}
            <div className="space-y-3">
              {BARBERS.map((barber) => {
                const isSelected = selectedBarber?.id === barber.id;
                return (
                  <div
                    key={barber.id}
                    onClick={() => selectBarber(barber)}
                    className={`cursor-pointer rounded-2xl p-3.5 flex items-center gap-3.5 border transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#151D30] border-[#E31837] shadow-xl shadow-[#E31837]/20 ring-1 ring-[#E31837]'
                        : 'bg-[#0E1322] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 relative border border-white/10">
                      <img
                        src={barber.imageUrl}
                        alt={barber.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white font-heading">
                          {barber.name}
                        </h3>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {barber.rating}
                        </span>
                      </div>
                      <p className="text-xs text-[#0EA5E9] font-medium">{barber.nickname}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {barber.specialty}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 3: ESCOLHER DATA (CALENDÁRIO INTERATIVO) */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Escolha a Data</h2>
              <p className="text-xs text-slate-400">Atendimento de segunda a sábado (domingo fechado)</p>
            </div>

            {/* Interactive Calendar Card */}
            <div className="rounded-3xl bg-[#0E1322] border border-white/[0.08] p-4 shadow-xl">
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-white capitalize">
                  {monthNames[calendarMonth]} {calendarYear}
                </h3>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day of Week Labels */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                <span>DOM</span>
                <span>SEG</span>
                <span>TER</span>
                <span>QUA</span>
                <span>QUI</span>
                <span>SEX</span>
                <span>SÁB</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty cells for leading offset */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10" />
                ))}

                {/* Actual Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(calendarYear, calendarMonth, dayNum);
                  const dayOfWeek = dateObj.getDay();
                  const isSunday = dayOfWeek === 0;

                  // Format to YYYY-MM-DD
                  const monthFormatted = String(calendarMonth + 1).padStart(2, '0');
                  const dayFormatted = String(dayNum).padStart(2, '0');
                  const dateString = `${calendarYear}-${monthFormatted}-${dayFormatted}`;

                  const isPast =
                    dateObj.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
                  const isDisabled = isPast || isSunday;
                  const isSelected = selectedDate === dateString;

                  return (
                    <button
                      key={dayNum}
                      disabled={isDisabled}
                      onClick={() => selectDate(dateString)}
                      className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#E31837] to-[#BE122C] text-white shadow-lg shadow-[#E31837]/40 ring-2 ring-white/20'
                          : isDisabled
                          ? 'text-slate-600 cursor-not-allowed bg-transparent'
                          : 'text-slate-200 hover:bg-white/10 active:scale-95 bg-white/[0.03]'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isSelected && <span className="w-1 h-1 rounded-full bg-white mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E31837]" />
                  <span>Selecionado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span>Indisponível / Fechado</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: ESCOLHER HORÁRIO */}
        {step === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Escolha o Horário</h2>
              <p className="text-xs text-slate-400">
                Data selecionada: <strong className="text-white">{selectedDate}</strong>
              </p>
            </div>

            {/* Time Slot Sections */}
            <div className="space-y-4">
              {(() => {
                const selectedDayOfWeek = selectedDate ? new Date(selectedDate + 'T12:00:00').getDay() : null;
                const isSaturday = selectedDayOfWeek === 6;
                const isMonOrTue = selectedDayOfWeek === 1 || selectedDayOfWeek === 2;

                const morningSlots = isSaturday
                  ? ['09:00', '09:45', '10:30', '11:15', '12:00']
                  : isMonOrTue
                  ? ['08:39', '09:20', '10:00', '10:45', '11:30', '12:15']
                  : ['08:30', '09:15', '10:00', '10:45', '11:30', '12:15'];

                const afternoonSlots = isSaturday
                  ? ['13:00', '13:45', '14:30', '15:15', '16:00', '16:30']
                  : ['13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15'];

                const expedienteLabel = isSaturday
                  ? '09:00 às 17:00 (Sábado)'
                  : isMonOrTue
                  ? '08:39 às 19:00 (Segunda/Terça)'
                  : '08:30 às 19:00';

                return (
                  <>
                    {/* Operating hours pill for selected date */}
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Expediente do dia:</span>
                      <span className="font-semibold text-amber-400 font-mono">
                        {expedienteLabel}
                      </span>
                    </div>

                    {/* Manhã */}
                    <div>
                      <h3 className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
                        {isSaturday ? 'Manhã (09:00 – 12:00)' : isMonOrTue ? 'Manhã (08:39 – 12:15)' : 'Manhã (08:30 – 12:15)'}
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {morningSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              onClick={() => selectTime(time)}
                              className={`min-h-[44px] rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-lg shadow-[#E31837]/35 ring-1 ring-white/20'
                                  : 'bg-[#0E1322] border border-white/10 text-slate-200 hover:border-white/25'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tarde */}
                    <div>
                      <h3 className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
                        {isSaturday ? 'Tarde (13:00 – 17:00)' : 'Tarde (13:00 – 19:00)'}
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {afternoonSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              onClick={() => selectTime(time)}
                              className={`min-h-[44px] rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-lg shadow-[#E31837]/35 ring-1 ring-white/20'
                                  : 'bg-[#0E1322] border border-white/10 text-slate-200 hover:border-white/25'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* STEP 5: TELA DE CONFIRMAÇÃO */}
        {step === 5 && (
          <motion.div
            key="step5"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Revisão &amp; Confirmação</h2>
              <p className="text-xs text-slate-400">Verifique os detalhes do seu atendimento</p>
            </div>

            {/* Summary Card */}
            <div className="rounded-3xl bg-gradient-to-b from-[#131A2E] to-[#0A0D17] border border-white/10 p-4 space-y-4 shadow-2xl">
              {/* Service & Price */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={selectedService?.imageUrl}
                      alt={selectedService?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading">
                      {selectedService?.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedService?.durationMinutes} min de atendimento
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total</span>
                  <span className="text-lg font-black text-[#0EA5E9] font-mono">
                    R$ {selectedService?.price}
                  </span>
                </div>
              </div>

              {/* Barber Details */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={selectedBarber?.imageUrl}
                      alt={selectedBarber?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Barbeiro Especialista
                    </span>
                    <span className="text-sm font-bold text-white">
                      {selectedBarber?.name}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {selectedBarber?.rating}
                </span>
              </div>

              {/* Date & Time pill */}
              <div className="bg-white/[0.04] p-3 rounded-2xl flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Calendar className="w-4 h-4 text-[#E31837]" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Clock className="w-4 h-4 text-[#0EA5E9]" />
                  <span>{selectedTime}</span>
                </div>
              </div>

              {/* Customer input fields */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full min-h-[46px] bg-white/[0.04] border border-white/10 rounded-xl px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    WhatsApp para Lembrete
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(77) 98877-7071"
                    className="w-full min-h-[46px] bg-white/[0.04] border border-white/10 rounded-xl px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Observações ou Preferências (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Ex: Quero navalhado na zero com risco na sobrancelha..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Button: Min 48px height */}
            <button
              onClick={() => confirmAppointment()}
              className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E31837] to-[#BE122C] hover:from-[#FF2243] hover:to-[#D41432] text-white font-bold text-sm shadow-xl shadow-[#E31837]/35 active:scale-95 transition"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Confirmar Agendamento</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
