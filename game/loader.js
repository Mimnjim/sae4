import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Simple in-memory cache to avoid reloading the same GLTF multiple times.
// Keys are absolute URLs to the model file.
const _gltfCache = new Map();         // url -> gltf
const _loadingPromises = new Map();   // url -> Promise resolving to { gltf, path }

function _toAbsUrl(path) {
    try { return new URL(path, window.location.href).href; }
    catch { return path; }
}

export function clearGLTFCache() {
    _gltfCache.clear();
    _loadingPromises.clear();
}

// OPTIMISATION : Promise.any lance tous les chemins en parallèle
// et prend le premier qui répond → x3-x10 plus rapide qu'en séquentiel.
export function loadGLTFWithCandidates(paths) {
    // Normalize and deduplicate candidate absolute URLs
    const candidates = Array.from(new Set(paths.map(_toAbsUrl)));

    // If any candidate is already cached, return it immediately (fast path)
    for (const url of candidates) {
        if (_gltfCache.has(url)) {
            return Promise.resolve({ gltf: _gltfCache.get(url), path: url });
        }
    }

    // Build (or reuse) loader promises for each candidate
    const promises = candidates.map(url => {
        if (_loadingPromises.has(url)) return _loadingPromises.get(url);

        const basePath = url.replace(/[^/]*$/, '');
        const baseAbs  = basePath;
        const manager  = new THREE.LoadingManager();
        manager.setURLModifier(requestUrl => {
            if (/^(https?:)?\/\//i.test(requestUrl) || requestUrl.startsWith('data:') || requestUrl.startsWith('/')) return requestUrl;
            try   { return new URL(requestUrl, baseAbs).href; }
            catch { return baseAbs + requestUrl; }
        });

        const p = new Promise((resolve, reject) => {
            new GLTFLoader(manager).load(
                url,
                gltf => {
                    // Cache the GLTF for future reuse
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
