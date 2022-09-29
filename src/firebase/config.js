import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAR99i28EQv5B3MjXLAjjSNDfPzZf7iIo",
  authDomain: "kanban-database.firebaseapp.com",
  projectId: "kanban-database",
  storageBucket: "kanban-database.appspot.com",
  messagingSenderId: "369352286637",
  appId: "1:369352286637:web:845b7eb6c183076e4c4124"
};

// init firebase

firebase.initializeApp(firebaseConfig);

//init services

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

//timestamp

const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp };
