import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

// OPTIMISATION: Cache global pour éviter de recharger les modèles
// Mais clone les objets 3D car ils ne peuvent être attachés qu'à une seule scène
const _gltfCache = new Map();

function cloneGLTF(gltf) {
  // Cloner la scène pour pouvoir la réutiliser dans plusieurs endroits
  return {
    ...gltf,
    scene: gltf.scene.clone(true) // true = clone récursif (avec tous les enfants)
  };
}

export function loadGLTFWithProperPaths(modelUrl) {
    // Retourner depuis le cache si disponible
    if (_gltfCache.has(modelUrl)) {
        return Promise.resolve(cloneGLTF(_gltfCache.get(modelUrl)));
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
                // Mettre le modèle en cache (garder l'original)
                _gltfCache.set(modelUrl, gltf);
                // Retourner une copie clonée
                resolve(cloneGLTF(gltf));
            },
            undefined,
            error => {
                console.error('[gltfLoader] Failed to load model:', modelUrl, error);
                reject(error);
            }
        );
    });
}
