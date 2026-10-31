import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarPlus,
  Scissors,
  Clock,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Award,
  Users,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BARBERSHOP_INFO, GALLERY_PHOTOS, SERVICES } from '../data/barbershopData';
import { Service } from '../types';

export const HomeView: React.FC = () => {
  const { user, setActiveTab, startBookingWithService, services, isAdmin } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof GALLERY_PHOTOS)[0] | null>(null);

  // Quick contact form state
  const [formName, setFormName] = useState(user?.name || '');
  const [formPhone, setFormPhone] = useState(user?.phone || '');
  const [formMessage, setFormMessage] = useState('');

  const safeOpenLink = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;
    const text = encodeURIComponent(
      `Olá, Barbearia Don Juba!\n\nNome: ${formName.trim()}\nTelefone: ${formPhone.trim() || 'Não informado'}\n\nMensagem: ${formMessage.trim()}`
    );
    safeOpenLink(`https://wa.me/${BARBERSHOP_INFO.phoneClean}?text=${text}`);
  };

  return (
    <div className="pb-28 space-y-7">
      {/* 1. HERO SECTION (Clean, confident, striking barbershop aesthetic) */}
      <section className="relative px-4 pt-3">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F1422]">
          {/* Barber Hero Image with dark gradient overlays */}
          <div className="relative h-96 w-full">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
              alt="Ambiente Barbearia Cabelo e Barba"
              className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1422] via-[#0F1422]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1422]/70 via-transparent to-transparent" />

            {/* Badges on top */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E31837] text-white shadow-lg shadow-[#E31837]/30">
                <Scissors className="w-3.5 h-3.5" />
                Vitória da Conquista
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                4.9 (500+ avaliações)
              </span>
            </div>

            {/* Hero Typography & CTA */}
            <div className="absolute bottom-5 left-5 right-5 space-y-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-[#0EA5E9] font-bold">
                  Barbearia Tradicional &amp; Moderna
                </p>
                <h2 className="text-3xl font-extrabold font-heading text-white leading-tight">
                  Estilo &amp; <span className="bg-gradient-to-r from-[#FF2E4D] to-[#E31837] bg-clip-text text-transparent">Tradição</span>
                </h2>
                <p className="text-xs text-slate-300 font-normal line-clamp-2">
                  Excelência em cortes masculinos, barboterapia com toalha quente e visagismo sob medida.
                </p>
              </div>

              {/* Main CTA: Min 48px height */}
              <button
                onClick={() => setActiveTab('agendar')}
                className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E31837] to-[#BE122C] hover:from-[#FF2243] hover:to-[#D41432] text-white font-bold text-sm shadow-xl shadow-[#E31837]/40 active:scale-95 transition"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Agende seu Horário Agora</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Quick Banner (Visible when admin is logged in) */}
      {isAdmin && (
        <section className="px-4">
          <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-[#0EA5E9]/40 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E31837] flex items-center justify-center text-white">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider block">
                  Painel de Administração
                </span>
                <span className="text-xs font-bold text-white">
                  Controle total sobre agendamentos e cortes
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-3 py-1.5 rounded-xl bg-[#0EA5E9] text-white text-xs font-bold shadow hover:bg-[#38BDF8] active:scale-95 transition"
            >
              Acessar
            </button>
          </div>
        </section>
      )}

      {/* 2. NOSSOS SERVIÇOS & CORTES (Dynamic from Admin Catalog) */}
      <section className="px-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0EA5E9]">
              Menu de Experiências
            </span>
            <h3 className="text-xl font-bold font-heading text-white">Nossos Serviços</h3>
          </div>
          <button
            onClick={() => setActiveTab('agendar')}
            className="text-xs font-semibold text-[#E31837] hover:text-white flex items-center gap-1 transition"
          >
            Ver todos ({services.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {services.slice(0, 4).map((service: Service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl bg-[#0E1322] border border-white/[0.08] hover:border-white/20 p-3 flex gap-3.5 shadow-lg transition-all"
            >
              {/* Service Barber Photo */}
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative bg-slate-900 border border-white/10">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 backdrop-blur-md text-white flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5 text-[#0EA5E9]" />
                  {service.durationMinutes}m
                </span>
              </div>

              {/* Service Details */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold font-heading text-white line-clamp-1">
                      {service.name}
                    </h4>
                    <span className="text-sm font-black text-[#0EA5E9] shrink-0 font-mono">
                      R$ {service.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Direct Book Button */}
                <button
                  onClick={() => startBookingWithService(service)}
                  className="mt-2 w-full min-h-[38px] flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] hover:bg-[#E31837] active:bg-[#BE122C] text-white text-xs font-semibold border border-white/10 hover:border-transparent transition-all"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-[#E31837] group-hover:text-white" />
                  <span>Agendar este serviço</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GALERIA DE FOTOS (Nicho real de Barbearia) */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0EA5E9]">
              Portfolio Real
            </span>
            <h3 className="text-xl font-bold font-heading text-white">Galeria de Cortes</h3>
          </div>
          <span className="text-xs text-slate-400">Toque para ampliar</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {GALLERY_PHOTOS.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group focus:outline-none"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                <span className="text-[10px] text-white font-semibold line-clamp-1">
                  {photo.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 6. LOCALIZAÇÃO E CONTATO */}
      <section className="px-4 space-y-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0EA5E9]">
            Venha nos Visitar
          </span>
          <h3 className="text-xl font-bold font-heading text-white">Localização &amp; Contato</h3>
        </div>

        <div className="rounded-3xl bg-[#0E1322] border border-white/[0.08] p-4 space-y-3.5 shadow-xl">
          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-[#E31837] flex items-center justify-center shrink-0 border border-red-500/20">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white">Endereço</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {BARBERSHOP_INFO.address}
              </p>
              <a
                href={BARBERSHOP_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0EA5E9] hover:underline mt-1"
              >
                Abrir no Google Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Phone / WhatsApp */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white">Telefone &amp; WhatsApp</h4>
              <p className="text-xs font-semibold text-emerald-400 font-mono mt-0.5">{BARBERSHOP_INFO.phone}</p>
            </div>
          </div>

          {/* Horário de Atendimento Detalhado */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white">Horário de Funcionamento</h4>
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

          {/* Action WhatsApp Button (min 48px height) */}
          <a
            href={BARBERSHOP_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar com o Barbeiro no WhatsApp</span>
          </a>

          {/* Quick Contact Form */}
          <div className="pt-3 border-t border-white/5 space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0EA5E9]">
                Envie uma Mensagem
              </span>
              <h4 className="text-xs font-bold text-white">Formulário de Contato Rápido</h4>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full min-h-[42px] bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(77) 98845-9301"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full min-h-[42px] bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mensagem ou Dúvida *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Escreva sua mensagem ou dúvida sobre os cortes..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E31837] to-[#BE122C] hover:from-[#FF2243] hover:to-[#D41432] text-white font-bold text-xs shadow-md shadow-[#E31837]/30 active:scale-95 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enviar Dúvida via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="w-full max-w-sm bg-[#0E1322] border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-1">
              <h4 className="text-base font-bold font-heading text-white">
                {selectedPhoto.title}
              </h4>
              <p className="text-xs text-slate-400">{selectedPhoto.description}</p>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-full min-h-[44px] mt-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
              >
                Fechar foto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
