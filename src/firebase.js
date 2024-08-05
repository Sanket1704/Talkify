// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR0bC8Kzv7jLU6mR4kVA49gx79QVAjQqQ",
  authDomain: "talkify-c5aac.firebaseapp.com",
  projectId: "talkify-c5aac",
  storageBucket: "talkify-c5aac.appspot.com",
  messagingSenderId: "101578673573",
  appId: "1:101578673573:web:77f38a8997811378f9ec4c",
  measurementId: "G-04QMCB4QHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);