interface AdminStatCardProps {
  label: string;
  value: string;
  help: string;
}

export function AdminStatCard({ label, value, help }: AdminStatCardProps) {
  return (
    <div className="card-surface p-5">
      <p className="text-sm font-semibold text-text-secondary">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-[-0.03em] text-text-primary">{value}</p>
      <p className="mt-3 text-sm text-text-secondary">{help}</p>
    </div>
  );
}
