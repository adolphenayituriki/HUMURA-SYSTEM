import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Card({
  children, className,
  padding = true, hover = false, elevated = false, decorative = false,
}: {
  children: ReactNode; className?: string;
  padding?: boolean; hover?: boolean; elevated?: boolean; decorative?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative rounded-xl bg-surface border border-ink-200/70',
        'shadow-[0_1px_4px_rgba(0,0,0,.03),0_1px_2px_rgba(0,0,0,.02)]',
        padding && 'p-7',
        elevated && 'shadow-[0_8px_24px_rgba(0,0,0,.06)]',
        decorative && 'deco-band',
        hover && [
          'cursor-pointer transition-[transform,box-shadow,border-color] duration-300 ease-out',
          'hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,.08)] hover:border-brand-200/60',
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
