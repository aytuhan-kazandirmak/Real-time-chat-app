import { createContext } from "react";

export type ThemeContextType = {
  theme: string;
  themeChanger: () => void;
};
const systemTheme =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const localTheme =
  typeof window !== "undefined" && localStorage.getItem("theme")
    ? (localStorage.getItem("theme") as string)
    : systemTheme;

export const ThemeContext = createContext<ThemeContextType>({
  theme: localTheme,
  themeChanger: () => {},
});
