// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS_lc9U3TVw-0mfydx5NE-SITM__bTRe8",
  authDomain: "eggbucketadmin.firebaseapp.com",
  projectId: "eggbucketadmin",
  storageBucket: "eggbucketadmin.firebasestorage.app",
  messagingSenderId: "933770224026",
  appId: "1:933770224026:web:a4aabf196d11bdfd4c9a23",
  measurementId: "G-6ZCPJVZG8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)