import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState('14:30');
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-medium text-slate-300 select-none bg-[#0B0F19]/90 backdrop-blur-md z-40 border-b border-white/[0.04]">
      {/* Time & Barber Crest */}
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-tight text-white">{time}</span>
        {!isOnline && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Offline
          </span>
        )}
      </div>

      {/* Dynamic Island / Speaker Notch Simulation */}
      <div className="w-20 h-4 bg-black/80 rounded-full flex items-center justify-center gap-1.5 border border-white/10 shadow-inner">
        <div className="w-2 h-2 rounded-full bg-[#1e293b]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#E31837]/80 animate-pulse" />
      </div>

      {/* Signals & Battery */}
      <div className="flex items-center gap-2 text-slate-300">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-mono">98%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
