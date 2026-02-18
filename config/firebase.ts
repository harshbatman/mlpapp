import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration (from your google-services.json)
const firebaseConfig = {
    apiKey: "AIzaSyBLI43RC_QN8LthWpN0Fe6yEg62pSIfsPo",
    authDomain: "mahto-b8626.firebaseapp.com",
    projectId: "mahto-b8626",
    storageBucket: "mahto-b8626.firebasestorage.app",
    messagingSenderId: "94425344059",
    appId: "1:94425344059:android:462fde7f7ae81ddff0d41e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db: Firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

