"use client"

import { useEffect } from 'react';

const ServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failedssss:', error);
        });
    }
  }, []);

  return null; // This component doesn't render anything in the DOM
};

export default ServiceWorker;