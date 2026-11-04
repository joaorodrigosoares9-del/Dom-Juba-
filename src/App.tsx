/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileStatusBar } from './components/MobileStatusBar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PWAInstallModal } from './components/PWAInstallModal';
import { AuthView } from './views/AuthView';
import { HomeView } from './views/HomeView';
import { BookingView } from './views/BookingView';
import { MyAppointmentsView } from './views/MyAppointmentsView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { BARBERSHOP_INFO } from './data/barbershopData';
import { Scissors, Smartphone, Sparkles, MapPin } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, activeTab } = useApp();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      {/* Sonner Toast configured for Mobile */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0E1322',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
            fontSize: '13px',
          },
          className: 'mobile-toast',
        }}
        richColors
        closeButton
      />

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Outer Desktop Wrapper with Ambient Barber Glow */}
      <div className="min-h-screen w-full bg-[#05070B] flex flex-col items-center justify-center sm:p-4 lg:p-6 relative overflow-x-hidden">
        {/* Background Ambient Lighting (Pepperoni Red & Ocean Blue) */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-[#E31837]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[550px] h-[550px] bg-[#0EA5E9]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        {/* Desktop Helper Brand Header (hidden on mobile) */}
        <header className="hidden md:flex items-center justify-between w-full max-w-[480px] mb-3 px-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E31837] animate-pulse" />
            <span className="font-semibold text-slate-300">{BARBERSHOP_INFO.name}</span>
            <span className="text-[10px] text-slate-400">• App Mobile</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#0EA5E9] font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>Vitória da Conquista - BA</span>
          </div>
        </header>

        {/* Centralized Mobile App Frame: Max Width 480px */}
        <main
          className="relative w-full max-w-[480px] h-full min-h-screen sm:min-h-[640px] sm:h-[860px] sm:max-h-[94vh] bg-[#07090E] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-0 sm:border sm:border-white/10 overflow-hidden flex flex-col"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Mobile Status Bar */}
          <MobileStatusBar />

          {/* Conditional Rendering: Auth View vs Authenticated / Visitor App */}
          {!user ? (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <AuthView />
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Fixed Header */}
              <Header onOpenInstallModal={() => setIsInstallModalOpen(true)} />

              {/* Scrollable View Area with Smooth Transitions */}
              <div className="flex-1 overflow-y-auto no-scrollbar relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'inicio' && (
                    <motion.div
                      key="tab-inicio"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-full"
                    >
                      <HomeView />
                    </motion.div>
                  )}

                  {activeTab === 'agendar' && (
                    <motion.div
                      key="tab-agendar"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-full"
                    >
                      <BookingView />
                    </motion.div>
                  )}

                  {activeTab === 'agendamentos' && (
                    <motion.div
                      key="tab-agendamentos"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-full"
                    >
                      <MyAppointmentsView />
                    </motion.div>
                  )}

                  {activeTab === 'perfil' && (
                    <motion.div
                      key="tab-perfil"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-full"
                    >
                      <ProfileView onOpenInstallModal={() => setIsInstallModalOpen(true)} />
                    </motion.div>
                  )}

                  {activeTab === 'admin' && (
                    <motion.div
                      key="tab-admin"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-full"
                    >
                      <AdminView />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fixed Bottom Navigation (4 Tabs) */}
              <BottomNav />
            </div>
          )}

          {/* Desktop Home Bar Indicator */}
          <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full pointer-events-none z-50" />
        </main>

        {/* Desktop Footer Subtext */}
        <footer className="hidden sm:block mt-3 text-center text-[11px] text-slate-400">
          <span>Barbearia Bigode Grosso PWA • Design Mobile-First</span>
        </footer>
      </div>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
