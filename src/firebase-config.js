import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAes2TygvzVyxETZabM4GP3tzOfvZPLUuQ",
  authDomain: "speech-to-text-app-1b7b3.firebaseapp.com",
  projectId: "speech-to-text-app-1b7b3",
  storageBucket: "speech-to-text-app-1b7b3.appspot.com",
  messagingSenderId: "156909822541",
  appId: "1:156909822541:web:5d0e46469214a438667204",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
