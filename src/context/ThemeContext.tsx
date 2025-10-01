import { createContext, useCallback, useMemo, useState } from "react";

export const ThemeContext = createContext(undefined);

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useState("light");

  const themeChanger = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
    } else {
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
