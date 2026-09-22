import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "../types";
import { translations } from "../data/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.en;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("plumbing_solution_lang") as Language;
      if (saved === "ar" || saved === "en") return saved;
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("plumbing_solution_lang", lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      const isRtl = language === "ar";
      document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", language);
    }
  }, [language]);

  const t = translations[language] || translations.en;
  const isRtl = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
