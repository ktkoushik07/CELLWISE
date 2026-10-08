import React, { useState, useEffect } from 'react';

interface CircularityScoreRingProps {
  score: number; // 0 - 100
  size?: number; // px width/height
  strokeWidth?: number;
  showLabel?: boolean;
  animate?: boolean;
  recommendation?: string;
}

export const CircularityScoreRing: React.FC<CircularityScoreRingProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  showLabel = true,
  animate = true,
  recommendation,
}) => {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    let start = 0;
    const duration = 1200; // 1.2s
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (score - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  let strokeColor = '#06B6D4'; // default cyan
  let glowColor = 'rgba(6, 182, 212, 0.3)';

  if (score >= 80) {
    strokeColor = '#10B981'; // green (REUSE)
    glowColor = 'rgba(16, 185, 129, 0.4)';
  } else if (score >= 65) {
    strokeColor = '#F59E0B'; // amber (SECOND-LIFE)
    glowColor = 'rgba(245, 158, 11, 0.4)';
  } else if (score >= 50) {
    strokeColor = '#0284C7'; // sky blue (FURTHER TESTING)
    glowColor = 'rgba(2, 132, 199, 0.4)';
  } else {
    strokeColor = '#F43F5E'; // rose red (RECYCLING)
    glowColor = 'rgba(244, 63, 94, 0.4)';
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="score-ring-circle"
          style={{
            filter: `drop-shadow(0px 0px 8px ${glowColor})`,
          }}
        />
      </svg>

      {/* Inner Score Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
          {displayScore}
        </span>
        <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mt-0.5">
          / 100
        </span>
        {showLabel && (
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest mt-1 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700">
            CIRCULARITY
          </span>
        )}
      </div>

      {recommendation && (
        <div className="mt-3 text-center">
          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-full border tracking-wide uppercase inline-block shadow-sm"
            style={{
              borderColor: strokeColor,
              color: strokeColor,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
            }}
          >
            {recommendation}
          </span>
        </div>
      )}
    </div>
  );
};
