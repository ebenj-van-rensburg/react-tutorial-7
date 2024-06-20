import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from './firebaseConfig';

const register = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await set(ref(database, 'users/' + user.uid), {
    username: username,
    email: email,
    userId: user.uid,
  });

  return user;
};

const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

const logout = async () => {
  await signOut(auth);
};

export { register, login, logout };