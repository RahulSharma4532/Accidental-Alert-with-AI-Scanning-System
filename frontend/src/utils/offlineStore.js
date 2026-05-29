import { openDB } from 'idb';

const DB_NAME = 'AccidentAlert_Offline_DB';
const STORE_NAME = 'pending_reports';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const offlineStore = {
  /**
   * Save an accident report locally when offline
   */
  async saveReport(reportData) {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Convert files to base64 or blobs for storage if needed
    // For this demo, we assume the reportData contains serializable info
    await store.add({
      ...reportData,
      savedAt: new Date().toISOString(),
      status: 'pending_sync'
    });
    
    return tx.done;
  },

  /**
   * Get all reports waiting for sync
   */
  async getPendingReports() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  /**
   * Remove a report after successful sync
   */
  async removeReport(id) {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.delete(id);
    return tx.done;
  },

  /**
   * Count pending reports
   */
  async getPendingCount() {
    const db = await dbPromise;
    return db.count(STORE_NAME);
  }
};
