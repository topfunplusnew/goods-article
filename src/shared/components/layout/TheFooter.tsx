interface TheFooterProps {
  runtimeNote: string;
  siteName: string;
}

export function TheFooter({ runtimeNote, siteName }: TheFooterProps) {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="page-container py-12">
        <div className="flex flex-col gap-3 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteName}</p>
          <p>{runtimeNote}</p>
        </div>
      </div>
    </footer>
  );
}
