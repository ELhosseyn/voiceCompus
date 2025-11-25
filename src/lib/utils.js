import { clsx } from "clsx"
    import { twMerge } from "tailwind-merge"

    export function cn(...inputs) {
      return twMerge(clsx(inputs))
    }

    export const timeSince = (dateString, language = 'ar') => {
      const date = new Date(dateString);
      const seconds = Math.floor((new Date() - date) / 1000);
      let interval = seconds / 31536000; // years
      if (interval > 1) return language === 'ar' ? `منذ ${Math.floor(interval)} سنة` : `il y a ${Math.floor(interval)} ans`;
      interval = seconds / 2592000; // months
      if (interval > 1) return language === 'ar' ? `منذ ${Math.floor(interval)} شهر` : `il y a ${Math.floor(interval)} mois`;
      interval = seconds / 86400; // days
      if (interval > 1) return language === 'ar' ? `منذ ${Math.floor(interval)} يوم` : `il y a ${Math.floor(interval)} jours`;
      interval = seconds / 3600; // hours
      if (interval > 1) return language === 'ar' ? `منذ ${Math.floor(interval)} ساعة` : `il y a ${Math.floor(interval)} heures`;
      interval = seconds / 60; // minutes
      if (interval > 1) return language === 'ar' ? `منذ ${Math.floor(interval)} دقيقة` : `il y a ${Math.floor(interval)} minutes`;
      return language === 'ar' ? `منذ ${Math.floor(seconds)} ثانية` : `il y a ${Math.floor(seconds)} secondes`;
    };