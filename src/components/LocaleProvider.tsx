"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Locale = "en" | "vi";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (english: string, vietnamese: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [preference, setLocale] = useState<Locale>("en");
  const pathname = usePathname();
  const router = useRouter();
  const pathLocale = pathname.split("/")[1];
  const locale: Locale = pathLocale === "vi" || pathLocale === "en" ? pathLocale : preference;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedLocale = window.localStorage.getItem("portfolio-locale");
      if (savedLocale === "vi" || savedLocale === "en") setLocale(savedLocale);
    } catch { /* Storage can be unavailable in restricted browser contexts. */ }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    document.documentElement.lang = locale;
    try { window.localStorage.setItem("portfolio-locale", locale); } catch { /* Optional preference. */ }
  }, [isReady, locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      toggleLocale: () => {
        const next = locale === "en" ? "vi" : "en";
        setLocale(next);
        if (/^\/(en|vi)\/blog(?:\/|$)/.test(pathname)) router.push(pathname.replace(/^\/(en|vi)/, `/${next}`));
      },
      t: (english, vietnamese) => (locale === "vi" ? vietnamese : english),
    }),
    [locale, pathname, router],
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
