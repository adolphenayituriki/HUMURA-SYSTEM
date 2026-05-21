import clsx from 'clsx';

export function Badge({ children, color = 'slate', className }: {
  children: React.ReactNode;
  color?: 'brand' | 'forest' | 'ink' | 'slate' | 'warm' | 'rose' | 'blue';
  className?: string;
}) {
  const palette: Record<string, { text: string; bg: string; border: string }> = {
    brand:  { text: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200/60' },
    forest: { text: 'text-forest-700', bg: 'bg-forest-50', border: 'border-forest-200/60' },
    blue:   { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200/60' },
    ink:    { text: 'text-ink-700', bg: 'bg-ink-50', border: 'border-ink-200/60' },
    slate:  { text: 'text-ink-500', bg: 'bg-ink-50/50', border: 'border-ink-200/60' },
    warm:   { text: 'text-warm-700', bg: 'bg-warm-50', border: 'border-warm-200/60' },
    rose:   { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200/60' },
  };

  const p = palette[color] ?? palette.slate;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-[.04em] border',
        p.text, p.bg, p.border,
        className
      )}
    >
      {children}
    </span>
  );
}
