// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeTXPyR9mmqz8_pZ4gX9gkoUqywVObGQ8",
  authDomain: "arapp-d10d1.firebaseapp.com",
  projectId: "arapp-d10d1",
  storageBucket: "arapp-d10d1.appspot.com",
  messagingSenderId: "232603517067",
  appId: "1:232603517067:web:6eafa73bdcf83a7eb2148e",
  measurementId: "G-50ECVT3K3Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);