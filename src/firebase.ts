import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSIaWI65_edtcmFiAI5EMY9Xiehipnel0",
  authDomain: "e-store-660ea.firebaseapp.com",
  projectId: "e-store-660ea",
  storageBucket: "e-store-660ea.firebasestorage.app",
  messagingSenderId: "222783041156",
  appId: "1:222783041156:web:ad1ec780650cb553141cd1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
