import {
    firebase
} from "@firebase/app";
import "@firebase/firestore";
import {
    config
} from "./config/firebaseConfig";

export const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.firestore();