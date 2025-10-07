import type { Session } from "@supabase/supabase-js";
import { createContext } from "react";

export type AuthContextType = {
  session: Session | null;
  signUpNewUser: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean }>;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
  }>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
