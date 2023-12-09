import React, { ReactElement, useState } from 'react';
import { AuthProps } from '../../types/Auth.types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './login.scss';
export const Login: React.FC<AuthProps> = ({
  auth,
  setIsRegistered,
  setIsLoggedIn,
  setUser,
}: AuthProps): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          setIsRegistered(true);
          setIsLoggedIn(true);
          setUser(user.email!);
          console.log(user.email, 'has been sign in');
        }
      );
    } catch (error) {
      setIsRegistered(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="auth-container">
        <h2>Login:</h2>
        <input
          type="email"
          name="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={handleRegister}>
          Sign In
        </button>
      </div>
    </>
  );
};
