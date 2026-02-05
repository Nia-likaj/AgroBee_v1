"use client";

import { ReactNode } from "react";
import { useAuth, UserRole } from "@/components/auth/AuthProvider";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="glass rounded-2xl p-5">
          <div className="text-lg font-semibold text-[color:var(--primary-dark)]">
            Kërkohet hyrje
          </div>
          <div className="mt-1 text-sm text-black/60">
            Ju lutem hyni për të vazhduar.
          </div>
                {/* Butonat/linket për hyrje u hoqën */}
        </div>
      </div>
    );
  }
  
  if (user.status === "blocked") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="glass rounded-2xl p-5">
          <div className="text-lg font-semibold text-red-600">
            Llogaria e bllokuar
          </div>
          <div className="mt-1 text-sm text-black/60">
            Kontaktoni suportin AgroBee për asistencë.
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

export function RequireRole({
  allow,
  children,
}: {
  allow: UserRole[];
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (!user) return null;
  
  return allow.includes(user.role) ? (
    <>{children}</>
  ) : (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="glass rounded-2xl p-5">
        <div className="text-lg font-semibold text-[color:var(--primary-dark)]">
          Nuk keni akses
        </div>
        <div className="mt-1 text-sm text-black/60">
          Kjo pjesë është e rezervuar për role të caktuara.
        </div>
      </div>
    </div>
  );
}
