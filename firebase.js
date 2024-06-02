// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY4vzPHEBq2SjMrc8B0twMgae_SW6hkxA",
  authDomain: "noteeaa-b2311.firebaseapp.com",
  projectId: "noteeaa-b2311",
  storageBucket: "noteeaa-b2311.appspot.com",
  messagingSenderId: "492677674566",
  appId: "1:492677674566:web:3a416aacf32a6cf6e63c47",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { app, database };
