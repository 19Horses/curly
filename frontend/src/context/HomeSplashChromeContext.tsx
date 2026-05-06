import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type HomeSplashChromeContextValue = {
  suppressSiteHeader: boolean;
  setSuppressSiteHeader: (value: boolean) => void;
};

const HomeSplashChromeContext =
  createContext<HomeSplashChromeContextValue | null>(null);

export function HomeSplashChromeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [suppressSiteHeader, setSuppressSiteHeader] = useState(false);

  const value = useMemo(
    () => ({ suppressSiteHeader, setSuppressSiteHeader }),
    [suppressSiteHeader]
  );

  return (
    <HomeSplashChromeContext.Provider value={value}>
      {children}
    </HomeSplashChromeContext.Provider>
  );
}

export function useHomeSplashChrome() {
  const ctx = useContext(HomeSplashChromeContext);
  if (!ctx) {
    throw new Error(
      'useHomeSplashChrome must be used within HomeSplashChromeProvider'
    );
  }
  return ctx;
}
