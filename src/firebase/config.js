import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClk0QNRwqpx3-DmsJ0pZ4SHrNwV_q_qaI",
  authDomain: "task-management-web-app-b2286.firebaseapp.com",
  projectId: "task-management-web-app-b2286",
  storageBucket: "task-management-web-app-b2286.appspot.com",
  messagingSenderId: "510256032485",
  appId: "1:510256032485:web:4b42b9a99dbe25e86a420c",
};

// init firebase

firebase.initializeApp(firebaseConfig);

//init services

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

//timestamp

const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp };
