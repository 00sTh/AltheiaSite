/** Loading state do carrinho */
export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="animate-pulse bg-muted h-8 w-48 rounded mb-8" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b">
              <div className="animate-pulse bg-muted h-20 w-20 rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="animate-pulse bg-muted h-4 w-3/4 rounded" />
                <div className="animate-pulse bg-muted h-4 w-20 rounded" />
                <div className="animate-pulse bg-muted h-7 w-28 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="animate-pulse rounded-xl bg-muted h-64" />
      </div>
    </div>
  );
}
