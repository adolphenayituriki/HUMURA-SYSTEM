import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Card({
  children, className,
  padding = true, hover = false, elevated = false,
}: {
  children: ReactNode; className?: string;
  padding?: boolean; hover?: boolean; elevated?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative rounded-xl bg-white shadow-sm border border-ink-100/60',
        padding && 'p-6 md:p-7',
        elevated && 'shadow-md',
        hover && [
          'cursor-pointer transition-all duration-300 ease-out',
          'hover:-translate-y-[2px] hover:shadow-md hover:border-brand-200/50',
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
