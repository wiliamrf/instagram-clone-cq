//import firebase from '../node_modules/firebase';
import firebase from 'firebase';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBRaboYAovwALPoDWK4eag7ttyZrHsijjo",
    authDomain: "instagram-clone-cq.firebaseapp.com",
    projectId: "instagram-clone-cq",
    storageBucket: "instagram-clone-cq.appspot.com",
    messagingSenderId: "501714729356",
    appId: "1:501714729356:web:d18b11d25afd3abf40bea9",
    measurementId: "G-3NSQRCB7YE"
});




const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, storage, functions };