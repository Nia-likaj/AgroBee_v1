export default function LoadingSkeleton({
  lines = 3,
}: {
  lines?: number;
}) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="h-5 w-40 rounded-lg bg-black/10" />
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 w-full rounded bg-black/10" />
        ))}
      </div>
      <div className="mt-5 h-9 w-32 rounded-xl bg-black/10" />
    </div>
  );
}
