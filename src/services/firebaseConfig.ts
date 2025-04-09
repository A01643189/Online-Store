import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth" 
import { doc, getDoc } from "firebase/firestore";
// Your web app's Firebase configuration 

const firebaseConfig = {
    apiKey: "AIzaSyBSIaWI65_edtcmFiAI5EMY9Xiehipnel0",
    authDomain: "e-store-660ea.firebaseapp.com",
    projectId: "e-store-660ea",
    storageBucket: "e-store-660ea.firebasestorage.app",
    messagingSenderId: "222783041156",
    appId: "1:222783041156:web:ad1ec780650cb553141cd1"
};

export const getUserDisplayName = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().displayName || "";
    }
    return "";
  } catch (error) {
    console.error("Error getting user displayName:", error);
    return "";
  }
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app); 
export const db = getFirestore(app);