import { Link } from "@tanstack/react-router";

// Cabeçalho da aplicação com a logo da Pokédex
export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          {/* Pokébola feita em CSS puro */}
          <span className="pokeball h-8 w-8" aria-hidden />
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Poké<span className="text-primary">dex</span>
          </h1>
        </Link>
      </div>
    </header>
  );
}
