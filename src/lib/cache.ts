const DB_NAME = "nabız-cache";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("feed")) {
        db.createObjectStore("feed", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("preferences")) {
        db.createObjectStore("preferences", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("offline-queue")) {
        const store = db.createObjectStore("offline-queue", { keyPath: "id", autoIncrement: true });
        store.createIndex("createdAt", "createdAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbGet<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut<T>(storeName: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(value);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function dbDelete(storeName: string, key: IDBValidKey): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export interface FeedItem {
  id: string;
  userId: string;
  mood: string;
  message: string;
  circle: string;
  createdAt: string;
}

export const feedCache = {
  async get(id: string): Promise<FeedItem | undefined> {
    const item = await dbGet<FeedItem & { cachedAt: number }>("feed", id);
    if (!item) return undefined;
    if (Date.now() - item.cachedAt > TWENTY_FOUR_HOURS) {
      await dbDelete("feed", id);
      return undefined;
    }
    return item;
  },

  async set(item: FeedItem): Promise<void> {
    await dbPut("feed", { ...item, cachedAt: Date.now() });
  },

  async getAll(): Promise<FeedItem[]> {
    const items = await dbGetAll<FeedItem & { cachedAt: number }>("feed");
    const now = Date.now();
    const fresh = items.filter((i) => now - i.cachedAt <= TWENTY_FOUR_HOURS);
    return fresh.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async clear(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("feed", "readwrite");
      tx.objectStore("feed").clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
};

export interface UserPreferences {
  key: string;
  value: unknown;
}

export const preferencesCache = {
  async get<T>(key: string): Promise<T | undefined> {
    const item = await dbGet<UserPreferences & { value: T }>("preferences", key);
    return item?.value;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await dbPut("preferences", { key, value });
  },

  async remove(key: string): Promise<void> {
    await dbDelete("preferences", key);
  },
};

export interface PendingOperation {
  id?: number;
  type: string;
  payload: unknown;
  createdAt: number;
  retries: number;
}

const MAX_RETRIES = 5;

export const offlineQueue = {
  async add(type: string, payload: unknown): Promise<void> {
    await dbPut("offline-queue", {
      type,
      payload,
      createdAt: Date.now(),
      retries: 0,
    });
  },

  async getAll(): Promise<PendingOperation[]> {
    return dbGetAll<PendingOperation>("offline-queue");
  },

  async remove(id: number): Promise<void> {
    await dbDelete("offline-queue", id);
  },

  async process(handler: (op: PendingOperation) => Promise<boolean>): Promise<void> {
    const ops = await this.getAll();
    for (const op of ops) {
      try {
        const success = await handler(op);
        if (success && op.id != null) {
          await this.remove(op.id);
        } else if (op.retries < MAX_RETRIES) {
          await dbPut("offline-queue", { ...op, retries: op.retries + 1 });
        } else if (op.id != null) {
          await this.remove(op.id);
        }
      } catch {
        if (op.retries < MAX_RETRIES) {
          await dbPut("offline-queue", { ...op, retries: op.retries + 1 });
        }
      }
    }
  },

  async count(): Promise<number> {
    const ops = await this.getAll();
    return ops.length;
  },
};
