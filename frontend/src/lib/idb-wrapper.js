// Wrapper mínimo do IndexedDB (sem dependências), usado para progresso offline.
export function openDB(name = 'infinitycamps', version = 1) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress', { keyPath: 'chapter_id' })
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function request(db, store, mode, run) {
  return new Promise((resolve, reject) => {
    const req = run(db.transaction([store], mode).objectStore(store))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveProgress(chapterId, data) {
  const db = await openDB()
  return request(db, 'progress', 'readwrite', (store) => store.put(Object.assign({ chapter_id: chapterId }, data)))
}

export async function getProgress(chapterId) {
  const db = await openDB()
  return request(db, 'progress', 'readonly', (store) => store.get(chapterId))
}

export async function setMeta(key, value) {
  const db = await openDB()
  return request(db, 'meta', 'readwrite', (store) => store.put({ key, value }))
}

export async function getMeta(key) {
  const db = await openDB()
  const row = await request(db, 'meta', 'readonly', (store) => store.get(key))
  return row ? row.value : null
}
