import * as THREE from 'three';
import { scene } from './scene.js';
import { config, difficulty } from './config.js';
import { loadGLTFWithCandidates } from './loader.js';
import { getRandomTrackX } from './road.js';

export const enemies = [];

// Crée les racines des ennemis et les place sur la route
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
        // OPTIMISATION : liste des mesh nodes cachée au chargement
        // → plus de visual.traverse() dans la boucle principale
        meshNodes: [],
        // store initial position to allow restart without reloading
        initialPosition: enemyRoot.position.clone(),
    });
}

export function tryLoadEnemyModel() {
    const candidates = [
        'assets/models/camion.gltf',         'assets/models/camion/camion.gltf',
        'assets/models/camion.glb',          'assets/models/camion/camion.glb',
        '/game/assets/models/camion.gltf',   '/game/assets/models/camion/camion.gltf',
        '/game/assets/models/camion.glb',    '/game/assets/models/camion/camion.glb',
        'game/assets/models/camion.gltf',    'game/assets/models/camion/camion.gltf',
        'game/assets/models/camion.glb',     'game/assets/models/camion/camion.glb',
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

                // OPTIMISATION : on collecte les mesh nodes une seule fois ici
                // au lieu de refaire un traverse() à chaque frame dans handleEnemies
                clone.traverse(node => {
                    if (node.isMesh && node.material) {
                        node.material.transparent = true;
                        entry.meshNodes.push(node);
                    }
                });
            });

            console.log('[EnemyModel] Camion chargé :', path);
        })
        .catch(err => { console.warn('[EnemyModel] Aucun modèle camion trouvé', err); });
}
