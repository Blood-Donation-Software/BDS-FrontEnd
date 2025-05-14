// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { FIREBASE_KEY } from "@/global-config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "test-8f1b1.firebaseapp.com",
  projectId: "test-8f1b1",
  storageBucket: "test-8f1b1.firebasestorage.app",
  messagingSenderId: "759426397071",
  appId: "1:759426397071:web:60954af4d11a252fdc11fa",
  measurementId: "G-7P1EH67EN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);