import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

// OPTIMISATION: Cache global pour éviter de recharger les modèles
// Mais clone les objets 3D car ils ne peuvent être attachés qu'à une seule scène
const _gltfCache = new Map();
let _dracoLoader = null;

// IndexedDB pour persister les modèles entre sessions
const DB_NAME = 'GltfModelCache';
const DB_VERSION = 1;
const STORE_NAME = 'models';
let _db = null;

function getDracoLoader() {
    if (!_dracoLoader) {
        _dracoLoader = new DRACOLoader();
        // Pointer vers le répertoire des workers DRACOLoader du CDN ou local
        _dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/');
    }
    return _dracoLoader;
}

// Initialiser IndexedDB
function initDB() {
    if (_db) return Promise.resolve(_db);

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'url' });
            }
        };

        request.onsuccess = () => {
            _db = request.result;
            resolve(_db);
        };
    });
}

// Charger un modèle depuis IndexedDB
function loadFromIndexedDB(modelUrl) {
    if (!_db && !indexedDB) return Promise.resolve(null);

    return initDB().then(db => {
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(modelUrl);

                request.onerror = () => resolve(null);
                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        console.log(`[gltfLoader] Modèle chargé depuis cache IndexedDB: ${modelUrl}`);
                        resolve(result.gltf);
                    } else {
                        resolve(null);
                    }
                };
            } catch (err) {
                console.warn('[gltfLoader] Erreur IndexedDB (lecture):', err);
                resolve(null);
            }
        });
    }).catch(() => null);
}

// Sauvegarder un modèle dans IndexedDB
function saveToIndexedDB(modelUrl, gltf) {
    if (!_db && !indexedDB) return Promise.resolve();

    return initDB().then(db => {
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ url: modelUrl, gltf, timestamp: Date.now() });

                request.onerror = () => {
                    console.warn('[gltfLoader] Erreur IndexedDB (écriture)', request.error);
                    resolve();
                };
                request.onsuccess = () => {
                    console.log(`[gltfLoader] Modèle sauvegardé dans cache IndexedDB: ${modelUrl}`);
                    resolve();
                };
            } catch (err) {
                console.warn('[gltfLoader] Erreur IndexedDB (écriture):', err);
                resolve();
            }
        });
    }).catch(() => Promise.resolve());
}

function cloneGLTF(gltf) {
  // Cloner la scène pour pouvoir la réutiliser dans plusieurs endroits
  return {
    ...gltf,
    scene: gltf.scene.clone(true) // true = clone récursif (avec tous les enfants)
  };
}

export function loadGLTFWithProperPaths(modelUrl, options = {}) {
    const { useCache = true, dracoSupport = true, timeout = 15000 } = options;
    
    // 1. Retourner depuis le cache en mémoire si disponible
    if (useCache && _gltfCache.has(modelUrl)) {
        console.log(`[gltfLoader] Modèle chargé depuis cache mémoire: ${modelUrl}`);
        return Promise.resolve(cloneGLTF(_gltfCache.get(modelUrl)));
    }

    // 2. Vérifier IndexedDB avant de charger depuis le réseau
    if (useCache) {
        return loadFromIndexedDB(modelUrl).then(cachedGltf => {
            if (cachedGltf) {
                // Charger depuis IndexedDB
                _gltfCache.set(modelUrl, cachedGltf);
                return cloneGLTF(cachedGltf);
            }

            // 3. Pas en cache, charger depuis le réseau
            return loadFromNetwork(modelUrl, dracoSupport, timeout);
        });
    } else {
        // Mode sans cache, charger directement depuis le réseau
        return loadFromNetwork(modelUrl, dracoSupport, timeout);
    }
}

function loadFromNetwork(modelUrl, dracoSupport, timeout) {
    return new Promise((resolve, reject) => {
        let timeoutId = null;
        let isResolved = false;

        // Timeout
        timeoutId = setTimeout(() => {
            if (!isResolved) {
                isResolved = true;
                console.warn(`[gltfLoader] Timeout loading model: ${modelUrl}`);
                reject(new Error(`Model load timeout after ${timeout}ms: ${modelUrl}`));
            }
        }, timeout);

        const absoluteUrl = new URL(modelUrl, window.location.href).href;
        const basePath = absoluteUrl.replace(/[^/]*$/, '');
        
        const manager = new THREE.LoadingManager();
        manager.setURLModifier(requestUrl => {
            if (/^(https?:)?\/\//i.test(requestUrl) || requestUrl.startsWith('data:') || requestUrl.startsWith('/')) {
                return requestUrl;
            }
            
            try {
                return new URL(requestUrl, basePath).href;
            } catch {
                return basePath + requestUrl;
            }
        });
        
        const loader = new GLTFLoader(manager);
        
        // Ajouter support DRACO compression si disponible
        if (dracoSupport) {
            try {
                loader.setDRACOLoader(getDracoLoader());
            } catch (e) {
                console.warn('[gltfLoader] DRACO support not available:', e);
            }
        }
        
        loader.load(
            absoluteUrl,
            gltf => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    // Mettre en cache mémoire
                    _gltfCache.set(modelUrl, gltf);
                    // Sauvegarder dans IndexedDB pour les prochaines sessions
                    saveToIndexedDB(modelUrl, gltf).catch(() => {});
                    // Retourner une copie clonée
                    resolve(cloneGLTF(gltf));
                }
            },
            undefined,
            error => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    console.error('[gltfLoader] Failed to load model:', modelUrl, error);
                    reject(error);
                }
            }
        );
    });
}
