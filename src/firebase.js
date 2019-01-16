import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import secrets from "./secrets";

const config = {
  apiKey: secrets.firebase.apiKey,
  authDomain: "incident-report-map.firebaseapp.com",
  databaseURL: "https://incident-report-map.firebaseio.com",
  projectId: "incident-report-map",
  storageBucket: "",
  messagingSenderId: secrets.firebase.messagingSenderId
};

firebase.initializeApp(config);

export default firebase;
