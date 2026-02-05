"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "user" | "farmer" | "agronomist" | "specialist" | "admin";
export type UserStatus = "active" | "pending" | "blocked";

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  status: UserStatus;
};

type AuthCtx = {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

async function ensureUserDoc(firebaseUser: User, desiredRole?: UserRole) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const role: UserRole = desiredRole ?? "user";
    await setDoc(ref, {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? null,
      displayName: firebaseUser.displayName ?? null,
      role,
      status: "active", // default active; për agronomist mund ta bësh "pending"
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

async function readProfile(uid: string): Promise<{ role: UserRole; status: UserStatus }> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  const data = snap.data();
  return {
    role: (data?.role as UserRole) ?? "user",
    status: (data?.status as UserStatus) ?? "active",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // siguro dokumentin users/{uid}
        await ensureUserDoc(firebaseUser);

        const { role, status } = await readProfile(firebaseUser.uid);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role,
          status,
        });
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthCtx>(() => {
    return {
      user,
      isLoading,
      isAuthenticated: !!user,

      async signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },

      async signUp(email, password, role) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(cred.user, role);
      },

      async signOutUser() {
        await signOut(auth);
      },
    };
  }, [user, isLoading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
