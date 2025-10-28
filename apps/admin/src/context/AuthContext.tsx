import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";

type User = {
  email: string;
  role: "owner" | "admin" | "family" | "viewer";
};

type AuthContextValue = {
  user: User | null;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
};

const OWNER_EMAIL = "fiv4lab@gmail.com";
const STORAGE_KEY = "auirah_admin_auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch (error) {
    console.warn("Unable to parse auth state", error);
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      async requestOtp(email) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (email.toLowerCase() !== OWNER_EMAIL) {
          throw new Error("Only the owner account can request access in this demo.");
        }
      },
      async verifyOtp(email, code) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (email.toLowerCase() !== OWNER_EMAIL || code !== "123456") {
          throw new Error("Invalid one-time passcode for this demo environment.");
        }
        const authUser: User = { email: OWNER_EMAIL, role: "owner" };
        setUser(authUser);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      },
      logout() {
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
