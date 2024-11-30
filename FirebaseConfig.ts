import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBvEd83xFkAt9hZtmFN_G9rfHYjrkR-UnM",
  authDomain: "qrscanner-ab6a7.firebaseapp.com",
  projectId: "qrscanner-ab6a7",
  storageBucket: "qrscanner-ab6a7.appspot.com",
  messagingSenderId: "72098531830",
  appId: "1:72098531830:web:362d509fb6a2c62e4a9fd7",
  measurementId: "G-VPC0E3DTWK"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
