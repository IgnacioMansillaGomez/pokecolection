import React from 'react';
import { PokemonItemProps } from '../../types/PokemonItem.types';
import './pokemon-item.scss';

export const PokemonItem: React.FC<PokemonItemProps> = ({ pokemon }) => {
  const { image, name, types, abilities, user: userEmail } = pokemon;
  return (
    <div className="pokemon-card">
      <div className="pokemon-details">
        <img src={image} alt={name} className="pokemon-image" />
        <h3>{name}</h3>
        <p>
          <span>Types:</span> {types.join(', ')}
        </p>
        <p>
          <span>Abilities:</span> {abilities.join(', ')}
        </p>
      </div>
    </div>
  );
};
