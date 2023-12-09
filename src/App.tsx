import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Register } from './auth/register/register.component';
import { Login } from './auth/login/login.component';
import { AvailablePokemon } from './components/pokemon/available-pokemon.component';
import pokeball from './assets/pokeball.png';
import { Ability, Pokemon, PokemonType } from './types/Pokemon.types';

import { getAuth, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import UserPokemon from './components/user-pokemon/user-pokemon.component';
import './main.scss';

export const App = () => {
  const auth = getAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
  const [userPokemons, setUserPokemons] = useState<Pokemon[]>([]);
  const db = getFirestore();

  useEffect(() => {
    const getAvailablePokeData = async () => {
      const apiUrl: string = 'https://pokeapi.co/api/v2';
      const limit: number = 52;
      const offset: number = 0;
      const url: string = `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const pokemonList: {
          name: string;
          url: string;
          id: number;
          types: string[];
        }[] = data.results;

        // Fetch and set the types and abilities for each Pokémon
        const updatedPokemonList = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
              throw new Error(`Error fetching data for ${pokemon.name}`);
            }
            const pokemonData = await response.json();
            const types = pokemonData.types.map(
              ({ type }: PokemonType) => type.name
            );
            const abilities = pokemonData.abilities.map(
              ({ ability }: Ability) => ability.name
            );
            const { sprites } = pokemonData;
            const image = sprites.front_shiny;
            return { ...pokemon, types, abilities, image, user };
          })
        );

        // Now that you have the updated data, you can update the state with it
        setAvailablePokemons(updatedPokemonList);
      } catch (error) {
        console.error('Error fetching data from the PokeAPI:', error);
      }
    };
    getAvailablePokeData();
  }, [user]);

  useEffect(() => {
    const getUserPokeData = async () => {
      try {
        const userPokemonQuery = query(
          collection(db, 'pokemon'),
          where('user', '==', user)
        );
        const querySnapshot = await getDocs(userPokemonQuery);

        const updatedPokemonList: Pokemon[] = [];

        querySnapshot.forEach((doc) => {
          updatedPokemonList.push(doc.data() as Pokemon);
        });

        setUserPokemons(updatedPokemonList);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    getUserPokeData();
  }, [db, user]);

  const handleLogout = async () => {
    const loginErrorNotification = (error: unknown) => {
      toast.error(`Registration error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    };
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser('');
      console.log(user, 'has been logged out');
    } catch (error) {
      loginErrorNotification(error);
      console.error('Error logging out:', error);
    }
  };

  const removePokemonFromState = (pokemonName: string): void => {
    const updatedPokemon = userPokemons.filter(
      ({ name }) => name !== pokemonName
    );
    setUserPokemons(updatedPokemon);
  };

  const addPokemonToState = (pokemon: Pokemon): void => {
    const updatedPokemon = [...userPokemons, pokemon];
    setUserPokemons(updatedPokemon);
  };

  const HomePage = () => (
    <div>
      <AvailablePokemon
        pokemons={availablePokemons}
        user={user}
        addPokemonToState={addPokemonToState}
      />
    </div>
  );

  const LoginComponent = (
    <Login
      auth={auth}
      setIsLoggedIn={setIsLoggedIn}
      setIsRegistered={setIsRegistered}
      setUser={setUser}
    />
  );

  const RegisterComponent = (
    <Register
      auth={auth}
      setIsLoggedIn={setIsLoggedIn}
      setIsRegistered={setIsRegistered}
      setUser={setUser}
    />
  );

  const CollectionComponent = (
    <UserPokemon
      user={user}
      pokemons={userPokemons}
      removePokemonFromState={removePokemonFromState}
    />
  );

  return (
    <>
      <ToastContainer />
      <Router>
        <div className="top-container">
          <img src={pokeball} alt="nopic" />
          <h1 className="main-logo-text">Pokedex App</h1>
          <nav>
            <ul>
              {!isLoggedIn && (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
              {isLoggedIn && (
                <li onClick={handleLogout}>
                  <Link to="/login">Logout</Link>
                </li>
              )}
              <li>
                <Link to="/register">Register</Link>
              </li>
              {isLoggedIn && (
                <div>
                  <li>
                    <Link to="/collection">Collection</Link>
                  </li>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                </div>
              )}
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/login" element={LoginComponent} />
          <Route path="/register" element={RegisterComponent} />
          <Route path="/collection" element={CollectionComponent} />
          <Route
            path="/"
            element={
              isRegistered ? (
                isLoggedIn ? (
                  <HomePage />
                ) : (
                  LoginComponent
                )
              ) : (
                RegisterComponent
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
};
