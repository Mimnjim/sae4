import * as THREE from 'three';
import { scene } from './scene.js';
import { config } from './config.js';
import { loadGLTFWithCandidates } from './loader.js';
import { getRandomTrackX } from './road.js';

export const collectibles = [];

// OPTIMISATION : géométrie et matériau partagés entre tous les placeholders
const itemGeometry = new THREE.SphereGeometry(1, 16, 16);
const itemMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

const itemSpacing = (config.roadLength - 220) / Math.max(1, config.itemCount);
for (let i = 0; i < config.itemCount; i++) {
    const item = new THREE.Mesh(itemGeometry, itemMaterial);
    item.position.set(
        getRandomTrackX(),
        1,
        -180 - i * itemSpacing - Math.random() * 40
    );
    item.userData.isPlaceholder = true;
    item.userData.collected = false;
    // Save initial position so we can reset without reloading models
    item.userData.initialPosition = item.position.clone();
    // Make placeholders respond to dynamic lights (player/enemies)
    try { item.layers.enable(1); } catch (e) { }
    scene.add(item);
    collectibles.push(item);
}

export function tryLoadItemModel() {
    const candidates = [
        '/models/motoko_kusanagi.glb',
    ];

    return loadGLTFWithCandidates(candidates)
        .then(({ gltf, path }) => {
            const base = gltf.scene || gltf.scenes?.[0];
            if (!base) { console.warn('GLTF item sans scène :', path); return; }

            const tmpBox = new THREE.Box3().setFromObject(base);
            const tmpSize = new THREE.Vector3();
            tmpBox.getSize(tmpSize);
            const scaleFactor = tmpSize.y > 0.0001 ? 1.2 / tmpSize.y : 1;

            collectibles.forEach((placeholder, idx) => {
                if (!placeholder.userData.isPlaceholder) return;
                const clone = base.clone(true);
                clone.scale.multiplyScalar(scaleFactor);
                const newBox = new THREE.Box3().setFromObject(clone);
                clone.position.copy(placeholder.position);
                clone.position.y -= newBox.min.y;
                clone.userData = clone.userData || {};
                clone.userData.collected = false;
                // preserve initial position for reset logic
                clone.userData.initialPosition = placeholder.userData.initialPosition ? placeholder.userData.initialPosition.clone() : placeholder.position.clone();
                clone.userData.isPlaceholder = false;
                placeholder.visible = false;
                // Ensure clone meshes are lit by dynamic lights only
                try { clone.traverse(n => { if (n.isMesh) n.layers.enable(1); }); } catch (e) { }
                scene.add(clone);
                collectibles[idx] = clone;
            });

            console.log('[ItemModel] Item chargé :', path);
        })
        .catch(() => { });
}
