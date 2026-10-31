import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Lock, Mail, User, Phone, ArrowRight, UserCheck, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BARBERSHOP_INFO } from '../data/barbershopData';

export const AuthView: React.FC = () => {
  const { loginAsGuest, loginWithEmail } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email, name, phone);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between p-6 overflow-hidden">
      {/* Background Ambience: Luxury Barber Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#E31837]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header & Crest */}
      <div className="pt-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E31837] via-[#C4122C] to-[#0EA5E9] p-0.5 shadow-2xl shadow-[#E31837]/30 mb-4"
        >
          <div className="w-full h-full bg-[#0B0F19] rounded-[22px] flex items-center justify-center">
            <Scissors className="w-10 h-10 text-[#E31837]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl font-extrabold font-heading text-white tracking-tight"
        >
          {BARBERSHOP_INFO.name}
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xs text-[#0EA5E9] font-medium tracking-wide uppercase mt-1"
        >
          {BARBERSHOP_INFO.headline}
        </motion.p>
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="w-full bg-[#0E1322]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl my-6"
      >
        {/* Toggle between Login and Register */}
        <div className="grid grid-cols-2 p-1 bg-black/40 rounded-2xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`min-h-[44px] rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`min-h-[44px] rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#E31837] to-[#BE122C] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 ml-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[48px] bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 ml-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 ml-1">
                WhatsApp / Celular
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="(77) 98845-9301"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[48px] bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 ml-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[50px] mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E31837] to-[#BE122C] hover:from-[#FF2243] hover:to-[#D41432] text-white font-bold text-sm shadow-xl shadow-[#E31837]/30 active:scale-95 transition"
          >
            <span>{mode === 'login' ? 'Acessar Conta' : 'Concluir Cadastro'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Guest Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0E1322] px-3 text-slate-400 uppercase tracking-wider text-[10px]">
              Ou sem cadastro
            </span>
          </div>
        </div>

        {/* Enter as Guest / Preview Button */}
        <button
          type="button"
          onClick={loginAsGuest}
          className="w-full min-h-[50px] flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-white/[0.08] to-white/[0.04] hover:bg-white/[0.12] border border-[#0EA5E9]/40 hover:border-[#0EA5E9] text-white font-semibold text-sm active:scale-95 transition shadow-lg shadow-[#0EA5E9]/10"
        >
          <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
          <span>Ver Demonstração Completa (Visitante)</span>
        </button>
      </motion.div>

      {/* Footer reassurance */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agendamento rápido e seguro em Vitória da Conquista</span>
        </div>
      </div>
    </div>
  );
};
