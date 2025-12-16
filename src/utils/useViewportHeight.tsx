import { useEffect, useState } from "react";

export const useViewportHeight = () => {
  const [height, setHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      // Modern tarayıcılar için dvh'yi tercih et
      if (CSS.supports("height", "100dvh")) {
        setHeight("100dvh");
      } else {
        // Eski tarayıcılar için JavaScript hesaplama
        setHeight(`${window.innerHeight}px`);
      }
    };

    updateHeight();

    // Scroll veya resize olaylarında güncelle
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHeight, 100);
    };

    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", updateHeight);

    // Mobile tarayıcılarda scroll bittiğinde de güncelle
    window.addEventListener("scroll", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", updateHeight);
      window.removeEventListener("scroll", debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  return height;
};
