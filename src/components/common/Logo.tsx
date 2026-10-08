import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center bg-gradient-to-br from-cyan-500 to-teal-700 text-slate-950 p-2 rounded-lg shadow-lg shadow-cyan-950/40 border border-cyan-400/30">
        <Zap className={`${iconSizes[size]} text-slate-950 stroke-[2.5]`} />
        <ShieldCheck className="w-3 h-3 absolute -bottom-1 -right-1 text-teal-300 fill-slate-900" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-white font-mono">
          <span className={`${textSizes[size]} tracking-wider text-slate-100 font-extrabold`}>CELL</span>
          <span className={`${textSizes[size]} text-cyan-400 font-extrabold`}>WISE</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold tracking-widest">
            v2.4
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase">
            EV Circularity Decision Platform
          </span>
        )}
      </div>
    </div>
  );
};
