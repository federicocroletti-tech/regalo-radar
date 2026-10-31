const CACHE_NAME = 'regalo-radar-shell-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shellUrl = new URL('./', self.registration.scope);
      const response = await fetch(shellUrl);
      if (!response.ok) {
        throw new Error(`Unable to cache the app shell: ${response.status}`);
      }

      const html = await response.clone().text();
      const assetPaths = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(
        (match) => new URL(match[1], shellUrl).href,
      );
      const cache = await caches.open(CACHE_NAME);
      await cache.put(shellUrl, response.clone());
      await Promise.all(
        assetPaths.map(async (assetUrl) => {
          const asset = await fetch(assetUrl);
          if (!asset.ok) {
            throw new Error(`Unable to cache app asset: ${assetUrl}`);
          }
          await cache.put(assetUrl, asset);
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('regalo-radar-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (
    request.method !== 'GET' ||
    requestUrl.origin !== scopeUrl.origin ||
    !requestUrl.pathname.startsWith(scopeUrl.pathname)
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const shell = await cache.match(scopeUrl);
        if (!shell) {
          throw new Error('The saved app shell is unavailable offline.');
        }
        return shell;
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request);
    }),
  );
});
