import { useCallback, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

type ThemeContextProviderProps = {
  children: React.ReactNode;
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

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<string>(localTheme);

  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const themeChanger = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.theme = "dark";
    } else {
      localStorage.theme = "light";
      setTheme("light");
    }
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      themeChanger,
    }),
    [theme, themeChanger]
  );
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
