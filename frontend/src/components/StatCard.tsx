interface StatCardProps {
  label: string;
  value: number;
  accent?: "brand" | "copper" | "danger" | "ink";
}

const accentClasses: Record<string, string> = {
  brand: "border-l-brand text-brand",
  copper: "border-l-copper text-copper",
  danger: "border-l-danger text-danger",
  ink: "border-l-ink text-ink",
};

export default function StatCard({ label, value, accent = "ink" }: StatCardProps) {
  return (
    <div
      className={`bg-surface border border-line border-l-4 px-5 py-4 ${accentClasses[accent]}`}
    >
      <p className="font-display text-3xl font-semibold tabular-nums">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}