import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Safe helper to get settings
export async function getSettings(key: string) {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'siteSettings', key));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error(`Firestore getSettings error for key ${key}:`, err);
    return null;
  }
}

// Safe helper to save settings
export async function saveSettings(key: string, data: any) {
  if (!db) {
    console.error('Firestore db is not initialized. Cannot save settings.');
    return false;
  }
  try {
    await setDoc(doc(db, 'siteSettings', key), data, { merge: true });
    return true;
  } catch (e) {
    console.error('Firestore save error:', e);
    return false;
  }
}

// Safe helper to listen settings (realtime)
export function listenSettings(key: string, callback: (data: any) => void) {
  if (!db) {
    callback(null);
    return () => {};
  }
  try {
    return onSnapshot(
      doc(db, 'siteSettings', key),
      (snap) => callback(snap.exists() ? snap.data() : null),
      (err) => {
        console.error('Firestore listen error:', err);
        callback(null);
      }
    );
  } catch (err) {
    console.error('Firestore listen initial error:', err);
    callback(null);
    return () => {};
  }
}
