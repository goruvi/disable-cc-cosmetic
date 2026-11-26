self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of all){
      if ('focus' in client){ await client.focus(); return; }
    }
    await self.clients.openWindow('./');
  })());
});

// Ready for real Web Push later (a server sending the notification even when the site is closed).
self.addEventListener('push', event => {
  let data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){}
  event.waitUntil(self.registration.showNotification(data.title || 'Disable Cubecraft Cosmetic', {
    body: data.body || 'A new version is available.',
    icon: 'pack_icon.png',
    badge: 'pack_icon.png',
    tag: 'dcc-update'
  }));
});
