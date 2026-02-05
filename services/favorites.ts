import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const subCol = (uid: string) => `users/${uid}/favorites`;

export type Favorite = {
  id: string; // farmId
  farmId: string;
  createdAt?: any;
};

export async function listFavoriteFarmIds(uid: string): Promise<string[]> {
  const snap = await getDocs(collection(db, subCol(uid)));
  return snap.docs.map((d) => d.id);
}

export async function addFavorite(uid: string, farmId: string): Promise<void> {
  const ref = doc(db, subCol(uid), farmId);
  await setDoc(ref, { farmId, createdAt: serverTimestamp() }, { merge: true });
}

export async function removeFavorite(uid: string, farmId: string): Promise<void> {
  const ref = doc(db, subCol(uid), farmId);
  await deleteDoc(ref);
}

export async function toggleFavorite(uid: string, farmId: string, isFav: boolean): Promise<boolean> {
  // if isFav true => remove, else add
  if (isFav) {
    await removeFavorite(uid, farmId);
    return false;
  }
  await addFavorite(uid, farmId);
  return true;
}
