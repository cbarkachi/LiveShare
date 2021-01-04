// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPZS-0n5kLB_DTqDycQswMdGeLRvVzesk",
  authDomain: "liveshare-291722.firebaseapp.com",
  databaseURL: "https://liveshare-291722.firebaseio.com",
  projectId: "liveshare-291722",
  storageBucket: "liveshare-291722.appspot.com",
  messagingSenderId: "206877717251",
  appId: "1:206877717251:web:75654392af723c2fcf6f36",
  measurementId: "G-P4FB5JDEGE",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
