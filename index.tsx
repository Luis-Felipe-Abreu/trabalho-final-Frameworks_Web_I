import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchAllPokemonNames,
  fetchPokemonByType,
  fetchPokemonPage,
  PAGE_SIZE,
  POKEMON_TYPES,
  TYPE_COLORS,
  type PokemonListItem,
} from "@/lib/pokeapi";
import { PokemonCard } from "@/components/PokemonCard";
import { Pagination } from "@/components/Pagination";
import { LoadingSpinner, ErrorMessage } from "@/components/Feedback";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pokédex — Explore todos os Pokémons" },
      {
        name: "description",
        content:
          "Aplicação React que consome a PokéAPI: listagem com paginação, busca em tempo real, filtros por tipo e página de detalhes de cada Pokémon.",
      },
      { property: "og:title", content: "Pokédex — Explore todos os Pokémons" },
      {
        property: "og:description",
        content: "Listagem, busca, filtros e detalhes de Pokémons usando a PokéAPI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // ---------- Estados ----------
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFiltering = search.trim() !== "" || typeFilter !== "";

  // ---------- Busca os dados na API ----------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (isFiltering) {
          // Com busca/filtro ativo, buscamos a lista completa (ou por tipo)
          // e filtramos/paginamos no cliente
          let list: PokemonListItem[];
          if (typeFilter) {
            list = await fetchPokemonByType(typeFilter);
          } else {
            list = await fetchAllPokemonNames();
          }

          const term = search.trim().toLowerCase();
          if (term) {
            list = list.filter((p) => p.name.toLowerCase().includes(term));
          }

          if (cancelled) return;
          setTotalPages(Math.max(1, Math.ceil(list.length / PAGE_SIZE)));
          setItems(list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
        } else {
          // Sem filtros, usamos a paginação da própria API
          const data = await fetchPokemonPage(page);
          if (cancelled) return;
          setTotalPages(Math.ceil(data.count / PAGE_SIZE));
          setItems(data.results);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Não foi possível carregar os Pokémons. Verifique sua conexão e tente novamente."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, search, typeFilter, isFiltering]);

  // Volta para a página 1 sempre que a busca ou o filtro mudam
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const resultLabel = useMemo(() => {
    if (loading || error) return "";
    return isFiltering ? "resultados encontrados" : "Pokémons no total";
  }, [loading, error, isFiltering]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Busca em tempo real + filtro por tipo */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Pokémon pelo nome..."
            className="w-full flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-input bg-card px-4 py-3 text-sm font-medium capitalize text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="">Todos os tipos</option>
            {POKEMON_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Chip do filtro ativo */}
        {typeFilter && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtrando por:</span>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase text-white"
              style={{ backgroundColor: TYPE_COLORS[typeFilter] }}
            >
              {typeFilter}
            </span>
            <button
              onClick={() => setTypeFilter("")}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              limpar
            </button>
          </div>
        )}

        {/* Feedback: carregando / erro / lista */}
        {loading ? (
          <LoadingSpinner message="Carregando Pokémons..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => setPage((p) => p)} />
        ) : items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Nenhum Pokémon encontrado para essa busca. 😢
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Página {page} de {totalPages} — {resultLabel}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((p) => (
                <PokemonCard key={p.name} name={p.name} url={p.url} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
