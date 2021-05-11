/// <reference lib="webworker" />
import objectHash from "object-hash";
import { uniq } from "lodash";

declare const self: ServiceWorkerGlobalScope;
declare const serviceWorkerOption: any;

const assetsToCache = uniq([...serviceWorkerOption.assets, "/favicon.ico"]).map(
  (path) => new URL(path, location.origin).href,
);

const cacheName = `material-e621-cache-${objectHash.sha1(assetsToCache)}`;

self.addEventListener("install", (event) => {
  console.log("caching assets");
  event.waitUntil(
    (async () => {
      const cache = await self.caches.open(cacheName);
      await cache.addAll(assetsToCache);
      console.log(`cached ${assetsToCache.length} files as ${cacheName}`);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await self.caches.keys();
      for (const c of cacheNames) {
        if (c === cacheName) continue;
        console.log(`deleting cache ${c}`);
        await self.caches.delete(c);
      }

      await self.clients.claim();
      const clientList = await self.clients.matchAll({
        includeUncontrolled: true,
      });
      console.log(`claimed ${clientList.length} clients`);
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) {
        return cached;
      }
      return fetch(event.request);
    })(),
  );
});

console.log("service worker started");
