// PWA Service Worker Registration & Installation Manager

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('SmartGuard PWA Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    });
  }
};

export const checkNetworkStatus = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};
