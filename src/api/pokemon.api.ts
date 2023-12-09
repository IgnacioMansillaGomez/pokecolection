import axios from 'axios';
import { POKEMON_BASE_URL } from '../constants/main';

interface PokemonRequestParams {
  limit: number;
  offset: number;
}

const getAllPokemon = async ({ limit, offset }: PokemonRequestParams) => {
  const response = await axios.get(
    `${POKEMON_BASE_URL}/pokemon/?&limit=${limit}&offset=${offset}`
  );
  return response;
};

const getPokemonByUrl = async ({ url }: { url: string }) => {
  const response = await axios.get(url);
  return response.data;
};

export const PokemonAPI = {
  getAllPokemon,
  getPokemonByUrl,
};
