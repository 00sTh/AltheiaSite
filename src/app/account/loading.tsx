/** Loading state da página de conta */
export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="animate-pulse bg-muted h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <div className="animate-pulse bg-muted h-6 w-40 rounded" />
          <div className="animate-pulse bg-muted h-4 w-52 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="animate-pulse bg-muted h-6 w-32 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-muted h-28" />
        ))}
      </div>
    </div>
  );
}
