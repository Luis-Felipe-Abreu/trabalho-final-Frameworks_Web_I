import { Link } from "@tanstack/react-router";
import { getArtworkUrl, getIdFromUrl, TYPE_COLORS } from "@/lib/pokeapi";

// Props recebidas pelo card: nome e url vêm da listagem da API
interface PokemonCardProps {
  name: string;
  url: string;
}

// Card reutilizável que exibe um Pokémon na listagem
export function PokemonCard({ name, url }: PokemonCardProps) {
  const id = getIdFromUrl(url);

  return (
    <Link
      to="/pokemon/$id"
      params={{ id: String(id) }}
      className="group flex flex-col items-center rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="self-end text-xs font-bold text-muted-foreground">
        #{String(id).padStart(4, "0")}
      </span>
      <img
        src={getArtworkUrl(id)}
        alt={name}
        loading="lazy"
        className="h-28 w-28 object-contain transition-transform group-hover:scale-110"
      />
      <h3 className="mt-2 text-lg font-bold capitalize text-card-foreground">
        {name}
      </h3>
    </Link>
  );
}

// Badge colorido com o tipo do Pokémon
export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
      style={{ backgroundColor: TYPE_COLORS[type] ?? "#777" }}
    >
      {type}
    </span>
  );
}
