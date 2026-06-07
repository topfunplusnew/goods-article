import type { ReactNode } from "react";

interface PageSectionProps {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
}

export function PageSection({
  title,
  eyebrow,
  description,
  children,
}: PageSectionProps) {
  return (
    <section className="section-shell px-6 py-10 md:px-8">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title mt-4">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
