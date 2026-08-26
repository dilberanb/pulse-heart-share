const CACHE_NAME = "nabız-v1";
const STATIC_CACHE = "nabız-static-v1";
const API_CACHE = "nabız-api-v1";
const OFFLINE_PAGE = "/offline";

const PRECACHE_URLS = ["/", OFFLINE_PAGE];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== STATIC_CACHE && k !== API_CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.pathname.startsWith("/api/") || url.pathname.includes("supabase")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker" ||
    request.destination === "font" ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Çevrimdışı — lütfen internet bağlantınızı kontrol edin.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: "Çevrimdışı" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || caches.match(OFFLINE_PAGE));

  return cached || networkPromise;
}

self.addEventListener("sync", (event) => {
  if (event.tag === "emergency-alert") {
    event.waitUntil(syncEmergencyAlerts());
  }
  if (event.tag === "pending-operations") {
    event.waitUntil(syncPendingOperations());
  }
});

async function syncEmergencyAlerts() {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({ type: "SYNC_EMERGENCY_ALERTS" });
  }
}

async function syncPendingOperations() {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({ type: "SYNC_PENDING_OPERATIONS" });
  }
}

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {
    title: "Nabız",
    body: "Yeni bir bildiriminiz var.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
  };

  const options = {
    body: data.body,
    icon: data.icon ?? "/icons/icon-192x192.png",
    badge: data.badge ?? "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    tag: data.tag ?? "nabız-notification",
    data: { url: data.url ?? "/" },
    actions: [
      { action: "open", title: "Göster" },
      { action: "dismiss", title: "Yok say" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      const url = event.notification.data?.url ?? "/";
      for (const client of clients) {
        if (client.url.includes(self.registration.scope) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
