export default function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" className="fill-brand" />
      <circle cx="21" cy="12" r="6" className="fill-surface" />
      <circle cx="22" cy="10.5" r="2" className="fill-copper" />
    </svg>
  );
}