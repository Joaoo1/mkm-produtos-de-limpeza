import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

/* Set your .env file with the firestore configs */
const prodConfig = {
  apiKey: process.env.REACT_APP_PROD_API_KEY,
  authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
  projectId: process.env.REACT_APP_PROD_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_PROD_APP_ID,
  measurementId: process.env.REACT_APP_PROD_MEASUREMENT_ID,
};

const firebase = app.initializeApp(prodConfig);

export default firebase;

export const Auth = firebase.auth();

export const Firestore = firebase.firestore();

export const Functions = firebase.functions();
