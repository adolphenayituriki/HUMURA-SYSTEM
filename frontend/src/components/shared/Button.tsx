import clsx from 'clsx';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'neutral' | 'brand-outline';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: [
    'text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700',
    'shadow-[0_2px_8px_rgba(47,119,141,.2)] hover:shadow-[0_4px_16px_rgba(47,119,141,.25)]',
    'border border-transparent',
  ].join(' '),
  secondary: [
    'text-ink-600 bg-white hover:bg-ink-50 active:bg-ink-100',
    'border border-ink-200 hover:border-ink-300',
    'shadow-sm',
  ].join(' '),
  ghost: [
    'text-ink-500 hover:text-ink-800 hover:bg-ink-50 active:bg-ink-100',
    'border border-transparent',
  ].join(' '),
  danger: [
    'text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700',
    'shadow-[0_2px_8px_rgba(232,76,94,.2)] hover:shadow-[0_4px_16px_rgba(232,76,94,.25)]',
    'border border-transparent',
  ].join(' '),
  success: [
    'text-white bg-forest-500 hover:bg-forest-600 active:bg-forest-700',
    'shadow-[0_2px_8px_rgba(34,197,94,.2)] hover:shadow-[0_4px_16px_rgba(34,197,94,.25)]',
    'border border-transparent',
  ].join(' '),
  neutral: [
    'text-ink-500 bg-ink-50 hover:bg-ink-100 active:bg-ink-200',
    'border border-ink-100 hover:border-ink-200',
  ].join(' '),
  'brand-outline': [
    'text-brand-600 bg-brand-50 hover:bg-brand-100 active:bg-brand-200',
    'border border-brand-200 hover:border-brand-300',
  ].join(' '),
};

const sizeStyles: Record<Size, string> = {
  xs:  'h-7 px-3 text-[11px] font-semibold rounded-lg gap-1',
  sm:  'h-8 px-3.5 text-xs font-semibold rounded-lg gap-1.5',
  md:  'h-9 px-4 text-sm font-bold rounded-xl gap-1.5',
  lg:  'h-11 px-6 text-sm font-bold rounded-xl gap-2',
  icon: 'h-8 w-8 rounded-lg p-0 flex items-center justify-center',
};

export function Button({
  children, variant = 'secondary', size = 'md',
  className, disabled, ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center',
        'transition-all duration-200 ease-out',
        'active:scale-[.97]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
