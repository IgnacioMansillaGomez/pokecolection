import React, { ReactElement, useState } from 'react';
import { AuthProps } from '../../types/Auth.types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../login/login.scss';
export const Register: React.FC<AuthProps> = ({
  auth,
  setIsRegistered,
  setIsLoggedIn,
  setUser,
}: AuthProps): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          setIsRegistered(true);
          setIsLoggedIn(true);
          setUser(user.email!);
          console.log(user.email, 'has been signed');
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
        <h2>Register:</h2>
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
          Register
        </button>
      </div>
    </>
  );
};
