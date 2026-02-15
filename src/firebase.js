// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbYU-e9GrB_IXhmpHfG_bIXGh5eGYEOoY",
    authDomain: "internshipcatalyst-261c8.firebaseapp.com",
    databaseURL: "https://internshipcatalyst-261c8-default-rtdb.firebaseio.com",
    projectId: "internshipcatalyst-261c8",
    storageBucket: "internshipcatalyst-261c8.firebasestorage.app",
    messagingSenderId: "1037509064725",
    appId: "1:1037509064725:web:928fc174ede0b729b8361c",
    measurementId: "G-0E5JMD6RZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
