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
        'relative rounded-xl bg-white border border-ink-200/60',
        'shadow-[0_1px_3px_rgba(0,0,0,.03),0_1px_2px_rgba(0,0,0,.02)]',
        padding && 'p-6 md:p-7',
        elevated && 'shadow-[0_4px_16px_rgba(0,0,0,.04),0_2px_4px_rgba(0,0,0,.03)]',
        hover && [
          'cursor-pointer transition-all duration-300 ease-out',
          'hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,.06)] hover:border-brand-200/50',
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
