// / <reference no-default-lib="true"/>
// / <reference lib="esnext" />
// / <reference lib="webworker" />

import { debug } from "debug";

debug.enable("app:*");
const log = debug("app:ServiceWorker");

// import { logger } from "@/logger";
// import { ServiceWorkerGlobalScope } from "../webworker";
// import objectHash from "object-hash";
// import uniq from "lodash.uniq";
// import { environment, Environment } from "@/config";

// import { receiveMessage } from "../messaging/receiveMessageFromMain";

// declare const self: ServiceWorkerGlobalScope;
// declare const serviceWorkerOption: { assets: string };

// const assetsToCache = uniq([...serviceWorkerOption.assets, "/favicon.ico"]).map(
//   (path) => new URL(path, location.origin).href,
// );

// const cacheName = objectHash.sha1(assetsToCache);

// receiveMessage(async (payload) => {
//   // console.log("Called receiveMessage callback", asdf);
//   // return {
//   //   messageFromWorker: "hello",
//   // };
//   return {
//     type: "pingResponse",
//   };
// });

// self.addEventListener("message", async (event) => {
//   const clients = await self.clients.matchAll();
//   logger.debug("received message from main thread", clients.length);
//   clients.forEach((client, idx) => {
//     logger.debug("sending message to client", idx);
//     client.postMessage({
//       msg: "Hello from web worker",
//     });
//   });
// });

// self.addEventListener("install", (event) => {
//   logger.debug("install event fired");
//   event.waitUntil(
//     (async () => {
//       const cache = await self.caches.open(cacheName);
//       await cache.addAll(assetsToCache);
//       logger.log("cached", assetsToCache.length, "files as", cacheName);
//       self.skipWaiting();
//     })(),
//   );
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     (async () => {
//       const cacheNames = await self.caches.keys();
//       await Promise.all(
//         cacheNames
//           .filter((c) => c !== cacheName)
//           .map((c) => self.caches.delete(c)),
//       );

//       await self.clients.claim();
//       const clientList = await self.clients.matchAll({
//         includeUncontrolled: true,
//       });
//       logger.log("matching", clientList.length, "clients");
//     })(),
//   );
// });

// self.addEventListener("fetch", (event) => {
//   if (environment === Environment.dev) {
//     return;
//   }
//   const requestUrl = new URL(event.request.url);
//   // https://github.com/meanbee/magento-meanbee-pwa/issues/20#issuecomment-378223813
//   if (
//     event.request.cache === "only-if-cached" &&
//     event.request.mode !== "same-origin"
//   ) {
//     return;
//   }
//   if (
//     // TODO: test if this works
//     event.request.mode === "navigate" ||
//     (event.request.method === "GET" &&
//       (event.request.headers.get("accept") || "").includes("text/html"))
//     // && self.location.origin === requestUrl.origin
//   ) {
//     return event.respondWith(
//       (async () => {
//         let response = await caches.match(event.request);
//         if (!response && event.request.mode === "navigate") {
//           response =
//             (await caches.match("/index.html")) || (await caches.match("/"));
//         }
//         if (response) {
//           return response;
//         }

//         logger.debug(
//           "response not cached",
//           requestUrl.href,
//           event.request.mode,
//         );
//         return fetch(event.request);
//       })(),
//     );
//     // TODO: https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker#generic_fallback
//   }
//   logger.debug("ignoring request", requestUrl.href);
// });

// self.addEventListener("push", (event) => {
//   logger.log("received push message:", event.data && event.data.text());
// });

log("service worker started");
