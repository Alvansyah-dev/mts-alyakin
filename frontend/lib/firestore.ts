import { 
  doc, getDoc, setDoc, onSnapshot,
  collection, getDocs, query, orderBy,
  addDoc, updateDoc, deleteDoc, where,
  DocumentData, QueryConstraint
} from 'firebase/firestore'
import { db } from './firebase'

export async function getSettings(key: string) {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db as any, 'siteSettings', key))
    if (snap.exists()) {
      return snap.data()
    }
    return null
  } catch (error) {
    console.error('getSettings error:', error)
    return null
  }
}

export async function saveSettings(
  key: string, 
  data: any
): Promise<boolean> {
  if (!db) {
    console.warn('saveSettings: db is null (missing env vars?)');
    return false;
  }
  try {
    await setDoc(
      doc(db as any, 'siteSettings', key),
      {
        ...data,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    )
    return true
  } catch (error: any) {
    console.error('saveSettings error:', error)
    throw error
  }
}

export function listenSettings(
  key: string,
  callback: (data: any) => void
): () => void {
  if (!db) {
    console.warn('listenSettings: db is null (missing env vars?)');
    callback(null);
    return () => {};
  }
  try {
    return onSnapshot(
      doc(db as any, 'siteSettings', key),
      (snap) => {
        callback(snap.exists() ? snap.data() : null)
      },
      (error) => {
        console.error('listenSettings error:', error)
        callback(null)
      }
    )
  } catch (error) {
    console.error('listenSettings setup error:', error)
    return () => {}
  }
}

// --- Generic Collection Operations ---

export async function getCollectionData(collectionName: string, constraints: QueryConstraint[] = []) {
  if (!db) return [];
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    return [];
  }
}

export async function createDocument(collectionName: string, data: any, customId?: string) {
  if (!db) return null;
  try {
    const payload = { ...data, createdAt: new Date().toISOString() };
    if (customId) {
      await setDoc(doc(db, collectionName, customId), payload);
      return customId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), payload);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    return null;
  }
}

export async function updateDocument(collectionName: string, docId: string, data: any) {
  if (!db) return false;
  try {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await updateDoc(doc(db, collectionName, docId), payload);
    return true;
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error);
    return false;
  }
}

export async function deleteDocument(collectionName: string, docId: string) {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error(`Error deleting document ${docId} in ${collectionName}:`, error);
    return false;
  }
}
