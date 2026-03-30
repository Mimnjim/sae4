import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

// OPTIMISATION: Cache global pour éviter di recharger les modèles
const _gltfCache = new Map();

export function loadGLTFWithProperPaths(modelUrl) {
    // Retourner depuis le cache si disponible
    if (_gltfCache.has(modelUrl)) {
        return Promise.resolve(_gltfCache.get(modelUrl));
    }

    return new Promise((resolve, reject) => {
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
        loader.load(
            absoluteUrl,
            gltf => {
                // Mettre le modèle en cache
                _gltfCache.set(modelUrl, gltf);
                resolve(gltf);
            },
            undefined,
            error => {
                console.error('[gltfLoader] Failed to load model:', modelUrl, error);
                reject(error);
            }
        );
    });
}
