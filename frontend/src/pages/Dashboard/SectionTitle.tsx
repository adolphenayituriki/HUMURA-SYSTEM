export function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <h2 className="text-base font-bold text-ink-800 flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
        {icon}
      </span>
      <span>{label}</span>
    </h2>
  );
}
