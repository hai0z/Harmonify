import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, setLogLevel, } from "firebase/firestore";
import * as firebaseAuth from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoqxr8OT0HnxfM9P2sXHXEn554BK-G2yg",
  authDomain: "mu-music-470cb.firebaseapp.com",
  projectId: "mu-music-470cb",
  databaseURL: 'https://mu-music-470cb.firebaseio.com',
  storageBucket: "mu-music-470cb.appspot.com",
  messagingSenderId: "1019425232695",
  appId: "1:1019425232695:web:85d639638e5b5924fa2cb2",
  measurementId: "G-EE1NZYGWHH"
};

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  experimentalForceLongPolling: true
})
const db = getFirestore(app)
firebaseAuth.initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
})
const auth = firebaseAuth.getAuth(app)

export { db, auth }