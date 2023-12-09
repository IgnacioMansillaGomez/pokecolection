import { Register } from './auth/register/register.component';
import { getAuth } from 'firebase/auth';
import { AvailablePokemon } from './components/pokemon/available-pokemon.component';
import { useState } from 'react';
import { Login } from './auth/login/login.component';

export const App = () => {
  const [isRegistered, setIsRegistered] = useState<Boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
  const [user, setUser] = useState<String>('');
  const auth = getAuth();

  return (
    <>
      <Register
        auth={auth}
        setIsRegistered={setIsRegistered}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />
      {/* <Login
        auth={auth}
        setIsRegistered={setIsRegistered}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      /> */}
      <AvailablePokemon pokemons={[]} />
    </>
  );
};
