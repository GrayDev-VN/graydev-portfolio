"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Locale = "en" | "vi";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (english: string, vietnamese: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("portfolio-locale");
    if (savedLocale === "vi" || savedLocale === "en") {
      setLocale(savedLocale);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    document.documentElement.lang = locale;
    window.localStorage.setItem("portfolio-locale", locale);
  }, [isReady, locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      toggleLocale: () => setLocale((current) => (current === "en" ? "vi" : "en")),
      t: (english, vietnamese) => (locale === "vi" ? vietnamese : english),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
