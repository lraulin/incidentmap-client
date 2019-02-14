import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { firebaseConfig } from "../data/secrets";

const myfirebase = async callback => {
  // Set up
  firebase.initializeApp(firebaseConfig);
  firebase
    .auth()
    .signInWithEmailAndPassword(firebaseConfig.user, firebaseConfig);
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
