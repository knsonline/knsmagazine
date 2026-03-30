interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="card-surface px-6 py-10 text-center sm:px-8">
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      <p className="mt-3 text-sm text-text-secondary sm:text-base">{description}</p>
    </div>
  );
}
