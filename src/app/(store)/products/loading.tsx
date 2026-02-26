/** Loading state da listagem de produtos */
export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Título skeleton */}
      <div className="animate-pulse bg-muted h-8 w-48 rounded mb-8" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        {/* Filtros skeleton */}
        <div className="space-y-2">
          <div className="animate-pulse bg-muted h-4 w-24 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted h-9 rounded-md" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-muted h-72" />
          ))}
        </div>
      </div>
    </div>
  );
}
