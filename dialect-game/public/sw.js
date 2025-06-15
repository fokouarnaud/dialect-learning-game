// Service Worker pour cache agressif et performance optimisée

const CACHE_NAME = 'dialect-game-v1.0.0';
const STATIC_CACHE = 'dialect-game-static-v1';
const API_CACHE = 'dialect-game-api-v1';
const IMAGE_CACHE = 'dialect-game-images-v1';

// Ressources à mettre en cache immédiatement
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Patterns d'URLs à cacher
const CACHE_PATTERNS = {
  static: /\.(js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$/,
  api: /\/api\//,
  images: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
  external_images: /^https:\/\/(images\.unsplash\.com|images\.pexels\.com|picsum\.photos)\//
};

// Configuration cache
const CACHE_CONFIG = {
  static: {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
    maxEntries: 200
  },
  api: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 100
  },
  images: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
    maxEntries: 150
  }
};

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting(); // Activer immédiatement
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      cleanupOldCaches(),
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: Activation complete');
    })
  );
});

/**
 * Interception des requêtes réseau
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) return;
  
  // Stratégie selon le type de ressource
  if (CACHE_PATTERNS.static.test(url.pathname)) {
    // Assets statiques: Cache First
    event.respondWith(handleStaticAssets(request));
  } else if (CACHE_PATTERNS.api.test(url.pathname)) {
    // APIs: Network First avec cache fallback
    event.respondWith(handleApiRequests(request));
  } else if (CACHE_PATTERNS.external_images.test(url.href)) {
    // Images externes: Cache First avec Network fallback
    event.respondWith(handleExternalImages(request));
  } else if (request.mode === 'navigate') {
    // Navigation: Network First avec cache fallback
    event.respondWith(handleNavigation(request));
  }
});

/**
 * Gestion des assets statiques (Cache First)
 */
async function handleStaticAssets(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Vérifier si le cache est encore valide
      const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
      const isExpired = Date.now() - cacheDate.getTime() > CACHE_CONFIG.static.maxAge;
      
      if (!isExpired) {
        return cachedResponse;
      }
    }
    
    // Aller chercher la ressource
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, networkResponse.clone());
      await enforceMaxEntries(STATIC_CACHE, CACHE_CONFIG.static.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ Static asset fetch failed:', request.url);
    
    // Retourner du cache même expiré en cas d'erreur
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Gestion des requêtes API (Network First)
 */
async function handleApiRequests(request) {
  try {
    // Essayer le réseau en premier
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Mettre en cache seulement les GET requests
      if (request.method === 'GET') {
        const cache = await caches.open(API_CACHE);
        await cache.put(request, networkResponse.clone());
        await enforceMaxEntries(API_CACHE, CACHE_CONFIG.api.maxEntries);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ API request failed, trying cache:', request.url);
    
    // Fallback sur le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Vérifier l'expiration
      const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
      const isExpired = Date.now() - cacheDate.getTime() > CACHE_CONFIG.api.maxAge;
      
      if (!isExpired) {
        return cachedResponse;
      }
    }
    
    throw error;
  }
}

/**
 * Gestion des images externes (Cache First)
 */
async function handleExternalImages(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
      const isExpired = Date.now() - cacheDate.getTime() > CACHE_CONFIG.images.maxAge;
      
      if (!isExpired) {
        return cachedResponse;
      }
    }
    
    // Fetch avec timeout pour images externes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const networkResponse = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      await cache.put(request, networkResponse.clone());
      await enforceMaxEntries(IMAGE_CACHE, CACHE_CONFIG.images.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ External image fetch failed:', request.url);
    
    // Retourner du cache même expiré
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback: image placeholder
    return generatePlaceholderImage();
  }
}

/**
 * Gestion de la navigation (Network First)
 */
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ Navigation failed, serving from cache');
    
    // Fallback sur index.html pour SPA routing
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Nettoyer les anciens caches
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, API_CACHE, IMAGE_CACHE];
  
  const deletePromises = cacheNames
    .filter(cacheName => !validCaches.includes(cacheName))
    .map(cacheName => {
      console.log('🗑️ Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    });
  
  return Promise.all(deletePromises);
}

/**
 * Limiter le nombre d'entrées dans un cache
 */
async function enforceMaxEntries(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  
  if (requests.length > maxEntries) {
    // Supprimer les plus anciennes (FIFO approximatif)
    const toDelete = requests.slice(0, requests.length - maxEntries);
    await Promise.all(toDelete.map(request => cache.delete(request)));
  }
}

/**
 * Générer une image placeholder en cas d'échec
 */
function generatePlaceholderImage() {
  // SVG placeholder simple
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">
        Image not available
      </text>
    </svg>
  `;
  
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  
  return new Response(blob, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

/**
 * Gestion des messages du main thread
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage({ type: 'CACHE_INFO', payload: info });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearSpecificCache(payload.cacheName).then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    case 'PRELOAD_RESOURCES':
      preloadResources(payload.urls).then(() => {
        event.ports[0].postMessage({ type: 'RESOURCES_PRELOADED' });
      });
      break;
  }
});

/**
 * Obtenir des informations sur les caches
 */
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    info[cacheName] = requests.length;
  }
  
  return info;
}

/**
 * Vider un cache spécifique
 */
async function clearSpecificCache(cacheName) {
  return caches.delete(cacheName);
}

/**
 * Précharger des ressources
 */
async function preloadResources(urls) {
  const cache = await caches.open(STATIC_CACHE);
  
  const fetchPromises = urls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.warn('⚠️ Failed to preload:', url);
    }
  });
  
  return Promise.all(fetchPromises);
}

/**
 * Gestion des erreurs globales
 */
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
});

// Log de démarrage
console.log('🔧 Service Worker: Script loaded');