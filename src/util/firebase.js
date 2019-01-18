import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import secrets from "../data/secrets";

const config = {
  apiKey: secrets.firebase.apiKey,
  authDomain: "incident-report-map.firebaseapp.com",
  databaseURL: "https://incident-report-map.firebaseio.com",
  projectId: "incident-report-map",
  storageBucket: "",
  messagingSenderId: secrets.firebase.messagingSenderId
};

const { user, password } = secrets.firebase;

const myfirebase = async callback => {
  // Set up
  firebase.initializeApp(config);
  firebase.auth().signInWithEmailAndPassword(user, password);
  firebase
    .database()
    .ref("tweets")
    .once("value")
    .then(snapshot => callback(snapshot.val()));
  firebase
    .database()
    .ref("tweets")
    .on("value", snapshot => callback(snapshot.val()));
};

export default myfirebase;
