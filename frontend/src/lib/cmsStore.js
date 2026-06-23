'use client';

export const CMS_STORAGE_KEY = 'bapujiWebsiteCmsHome';
export const CMS_UPDATE_EVENT = 'bapuji-cms-home-updated';

export const DEFAULT_CMS_HOME = {
  heroTitle: 'Premium Wet Wipes for modern global brands',
  heroDesc: 'Custom OEM wet wipes manufacturing for hygiene, beauty, baby care, fitness, and healthcare brands worldwide.',
  heroCtaPrimary: 'Explore Products',
  heroCtaSecondary: 'Get a Quote',
  aboutText: 'Bapuji Surgicals designs, formulates and packages premium wet wipes for hospitals, clinics, pharmacies and wellness brands. Our cleanroom processes, custom OEM services and logistics network ensure every wet wipe pack arrives sterile, branded and ready for distribution.',
  footerCopyright: '© 2026 Bapuji Surgicals. All rights reserved.',
  heroImages: [
    '/img/mother_baby_wipes.png',
    '/img/kitchen_wipes.png',
    '/img/after_shave_wipes.png'
  ],
  aboutImage: '/img/Bapuji.png'
};

export const getCmsHome = () => {
  if (typeof window === 'undefined') return DEFAULT_CMS_HOME;

  try {
    const stored = window.localStorage.getItem(CMS_STORAGE_KEY);
    if (!stored) return DEFAULT_CMS_HOME;
    
    const parsed = JSON.parse(stored);
    
    // Auto-heal cache for deleted legacy images
    if (parsed.aboutImage === '/img/about_factory_modern.png') {
      parsed.aboutImage = '/img/Bapuji.png';
      window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(parsed));
    }

    return { ...DEFAULT_CMS_HOME, ...parsed };
  } catch {
    return DEFAULT_CMS_HOME;
  }
};

export const saveCmsHome = (nextCmsHome) => {
  if (typeof window === 'undefined') return nextCmsHome;

  const merged = { ...DEFAULT_CMS_HOME, ...nextCmsHome };
  window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: merged }));
  return merged;
};

export const subscribeCmsHome = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomUpdate = (event) => {
    callback(event.detail || getCmsHome());
  };

  const handleStorageUpdate = (event) => {
    if (event.key === CMS_STORAGE_KEY) {
      callback(getCmsHome());
    }
  };

  window.addEventListener(CMS_UPDATE_EVENT, handleCustomUpdate);
  window.addEventListener('storage', handleStorageUpdate);

  return () => {
    window.removeEventListener(CMS_UPDATE_EVENT, handleCustomUpdate);
    window.removeEventListener('storage', handleStorageUpdate);
  };
};
