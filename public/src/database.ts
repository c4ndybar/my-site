import firebase from "firebase/compat/app";

// Required for side-effects
import "firebase/compat/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyBJvJAmih1K9fc5_4rZWKsMxBNYLoQriys",
  authDomain: "my-site-6ee06.firebaseapp.com",
  databaseURL: "https://my-site-6ee06.firebaseio.com",
  projectId: "my-site-6ee06",
  storageBucket: "my-site-6ee06.appspot.com",
  messagingSenderId: "542610739420",
  appId: "1:542610739420:web:8df65a682d8dc44132e419",
  measurementId: "G-9DTB5QTML6",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
