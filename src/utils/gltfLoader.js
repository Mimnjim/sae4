import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

// OPTIMISATION: Cache global pour éviter de recharger les modèles
// Mais clone les objets 3D car ils ne peuvent être attachés qu'à une seule scène
const _gltfCache = new Map();
let _dracoLoader = null;

function getDracoLoader() {
    if (!_dracoLoader) {
        _dracoLoader = new DRACOLoader();
        // Pointer vers le répertoire des workers DRACOLoader du CDN ou local
        _dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/');
    }
    return _dracoLoader;
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
    
    // Retourner depuis le cache si disponible
    if (useCache && _gltfCache.has(modelUrl)) {
        return Promise.resolve(cloneGLTF(_gltfCache.get(modelUrl)));
    }

    return new Promise((resolve, reject) => {
        let timeoutId = null;
        let isResolved = false;

        // Timeout de 15 secondes par défaut
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
                    // Mettre le modèle en cache (garder l'original)
                    if (useCache) {
                        _gltfCache.set(modelUrl, gltf);
                    }
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
