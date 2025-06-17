// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB04ocOZTZesgrOqS126hL1ALu5QmZuoe0",
  authDomain: "cloudmorphix-602b1.firebaseapp.com",
  projectId: "cloudmorphix-602b1",
  storageBucket: "cloudmorphix-602b1.firebasestorage.app",
  messagingSenderId: "115572239201",
  appId: "1:115572239201:web:1671fe090cf49dd362f320",
  measurementId: "G-RJW8F0RYX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};