import * as firebase from 'firebase'  // Should not be used elsewhere in the project
import firebaseData from './app.json';
import config from './config.js';

firebase.initializeApp({
    apiKey: config.apiKey,
    authDomain: firebaseData.expo.extra.firebase.authDomain,
    databaseURL: firebaseData.expo.extra.firebase.databaseURL,
    projectId: firebaseData.expo.extra.firebase.projectId,
    storageBucket: firebaseData.expo.extra.firebase.storageBucket,
    messagingSenderId: firebaseData.expo.extra.firebase.messagingSenderId
});

export default firebase;