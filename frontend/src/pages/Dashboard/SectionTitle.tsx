export function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <h2 className="text-sm font-bold text-ink-800 flex items-center gap-2">
      <span className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 shrink-0">
        {icon}
      </span>
      {label}
    </h2>
  );
}
