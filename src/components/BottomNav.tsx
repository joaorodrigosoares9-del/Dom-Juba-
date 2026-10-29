import React from 'react';
import { Home, CalendarPlus, CalendarCheck, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MainTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, appointments, isAdmin } = useApp();

  const upcomingCount = appointments.filter((a) => a.status === 'confirmado').length;

  interface TabItem {
    id: MainTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const baseTabs: TabItem[] = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'agendar', label: 'Agendar', icon: CalendarPlus },
    { id: 'agendamentos', label: 'Agendamentos', icon: CalendarCheck, badge: upcomingCount },
    { id: 'perfil', label: 'Perfil', icon: UserIcon },
  ];

  const tabs: TabItem[] = isAdmin
    ? [...baseTabs, { id: 'admin', label: 'Admin', icon: ShieldCheck }]
    : baseTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto px-4 pb-4 pointer-events-none">
      <div className="pointer-events-auto bg-[#0F1422]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] rounded-3xl p-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[52px] py-1.5 px-2 rounded-2xl transition-all duration-300 active:scale-90 ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active Tab Background Pill with Pepperoni Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#E31837] to-[#BE122C] rounded-2xl shadow-lg shadow-[#E31837]/35 -z-10 animate-in fade-in zoom-in-95 duration-200" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-white' : 'text-slate-400'
                  }`}
                />

                {/* Badge for Appointments */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold rounded-full border border-[#0F1422] ${
                      isActive
                        ? 'bg-[#0EA5E9] text-white shadow-sm'
                        : 'bg-[#E31837] text-white animate-pulse'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-1 tracking-tight leading-none ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
