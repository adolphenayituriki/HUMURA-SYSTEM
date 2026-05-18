import clsx from 'clsx';
import type { ReactNode } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search…', 
  className = '',
  leftIcon,
  rightIcon
}: SearchBarProps) {
  return (
    <div className={clsx('relative group', className)}>
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-6 items-center pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'w-full pl-10 pr-4',
          leftIcon && 'pl-11',
          rightIcon && 'pr-11',
          'h-10 rounded-xl',
          'text-sm font-medium',
          'text-ink-900 placeholder:text-ink-400',
          'bg-surface border border-ink-200',
          'focus:bg-surface focus:border-brand-400 focus:ring-2 focus:ring-brand-200/50',
          'transition-all duration-200 ease-in-out',
          'hover:border-ink-300'
        )}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 items-center pointer-events-none">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
