import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
  icon?: ReactNode;
}

export function StatCard({ label, value, change, up, icon }: StatCardProps) {
  return (
    <div className="relative rounded-xl bg-white border border-ink-200/60 overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,.05)]">
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-2">
          <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.04em] leading-none">{label}</span>
          {icon && (
            <span className="text-ink-300 shrink-0 ml-2">{icon}</span>
          )}
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl md:text-[28px] font-bold text-ink-900 tracking-[-.02em] leading-none">
            {value}
          </span>
          {change && (
            <span className={`text-xs font-semibold ${up ? 'text-forest-600' : 'text-rose-500'}`}>
              {up ? '↑' : '↓'} {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
