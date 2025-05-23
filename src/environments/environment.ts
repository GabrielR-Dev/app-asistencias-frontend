// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyC8WrW8V9Hc_Nl6PCZ6MqsIc1ysKqpM19w",
  authDomain: "probando-login-94073.firebaseapp.com",
  projectId: "probando-login-94073",
  storageBucket: "probando-login-94073.firebasestorage.app",
  messagingSenderId: "218037438353",
  appId: "1:218037438353:web:5ca9d9ffa11a0ab49f7c30",
  measurementId: "G-W9ZZCFPZC4"
};
//Patfl8FDAaWUHVCKTC7bBwWFkj03

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);