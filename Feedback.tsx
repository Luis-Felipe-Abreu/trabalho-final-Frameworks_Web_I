// Indicador de carregamento exibido durante as requisições
export function LoadingSpinner({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="pokeball-spin h-14 w-14 rounded-full border-4 border-border border-t-primary" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

// Mensagem de erro amigável quando a API falha
export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-5xl">😵</span>
      <p className="max-w-md text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
