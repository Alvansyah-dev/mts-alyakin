import { 
  doc, getDoc, setDoc, onSnapshot,
  collection, getDocs, query, orderBy
} from 'firebase/firestore'
import { db } from './firebase'

export async function getSettings(key: string) {
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
  try {
    return onSnapshot(
      doc(db, 'siteSettings', key),
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
