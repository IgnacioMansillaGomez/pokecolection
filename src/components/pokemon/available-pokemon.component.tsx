import React, { useEffect, useState } from 'react';
import { PokemonItem } from '../pokemon-item/pokemon-item.component';
import { PokemonAPI } from '../../api/pokemon.api';
import {
  Ability,
  Pokemon,
  PokemonProps,
  PokemonType,
} from '../../types/Pokemon.types';

import './pokemon_container.scss';

export const AvailablePokemon: React.FC<PokemonProps> = ({
  pokemons,
  removePokemonFromState,
  addPokemonToState,
}) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const getAllPokemon = async () => {
    try {
      const response = PokemonAPI.getAllPokemon({ limit: 20, offset: 0 });
      const pokeList: {
        name: string;
        url: string;
        id: number;
        types: string[];
      }[] = (await response).data.results;
      const updatedPokemon = await Promise.all(
        pokeList.map(async (pokemon) => {
          const pokemonData = await PokemonAPI.getPokemonByUrl({
            url: pokemon.url,
          });
          const types = pokemonData.types.map(
            ({ type }: PokemonType) => type.name
          );
          const abilities = pokemonData.abilities.map(
            ({ ability }: Ability) => ability.name
          );
          const { sprites } = pokemonData;
          const image = sprites.front_shiny;

          return {
            ...pokemon,
            types,
            abilities,
            sprites,
            image,
          };
        })
      );

      setPokemonList(updatedPokemon);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    }
  };

  useEffect(() => {
    getAllPokemon();
    console.log(pokemonList);
  }, []);

  return (
    <>
      <h1 className="title">Available Pokemon</h1>
      <div className="outer-container">
        {pokemonList.length > 0 &&
          pokemonList.map((e: Pokemon, idx: number) => (
            <PokemonItem
              pokemon={e}
              key={idx}
              flow="available"
              onRemove={removePokemonFromState}
              onAdd={addPokemonToState}
            />
          ))}
      </div>
    </>
  );
};
