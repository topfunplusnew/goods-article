interface HtmlContentProps {
  html: string;
  className?: string;
}

export function HtmlContent({ html, className }: HtmlContentProps) {
  return (
    <div
      className={className ? `html-preview-render ${className}` : "html-preview-render"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
