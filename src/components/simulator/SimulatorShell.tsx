
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface SimulatorShellProps {
  children: React.ReactNode;
  activeScenario?: string | null;
  currentStep?: number;
}

const SimulatorShell: React.FC<SimulatorShellProps> = ({ children, activeScenario, currentStep }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      setTime(`${ampm} ${hours}:${minutes}`);
    };
    
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  // Determine dynamic themes for Status Bar & Gesture bar based on simulator state
  let statusBarBg = 'bg-white';
  let statusBarText = 'text-slate-800';
  let bottomBarBg = 'bg-white';
  let bottomBarLine = 'bg-slate-300';
  let borderClass = 'border-b border-gray-150';

  if (activeScenario === 'kakaotalk') {
    statusBarBg = 'bg-[#BACEE0]';
    statusBarText = 'text-slate-800';
    bottomBarBg = 'bg-white';
    bottomBarLine = 'bg-slate-300';
    borderClass = 'border-b border-slate-300/20';
  } else if (activeScenario === 'banking') {
    if (currentStep === 5) {
      statusBarBg = 'bg-[#141e30]';
      statusBarText = 'text-white';
      bottomBarBg = 'bg-[#141e30]';
      bottomBarLine = 'bg-slate-700';
      borderClass = 'border-b border-slate-800/30';
    } else if (currentStep === 1) {
      statusBarBg = 'bg-[#F4F5F7]';
      statusBarText = 'text-slate-800';
      bottomBarBg = 'bg-[#F4F5F7]';
      bottomBarLine = 'bg-slate-300';
      borderClass = 'border-b border-transparent';
    } else {
      statusBarBg = 'bg-white';
      statusBarText = 'text-slate-800';
      bottomBarBg = 'bg-white';
      bottomBarLine = 'bg-slate-300';
      borderClass = 'border-b border-gray-150';
    }
  } else if (activeScenario === 'delivery') {
    if (currentStep === 1) {
      statusBarBg = 'bg-[#2AC1BC]';
      statusBarText = 'text-white';
      bottomBarBg = 'bg-white';
      bottomBarLine = 'bg-slate-300';
      borderClass = 'border-b border-[#2AC1BC]/20';
    } else {
      statusBarBg = 'bg-white';
      statusBarText = 'text-slate-800';
      bottomBarBg = 'bg-white';
      bottomBarLine = 'bg-slate-300';
      borderClass = 'border-b border-gray-150';
    }
  }

  return (
    <div className="flex justify-center items-center h-full w-full bg-transparent p-2 sm:p-4 animate-in fade-in duration-500">
      {/* Physical Smartphone Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-[340px] xs:w-[360px] h-[660px] sm:h-[700px] max-h-[82vh] bg-slate-900 rounded-[48px] border-[10px] border-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] relative flex flex-col overflow-hidden select-none animate-in fade-in zoom-in-95 duration-300"
        id="phone-frame"
      >
        {/* Dynamic Island / Camera Cutout Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center border border-slate-800/50">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-850 absolute right-4"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950 absolute right-4.5"></div>
          <div className="w-16 h-1 bg-zinc-900 rounded-full absolute left-4"></div>
        </div>

        {/* Top Status Bar (Wifi, Signal, Clock, Battery) */}
        <div className={`h-10 ${statusBarBg} ${borderClass} flex-shrink-0 flex items-center justify-between px-6 pt-2 select-none z-40 text-xs font-bold transition-all duration-300 ${statusBarText}`}>
          <span className="text-[11px] tracking-tight">{time || '오전 10:30'}</span>
          <div className="flex items-center gap-1.5">
            <Signal size={12} className="stroke-[2.5]" />
            <span className="text-[9px] font-black tracking-tighter opacity-90">LTE</span>
            <Wifi size={12} className="stroke-[2.5]" />
            <div className="flex items-center gap-0.5 ml-0.5">
              <Battery size={15} className="stroke-[2.5] rotate-0" />
            </div>
          </div>
        </div>

        {/* Content Area - Fits the entire smartphone display */}
        <div className="flex-1 w-full overflow-hidden flex flex-col bg-white relative">
          {children}
        </div>

        {/* Bottom Gesture Indicator Swipe Bar */}
        <div className={`h-4 ${bottomBarBg} border-t border-gray-50/10 flex-shrink-0 flex items-center justify-center pb-1 z-40 transition-all duration-300`}>
          <div className={`w-28 h-1 ${bottomBarLine} rounded-full`}></div>
        </div>
      </motion.div>
    </div>
  );
};

export default SimulatorShell;
