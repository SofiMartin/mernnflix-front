import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  
  // Estado adicional para forzar actualizaciones
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    // Guardar el estado del modo oscuro en localStorage
    localStorage.setItem("darkMode", isDarkMode);

    // Aplicar o eliminar la clase "dark" en el elemento <html>
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Forzar una recarga de imágenes cambiando la URL con timestamp
    document.querySelectorAll('img').forEach(img => {
      if (img.src && !img.src.includes('data:')) {
        const currentSrc = img.src;
        // Añadir o actualizar parámetro de timestamp
        const newSrc = currentSrc.includes('?') 
          ? currentSrc.replace(/([?&]t=)\d+/, `$1${Date.now()}`)
          : `${currentSrc}?t=${Date.now()}`;
        img.src = newSrc;
      }
    });
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    // Incrementar versión para forzar re-renders
    setThemeVersion(prev => prev + 1);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeVersion }}>
      {children}
    </ThemeContext.Provider>
  );
};