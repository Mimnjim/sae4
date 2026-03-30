import * as THREE from 'three';
import { scene } from './scene.js';
import { config, difficulty } from './config.js';
import { loadGLTFWithCandidates } from './loader.js';
import { getRandomTrackX } from './road.js';

export const enemies = [];

const enemySpacing = config.roadLength / Math.max(1, config.maxEnemies);
for (let i = 0; i < config.maxEnemies; i++) {
    const enemyRoot = new THREE.Object3D();
    enemyRoot.position.set(
        getRandomTrackX(),
        2,
        -120 - (i * enemySpacing) - Math.random() * 80
    );
    scene.add(enemyRoot);
    enemies.push({
        root:      enemyRoot,
        visual:    null,
        meshNodes: [],
        initialPosition: enemyRoot.position.clone(),
    });
}

export function tryLoadEnemyModel() {
    // OPTIMISATION: Réduire les chemins à seulement ce qui est nécessaire en production
    const candidates = [
        '/game/assets/models/camion/camion.gltf',
        'game/assets/models/camion/camion.gltf',
        '/game/assets/models/camion.glb',
        'game/assets/models/camion.glb',
    ];

    return loadGLTFWithCandidates(candidates)
        .then(({ gltf, path }) => {
            const base = gltf.scene || gltf.scenes?.[0];
            if (!base) { console.warn('[EnemyModel] GLTF sans scène :', path); return; }

            const tmpBox  = new THREE.Box3().setFromObject(base);
            const tmpSize = new THREE.Vector3();
            tmpBox.getSize(tmpSize);

            const desiredHeight = (config.enemyBaseHeight || 6) + (Math.max(0, (difficulty || 1) - 1) * (config.enemyHeightIncrease || 2));
            const scaleFactor = tmpSize.y > 0.0001 ? (desiredHeight / tmpSize.y) : 1;

            enemies.forEach(entry => {
                const clone = base.clone(true);
                clone.scale.setScalar(scaleFactor);
                const bbox2 = new THREE.Box3().setFromObject(clone);
                clone.position.y -= bbox2.min.y;
                clone.rotation.y  = 11 + Math.PI / 2;
                entry.root.add(clone);
                entry.visual = clone;

                clone.traverse(node => {
                    if (node.isMesh && node.material) {
                        entry.meshNodes.push(node);
                        try { node.layers.enable(1); } catch (e) {}
                    }
                });
            });

            console.log('[EnemyModel] Camion chargé :', path);
        })
        .catch(err => { console.warn('[EnemyModel] Aucun modèle camion trouvé', err); });
}