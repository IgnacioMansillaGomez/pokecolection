import { Pokemon } from './Pokemon.types';

export interface PokemonItem {
  pokemon: Pokemon;
}

export interface PokemonItemProps {
  pokemon: Pokemon;
  flow: string;
  onRemove?: Function;
  onAdd?: Function;
}
