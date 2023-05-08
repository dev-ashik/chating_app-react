// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlBUb7vav_buIqOpKIVMwguCdWzwpoCrI",
  authDomain: "chating-app-react-a62b3.firebaseapp.com",
  projectId: "chating-app-react-a62b3",
  storageBucket: "chating-app-react-a62b3.appspot.com",
  messagingSenderId: "734324050706",
  appId: "1:734324050706:web:80b98e86b25e63f6ee81cb",
  measurementId: "G-9XK9BMKPHV"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const storage = getStorage();
export const db = getFirestore(app);