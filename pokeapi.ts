import axios from "axios";

// Instância do axios configurada com a URL base da PokéAPI
export const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
});

// ---------- Tipos ----------

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonAbility {
  ability: { name: string };
  is_hidden: boolean;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number; // em decímetros
  weight: number; // em hectogramas
  sprites: {
    front_default: string;
    other: {
      "official-artwork": { front_default: string };
    };
  };
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

// ---------- Constantes ----------

export const PAGE_SIZE = 20;

// Lista dos 18 tipos de Pokémon para o filtro
export const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
] as const;

// Cor de cada tipo (usada nos badges)
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0",
  electric: "#F7D02C", grass: "#7AC74C", ice: "#96D9D6",
  fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65",
  flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
  dark: "#705746", steel: "#B7B7CE", fairy: "#D685AD",
};

// Extrai o id numérico do Pokémon a partir da URL retornada pela API
export function getIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

// URL da arte oficial do Pokémon (não precisa de requisição extra)
export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// ---------- Requisições ----------

// Lista paginada de Pokémons (paginação feita pela própria API)
export async function fetchPokemonPage(page: number): Promise<PokemonListResponse> {
  const offset = (page - 1) * PAGE_SIZE;
  const { data } = await api.get<PokemonListResponse>("/pokemon", {
    params: { limit: PAGE_SIZE, offset },
  });
  return data;
}

// Busca os nomes de TODOS os Pokémons (usado na busca em tempo real)
export async function fetchAllPokemonNames(): Promise<PokemonListItem[]> {
  const { data } = await api.get<PokemonListResponse>("/pokemon", {
    params: { limit: 100000, offset: 0 },
  });
  return data.results;
}

// Busca os Pokémons de um tipo específico (usado no filtro por tipo)
export async function fetchPokemonByType(type: string): Promise<PokemonListItem[]> {
  const { data } = await api.get<{ pokemon: { pokemon: PokemonListItem }[] }>(
    `/type/${type}`
  );
  return data.pokemon.map((entry) => entry.pokemon);
}

// Busca os detalhes de um Pokémon pelo id ou nome
export async function fetchPokemon(idOrName: string): Promise<Pokemon> {
  const { data } = await api.get<Pokemon>(`/pokemon/${idOrName}`);
  return data;
}
