import React, { useState, useEffect } from 'react';
import { PokemonItemProps } from '../../types/PokemonItem.types';
import { toast } from 'react-toastify';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  AVAILABLE_FLOW,
  USER_FLOW,
  ADD_TEXT,
  OWNED_TEXT,
} from '../../constants/main.ts';
import { Pokemon } from '../../types/Pokemon.types';

import './pokemon-item.scss';

export const PokemonItem: React.FC<PokemonItemProps> = ({
  pokemon,
  flow,
  onRemove,
  onAdd,
}) => {
  const { name, image, types, abilities, user: userEmail } = pokemon;
  const db = getFirestore();

  const [owned, setIsOwned] = useState(false);

  const addPokemonSuccessNotification = (pokemon: any) => {
    toast.success(`${pokemon} added to your collection`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const removePokemonSuccessNotification = (pokemon: any) => {
    toast.success(`${pokemon} removed from your collection`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  useEffect(() => {
    const checkIfPokemonInCollection = async (
      pokemonName: string
    ): Promise<void> => {
      const userPokemonCollection = collection(db, 'pokemon');

      const q = query(
        userPokemonCollection,
        where('name', '==', pokemonName),
        where('user', '==', userEmail)
      );

      const querySnapshot = await getDocs(q);

      setIsOwned(!querySnapshot.empty);
    };
    checkIfPokemonInCollection(name);
  }, [db, name, userEmail]);

  const handleAddPokemon = (pokemon: Pokemon): void => {
    addDoc(collection(db, 'pokemon'), pokemon)
      .then(() => {
        onAdd!(pokemon);
        addPokemonSuccessNotification(pokemon.name!);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  };

  const handleRemovePokemon = async (pokemonName: string): Promise<void> => {
    try {
      const pokemonCollection = collection(db, 'pokemon');

      const pokemonQuery = query(
        pokemonCollection,
        where('name', '==', pokemonName)
      );
      const querySnapshot = await getDocs(pokemonQuery);

      if (querySnapshot.docs.length === 0) {
        console.error('No Pokemon found with the name: ' + pokemonName);
        return;
      }

      const pokemonDoc = querySnapshot.docs[0];

      await deleteDoc(pokemonDoc.ref);
      removePokemonSuccessNotification(pokemonName);

      onRemove!(pokemonName);
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  const isAvailableFlow: boolean = flow === AVAILABLE_FLOW;
  const isUserFlow: boolean = flow === USER_FLOW;
  const addText: string = !owned ? ADD_TEXT : OWNED_TEXT;

  return (
    <div className="pokemon-card">
      <div className="pokemon-details">
        <img src={image} alt={name} className="pokemon-image" />
        <h3>{name}</h3>
        <p>
          {' '}
          <span>Types:</span> {types.join(', ')}
        </p>
        <p className="abilities">
          <span>Abilities:</span> {abilities.join(', ')}
        </p>

        {isAvailableFlow && (
          <button
            className="add-pokemon-button"
            onClick={() => handleAddPokemon(pokemon)}
            disabled={owned}
          >
            {addText}
          </button>
        )}
        {isUserFlow && (
          <button
            className="add-pokemon-button"
            onClick={() => handleRemovePokemon(name)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
