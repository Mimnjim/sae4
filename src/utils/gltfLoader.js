import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function loadGLTFWithProperPaths(modelUrl) {
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
            gltf => resolve(gltf),
            undefined,
            error => {
                console.error('[gltfLoader] Failed to load model:', modelUrl, error);
                reject(error);
            }
        );
    });
}
