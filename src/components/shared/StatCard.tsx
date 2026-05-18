import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
  icon?: ReactNode;
  accent?: string;
}

export function StatCard({ label, value, change, up, icon }: StatCardProps) {
  return (
    <div
      className="relative rounded-xl bg-surface border border-ink-200/70 overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(0,0,0,.04)]"
    >
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-blue-500/70 to-blue-400/50" />

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-2">
          <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.06em] leading-none">{label}</span>
          {icon && (
            <span className="text-ink-300 shrink-0 ml-2">{icon}</span>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-ink-900 tracking-[-.02em]">
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