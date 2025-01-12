import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDNmjzPX-VXX0L8_BcsBBniDUaQ0Kes0LA",
    authDomain: "notegen-ai.firebaseapp.com",
    projectId: "notegen-ai",
    storageBucket: "notegen-ai.firebasestorage.app",
    messagingSenderId: "264220971199",
    appId: "1:264220971199:web:f472d417bd03c86a39b60a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, googleProvider, facebookProvider, signInWithPopup };
