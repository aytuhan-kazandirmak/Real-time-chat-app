import { useContext } from "react";
import { ThemeContext, type ThemeContextType } from "./ThemeContext";

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useAuth must be used within AuthContextProvider");
  return context;
}
