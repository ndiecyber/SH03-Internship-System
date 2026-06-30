export function PlaceholderPanel({ label }: Readonly<{ label: string }>) {
  return (
    <section className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
      {label}
    </section>
  );
}
