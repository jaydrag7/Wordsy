// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJniB7zeSJFV192-LT2IlPzQ6TwHfzPJQ",
  authDomain: "wordsy-8560b.firebaseapp.com",
  databaseURL: "https://wordsy-8560b-default-rtdb.firebaseio.com",
  projectId: "wordsy-8560b",
  storageBucket: "wordsy-8560b.appspot.com",
  messagingSenderId: "880537625331",
  appId: "1:880537625331:web:707dba079ef28cef96cd86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
export{
    db
}
