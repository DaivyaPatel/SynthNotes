import React from 'react';
import { getFaithfulnessTier, formatPercentage } from '../utils/formatScore';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface FaithfulnessIndicatorProps {
  score: number; // 0.0 - 1.0 or 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FaithfulnessIndicator: React.FC<FaithfulnessIndicatorProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const normalized = score > 1 ? score / 100 : score;
  const percentage = Math.round(normalized * 100);
  const tier = getFaithfulnessTier(normalized);

  const radius = size === 'lg' ? 44 : size === 'md' ? 32 : 18;
  const strokeWidth = size === 'lg' ? 7 : size === 'md' ? 5 : 3.5;
  const viewBoxSize = (radius + strokeWidth) * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - normalized * circumference;

  const Icon =
    normalized >= 0.88 ? ShieldCheck : normalized >= 0.75 ? AlertTriangle : AlertCircle;

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5 font-mono text-xs tabular-nums">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: tier.color }}
        />
        <span className="font-semibold text-[#2E2E2E]">{percentage}%</span>
        {showLabel && <span className="text-[#5A5A5A]">({tier.label})</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          className="transform -rotate-90"
        >
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            stroke="#EDF1EF"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            stroke={tier.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`font-mono font-bold tabular-nums ${
              size === 'lg' ? 'text-2xl' : 'text-lg'
            } text-[#2E2E2E]`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Icon className="w-4 h-4" style={{ color: tier.color }} />
            <span className="text-sm font-semibold text-[#2E2E2E]">{tier.label}</span>
          </div>
          <span className="text-xs text-[#5A5A5A] mt-0.5">
            Cross-referenced with source ground truth
          </span>
        </div>
      )}
    </div>
  );
};
