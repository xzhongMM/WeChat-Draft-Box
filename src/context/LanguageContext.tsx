import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import en from "../locales/en";
import zh from "../locales/zh";

type Language = "en" | "zh";

const translations = {
  en,
  zh,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({children,}: {children: React.ReactNode;}) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem("language");

        if (saved === "zh" || saved === "en")
            return saved;

        return "en";
    });

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be inside LanguageProvider");
  }

  return context;
}