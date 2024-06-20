import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC8UTF2-UDCbh83YnORzspdwCYtNspmmEc",
    authDomain: "portfolio-52527.firebaseapp.com",
    databaseURL: "https://portfolio-52527-default-rtdb.firebaseio.com",
    projectId: "portfolio-52527",
    storageBucket: "portfolio-52527.appspot.com",
    messagingSenderId: "911893195374",
    appId: "1:911893195374:web:9bdd1cbad1d1b8a9fcd47f",
    measurementId: "G-R97G9KY6NR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };