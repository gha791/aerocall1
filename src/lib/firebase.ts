// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOgzV3hrbrehFw1eKAPuEwvo6uxN6E1rI",
  authDomain: "dispatchconnect-7nqgs.firebaseapp.com",
  projectId: "dispatchconnect-7nqgs",
  storageBucket: "dispatchconnect-7nqgs.firebasestorage.app",
  messagingSenderId: "62107898456",
  appId: "1:62107898456:web:970d8ab576daea024c702d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
