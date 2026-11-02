"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

type Locale = "en" | "vi";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (english: string, vietnamese: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readSavedLocale(): Locale {
  try { return window.localStorage.getItem("portfolio-locale") === "vi" ? "vi" : "en"; }
  catch { return "en"; }
}

function subscribeLocale(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("portfolio-locale-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("portfolio-locale-change", onChange);
  };
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const savedLocale = useSyncExternalStore(subscribeLocale, readSavedLocale, () => "en" as Locale);
  const [preference, setLocale] = useState<Locale | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const pathLocale = pathname.split("/")[1];
  const locale: Locale = pathLocale === "vi" || pathLocale === "en" ? pathLocale : preference ?? savedLocale;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      toggleLocale: () => {
        const next = locale === "en" ? "vi" : "en";
        setLocale(next);
        try { window.localStorage.setItem("portfolio-locale", next); } catch { /* Optional preference. */ }
        window.dispatchEvent(new Event("portfolio-locale-change"));
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
