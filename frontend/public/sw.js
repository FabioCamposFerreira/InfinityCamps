/*
 * Service worker desativado.
 * A versão anterior fazia cache-first de páginas .html e scripts que não existem mais,
 * o que servia telas velhas e falhava na instalação. Este arquivo apenas limpa os caches
 * antigos e se desregistra; navegadores que ainda o têm instalado se limpam sozinhos.
 */
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((key) => key.startsWith('infinitycamps-')).map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })(),
  )
})
