import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { fetchPokemon, getArtworkUrl, type Pokemon } from "@/lib/pokeapi";
import { TypeBadge } from "@/components/PokemonCard";
import { LoadingSpinner, ErrorMessage } from "@/components/Feedback";
import { Header } from "@/components/Header";

// Rota dinâmica: /pokemon/:id
export const Route = createFileRoute("/pokemon/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Pokémon — Pokédex" },
      {
        name: "description",
        content: "Informações detalhadas do Pokémon: tipos, habilidades e estatísticas.",
      },
      { property: "og:title", content: "Detalhes do Pokémon — Pokédex" },
      {
        property: "og:description",
        content: "Tipos, habilidades e estatísticas de um Pokémon, via PokéAPI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PokemonDetails,
});

// Nomes amigáveis das estatísticas
const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Atq. Especial",
  "special-defense": "Def. Especial",
  speed: "Velocidade",
};

function PokemonDetails() {
  const { id } = useParams({ from: "/pokemon/$id" });

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca os detalhes do Pokémon sempre que o id da rota muda
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemon(id);
        if (!cancelled) setPokemon(data);
      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar este Pokémon. Ele pode não existir.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-block text-sm font-bold text-primary underline-offset-2 hover:underline"
        >
          ← Voltar para a lista
        </Link>

        {loading ? (
          <LoadingSpinner message="Carregando detalhes..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : pokemon ? (
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
            {/* Cabeçalho do card com a arte oficial */}
            <div className="flex flex-col items-center gap-6 bg-secondary p-8 sm:flex-row">
              <img
                src={getArtworkUrl(pokemon.id)}
                alt={pokemon.name}
                className="h-48 w-48 object-contain drop-shadow-lg"
              />
              <div className="text-center sm:text-left">
                <span className="text-sm font-bold text-muted-foreground">
                  #{String(pokemon.id).padStart(4, "0")}
                </span>
                <h2 className="text-4xl font-black capitalize text-foreground">
                  {pokemon.name}
                </h2>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {pokemon.types.map((t) => (
                    <TypeBadge key={t.type.name} type={t.type.name} />
                  ))}
                </div>
                <div className="mt-4 flex justify-center gap-6 text-sm sm:justify-start">
                  <p>
                    <span className="font-bold text-foreground">
                      {(pokemon.height / 10).toFixed(1)} m
                    </span>{" "}
                    <span className="text-muted-foreground">altura</span>
                  </p>
                  <p>
                    <span className="font-bold text-foreground">
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </span>{" "}
                    <span className="text-muted-foreground">peso</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-8 md:grid-cols-2">
              {/* Habilidades */}
              <section>
                <h3 className="mb-3 text-lg font-bold text-foreground">Habilidades</h3>
                <ul className="space-y-2">
                  {pokemon.abilities.map((a) => (
                    <li
                      key={a.ability.name}
                      className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2 text-sm capitalize text-foreground"
                    >
                      {a.ability.name.replace("-", " ")}
                      {a.is_hidden && (
                        <span className="text-xs font-medium text-muted-foreground">
                          (oculta)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Estatísticas com barras de progresso */}
              <section>
                <h3 className="mb-3 text-lg font-bold text-foreground">Estatísticas</h3>
                <ul className="space-y-3">
                  {pokemon.stats.map((s) => (
                    <li key={s.stat.name}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">
                          {STAT_LABELS[s.stat.name] ?? s.stat.name}
                        </span>
                        <span className="font-bold text-foreground">{s.base_stat}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
