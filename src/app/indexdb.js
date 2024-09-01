// lib/indexedDB.js

export const openDatabase = () => {
    return new Promise((resolve, reject) => {
      // Open (or create) the database
      const request = indexedDB.open('audioDB', 1);
  
      // This event is triggered if the database is being created or if the version number is higher than the existing database
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
  
        // Create an object store for audio files if it doesn't exist
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id', autoIncrement: true });
          console.log('Object store "audioFiles" created.');
        }
      };
  
      // Success handler for opening the database
      request.onsuccess = (event) => {
        console.log('Database opened successfully.');
        resolve(event.target.result);
      };
  
      // Error handler for opening the database
      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
        reject('Error opening IndexedDB');
      };
    });
  };
  
  export const saveAudioToDb = async (audioBlob) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction('audioFiles', 'readwrite');
      const objectStore = transaction.objectStore('audioFiles');
  
      const request = objectStore.add({ audioBlob });
  
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };
  
        request.onerror = () => {
          reject('Error saving audio file');
        };
      });
    } catch (error) {
      console.error('Error in saveAudioToDb:', error);
      throw error;
    }
  };
  
  export const getAllAudioFiles = async () => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction('audioFiles', 'readonly'); // Ensure the object store name matches exactly
      const objectStore = transaction.objectStore('audioFiles');
  
      const getAllRequest = objectStore.getAll();
  
      return new Promise((resolve, reject) => {
        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result);
        };
  
        getAllRequest.onerror = () => {
          reject('Error retrieving audio files');
        };
      });
    } catch (error) {
      console.error('Error in getAllAudioFiles:', error);
      throw error;
    }
  };
  