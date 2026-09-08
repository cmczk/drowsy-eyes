import { useLocales } from 'expo-localization';
import Storage from 'expo-sqlite/kv-store';
import { I18n, Scope, TranslateOptions } from 'i18n-js';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { translations } from './translations';

const LANGUAGE_STORAGE_KEY = 'preferred-language';

export type SupportedLocale = 'ru' | 'en';

type Translate = (scope: Scope, options?: TranslateOptions) => string;

type LocalizationContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: Translate;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(
  null,
);

function isSupportedLocale(value: unknown): value is SupportedLocale {
  return value === 'ru' || value === 'en';
}

function resolveSystemLocale(languageCode: string | null | undefined) {
  return languageCode === 'ru' ? 'ru' : 'en';
}

function readStoredLocale(): SupportedLocale | null {
  try {
    const storedLocale = Storage.getItemSync(LANGUAGE_STORAGE_KEY);

    return isSupportedLocale(storedLocale) ? storedLocale : null;
  } catch {
    return null;
  }
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const locales = useLocales();
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale | null>(
    readStoredLocale,
  );

  const systemLocale = resolveSystemLocale(locales[0].languageCode);
  const locale = selectedLocale ?? systemLocale;

  const i18n = useMemo(() => {
    const instance = new I18n(translations);
    instance.defaultLocale = 'en';
    instance.enableFallback = true;
    instance.locale = locale;

    return instance;
  }, [locale]);

  const t = useCallback<Translate>(
    (scope, options) => i18n.t<string>(scope, options),
    [i18n],
  );

  const saveLocale = useCallback((newLocale: SupportedLocale) => {
    Storage.setItemSync(LANGUAGE_STORAGE_KEY, newLocale);
    setSelectedLocale(newLocale);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale: saveLocale, t }),
    [locale, saveLocale, t],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error('useLocalization must be used inside LocalizationProvider');
  }

  return context;
}
