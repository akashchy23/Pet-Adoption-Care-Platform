import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';

// User's Firebase web app configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBgO60YBaXkn842JoIbTXM076ulD2YEpfQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pet-adopt-b31fc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pet-adopt-b31fc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pet-adopt-b31fc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "356849283382",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:356849283382:web:0f592f82c083cb5c840397",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-P7419FYP1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  app, 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  onAuthStateChanged 
};
