export interface Ability {
  ability: {
    name: string;
  };
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  url: string;
  user?: string;
  image: string;
}

export interface PokemonProps {
  pokemons: Pokemon[];
}
