// Props do componente de paginação
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Controles de paginação: anterior, próxima e números das páginas
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  // Monta uma janela de páginas ao redor da página atual
  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Paginação">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={
            p === page
              ? "h-10 w-10 rounded-lg bg-primary text-sm font-bold text-primary-foreground"
              : "h-10 w-10 rounded-lg border border-border bg-card text-sm font-bold text-foreground transition-colors hover:bg-accent"
          }
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima →
      </button>
    </nav>
  );
}
