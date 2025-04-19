// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import cors from "cors"; // Import cors

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
const firebaseAuth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Configure CORS for localhost:3000
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from localhost:3000
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true // Allow credentials
};

const corsMiddleware = cors(corsOptions);

// Example function to use CORS
function exampleFunction(req, res) {
  corsMiddleware(req, res, () => {
    res.send("CORS is configured for localhost:3000!");
  });
}

export { db, firebaseAuth, storage, exampleFunction };