import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const _gltfCache = new Map();
const _loadingPromises = new Map();

function _toAbsUrl(path) {
    try { return new URL(path, window.location.href).href; }
    catch { return path; }
}

export function clearGLTFCache() {
    _gltfCache.clear();
    _loadingPromises.clear();
}

export function loadGLTFWithCandidates(paths) {
    const candidates = Array.from(new Set(paths.map(_toAbsUrl)));

    for (const url of candidates) {
        if (_gltfCache.has(url)) {
            return Promise.resolve({ gltf: _gltfCache.get(url), path: url });
        }
    }

    const promises = candidates.map(url => {
        if (_loadingPromises.has(url)) return _loadingPromises.get(url);

        const urlObj = new URL(url, window.location.href);
        const basePath = urlObj.href.replace(/[^/]*$/, '');
        
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

        const p = new Promise((resolve, reject) => {
            new GLTFLoader(manager).load(
                url,
                gltf => {
                    _gltfCache.set(url, gltf);
                    _loadingPromises.delete(url);
                    resolve({ gltf, path: url });
                },
                undefined,
                err => {
                    _loadingPromises.delete(url);
                    reject(err);
                }
            );
        });
        _loadingPromises.set(url, p);
        return p;
    });

    return Promise.any(promises).catch(() => { throw new Error('Aucun modèle trouvé parmi les candidats'); });
}
