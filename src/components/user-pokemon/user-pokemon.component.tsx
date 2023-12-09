import React from 'react';
import { PokemonItem } from '../pokemon-item/pokemon-item.component';
import { Pokemon, PokemonProps } from '../../types/Pokemon.types';
import '../pokemon/pokemon_container.scss';

const UserPokemon: React.FC<PokemonProps> = ({
  user,
  pokemons,
  removePokemonFromState,
}) => {
  return (
    <div className="outer-container">
      <h1>
        Pokemon Collection of <span style={{ color: 'yellow' }}>{user}</span>
      </h1>
      <div className="pokemon-container">
        {pokemons.map((pokemon: Pokemon, index: number) => (
          <PokemonItem
            key={index}
            pokemon={pokemon}
            flow="user"
            onRemove={removePokemonFromState}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPokemon;
