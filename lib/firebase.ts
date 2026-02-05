// lib/firebase.ts
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(clientConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Analytics (vetëm në browser)
let analyticsInstance: Analytics | null = null;
export function getAnalyticsClient(): Analytics | null {
  if (typeof window === "undefined") return null;
  if (!analyticsInstance) {
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
}

let storagePromise: Promise<import("firebase/storage").FirebaseStorage> | null = null;

export async function getStorageClient() {
  if (typeof window === "undefined") return null;
  if (!storagePromise) {
    storagePromise = import("firebase/storage").then(({ getStorage }) => getStorage(app));
  }
  return storagePromise;
}
