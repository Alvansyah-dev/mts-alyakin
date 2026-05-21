import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMRfLno2TkuYSIJj7ULuMXdyd0tSQEsFM",
  authDomain: "mts-al-yakin.firebaseapp.com",
  projectId: "mts-al-yakin",
  storageBucket: "mts-al-yakin.firebasestorage.app",
  messagingSenderId: "383100087066",
  appId: "1:383100087066:web:3d3a971fb43361910d9aa3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const docRef = doc(db, 'siteSettings', 'news_settings');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(docSnap.data());
  } else {
    console.log("No such document!");
  }
}
test();
