/** Loading state da home — exibido pelo React Suspense enquanto a página carrega */
export default function HomeLoading() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      {/* Hero skeleton */}
      <div className="animate-pulse rounded-2xl bg-muted h-64 w-full" />
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-muted h-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-muted h-72" />
        ))}
      </div>
    </div>
  );
}
