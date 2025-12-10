import { useState, useEffect } from 'react';

export type Locale = 'en' | 'ar';

const LOCALE_STORAGE_KEY = 'app_locale';

export const useLocale = (initialLocale: Locale = 'en') => {
    // Initialize from localStorage or use provided initial locale
    const [locale, setLocale] = useState<Locale>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
            return stored || initialLocale;
        }
        return initialLocale;
    });

    // Persist locale to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCALE_STORAGE_KEY, locale);
            // Update document direction for RTL support
            document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const toggleLocale = () => {
        setLocale((prev) => (prev === 'en' ? 'ar' : 'en'));
    };

    const isRTL = locale === 'ar';

    return {
        locale,
        setLocale,
        toggleLocale,
        isRTL,
    };
};
