// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Tema bağlamını oluştur
const ThemeContext = createContext();

// Tema sağlayıcı bileşeni
export const ThemeProvider = ({ children }) => {
  // localStorage'dan kaydedilmiş temayı al, yoksa sistem tercihini kullan
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Kullanıcının sistem tercihini kontrol et
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Tema değiştiğinde HTML etiketine 'dark' sınıfını ekle/kaldır
  useEffect(() => {
    const root = window.document.documentElement; // HTML etiketini seç
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Tercihi kaydet
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Tercihi kaydet
    }
  }, [theme]); // Tema değiştiğinde bu efekti yeniden çalıştır

  // Temayı değiştiren fonksiyon
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Bağlam değerini sağla
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Tema bağlamını kullanmak için özel hook
export const useTheme = () => useContext(ThemeContext);
