import React, { createContext } from "react";

export const AuthContext = createContext();

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  function login() {}
  function logout() {}
  function signUp() {}
  return <AuthContext.Provider value="">{children}</AuthContext.Provider>;
}
