export function PageHeader({
  title,
  description,
  actions,
}: {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <h1
          className="text-2xl font-semibold tracking-tight"
          data-testid="page-title"
        >
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground" data-testid="page-description">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </header>
  );
}
