import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, allCategoriesIcon } from "@/lib/data";

export const Route = createFileRoute("/_layout/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const AllIcon = allCategoriesIcon;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold">Categories</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Browse everything available on aQross
      </p>

      {/* All Categories shortcut */}
      <Link
        to="/"
        className="neu neu-hover mb-6 flex items-center gap-4 rounded-3xl p-4"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand">
          <AllIcon className="h-7 w-7 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="font-bold">All Categories</p>
          <p className="text-sm text-muted-foreground">Browse all {categories.length} categories</p>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              to="/shop/$shopSlug"
              params={{ shopSlug: cat.slug }}
              className="neu neu-hover flex flex-col overflow-hidden rounded-3xl"
            >
              <div className="flex h-32 w-full items-center justify-center bg-muted/40 sm:h-36">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Icon className="h-14 w-14 text-brand" aria-hidden="true" />
                )}
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <Icon className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <p className="text-sm font-semibold leading-tight">{cat.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
