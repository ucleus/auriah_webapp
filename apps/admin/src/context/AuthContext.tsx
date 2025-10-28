import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiFetch } from "../api/client";
import type { User } from "../types";

type AuthState = {
  token: string;
  user: User;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  requestOtp: (email: string) => Promise<{ demoCode?: string | null }>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "auirah_admin_auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredState(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthState;
  } catch (error) {
    console.warn("Unable to parse auth state", error);
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState | null>(() => readStoredState());

  useEffect(() => {
    if (!state) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user: state?.user ?? null,
      token: state?.token ?? null,
      async requestOtp(email) {
        const response = await apiFetch<{ message: string; demo_code?: string | null }>("/auth/otp/request", {
          method: "POST",
          body: JSON.stringify({ email }),
        });

        return { demoCode: response.demo_code };
      },
      async verifyOtp(email, code) {
        const response = await apiFetch<{ token: string; user: User }>("/auth/otp/verify", {
          method: "POST",
          body: JSON.stringify({ email, code, device_name: "auirah-admin" }),
        });

        const authState: AuthState = { token: response.token, user: response.user };
        setState(authState);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
      },
      async logout() {
        if (!state?.token) {
          setState(null);
          window.localStorage.removeItem(STORAGE_KEY);
          return;
        }

        try {
          await apiFetch("/auth/logout", {
            method: "POST",
            token: state.token,
          });
        } finally {
          setState(null);
          window.localStorage.removeItem(STORAGE_KEY);
        }
      },
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
