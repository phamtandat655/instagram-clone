// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCyjjXFopme3zfO-l052PklayokqUAIzxk',
    authDomain: 'instagram-clone-c4282.firebaseapp.com',
    projectId: 'instagram-clone-c4282',
    storageBucket: 'instagram-clone-c4282.appspot.com',
    messagingSenderId: '558062331779',
    appId: '1:558062331779:web:0613a052925a297621b8b6',
    measurementId: 'G-PPGWHFHR4E',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
