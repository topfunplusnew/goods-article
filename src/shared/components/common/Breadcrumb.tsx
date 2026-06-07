import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-gray-500"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <span
          key={`${item.label}-${index}`}
          className={`inline-flex items-center gap-2 whitespace-nowrap ${index === items.length - 1 ? "min-w-0 shrink overflow-hidden" : "shrink-0"}`}
        >
          {item.to ? (
            <Link
              href={item.to}
              className={`font-medium text-primary transition hover:text-primary-light hover:underline ${index === items.length - 1 ? "truncate" : ""}`}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`font-semibold text-gray-600 ${index === items.length - 1 ? "truncate" : ""}`}
            >
              {item.label}
            </span>
          )}

          {index < items.length - 1 ? (
            <span className="shrink-0 text-gray-300">/</span>
          ) : null}
        </span>
      ))}
    </nav>
  );
}
