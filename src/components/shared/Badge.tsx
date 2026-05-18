import clsx from 'clsx';

export function Badge({ children, color = 'slate', creative, className }: {
  children: React.ReactNode;
  color?: 'brand' | 'forest' | 'ink' | 'slate' | 'warm' | 'rose';
  creative?: boolean;
  className?: string;
}) {
  const palette: Record<string, { text: string; border: string; dot: string }> = {
    brand:  { text: 'text-brand-600',    border: 'border-brand-200/60',  dot: 'bg-brand-400' },
    forest: { text: 'text-forest-600',   border: 'border-forest-200/60', dot: 'bg-forest-400' },
    ink:    { text: 'text-ink-600',      border: 'border-ink-200/60',    dot: 'bg-ink-400' },
    slate:  { text: 'text-ink-500',      border: 'border-ink-200/60',    dot: 'bg-ink-300' },
    warm:   { text: 'text-warm-600',     border: 'border-warm-200/60',   dot: 'bg-warm-400' },
    rose:   { text: 'text-rose-600',     border: 'border-rose-200/60',   dot: 'bg-rose-400' },
  };

  const p = palette[color] ?? palette.slate;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium',
        creative
          ? 'px-3 py-1 rounded-full text-xs tracking-normal border'
          : 'px-2.5 py-0.5 rounded text-[10px] uppercase tracking-[.05em] border',
        p.text, p.border,
        className
      )}
    >
      {creative && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', p.dot)} />}
      {children}
    </span>
  );
}