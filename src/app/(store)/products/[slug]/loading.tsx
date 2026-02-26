/** Loading state da página de detalhe do produto */
export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Imagem skeleton */}
        <div className="animate-pulse aspect-square rounded-2xl bg-muted" />

        {/* Infos skeleton */}
        <div className="space-y-4">
          <div className="animate-pulse bg-muted h-4 w-24 rounded" />
          <div className="animate-pulse bg-muted h-8 w-3/4 rounded" />
          <div className="animate-pulse bg-muted h-8 w-28 rounded" />
          <div className="space-y-2">
            <div className="animate-pulse bg-muted h-4 w-full rounded" />
            <div className="animate-pulse bg-muted h-4 w-5/6 rounded" />
            <div className="animate-pulse bg-muted h-4 w-4/6 rounded" />
          </div>
          <div className="animate-pulse bg-muted h-11 rounded-md" />
        </div>
      </div>
    </div>
  );
}
