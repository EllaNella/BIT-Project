// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVppqwx6xwslHBv_fBSI5gIJpx6y4YM5Q",
  authDomain: "bit-project-4f64b.firebaseapp.com",
  projectId: "bit-project-4f64b",
  storageBucket: "bit-project-4f64b",
  messagingSenderId: "921206763654",
  appId: "1:921206763654:web:65ecae00b65380f4666107"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Firebase Storage


// Export the initialized Firebase app, auth, and Firestore instances
export { db, firebaseAuth, storage }; 