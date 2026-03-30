import * as THREE from 'three';
import { scene } from './scene.js';
import { config, difficulty } from './config.js';
import { gameState, playerRef, getEl } from './state.js';
import { loadGLTFWithCandidates } from './loader.js';
import { cameraOffset } from './physics.js';
// Note: we enable the dynamic light layer (1) on player meshes so dynamic lights only affect player

export const PLAYER_START_Z = 20;

function applyModelTextureSettings(root) {
    if (!root) return;
    root.traverse(node => {
        if (!node.isMesh) return;
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach(mat => {
            if (!mat) return;
            ['map', 'emissiveMap', 'roughnessMap', 'metalnessMap', 'normalMap', 'aoMap', 'alphaMap'].forEach(k => {
                const tex = mat[k];
                if (!tex) return;
                try {
                    if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
                    else if ('encoding' in tex) tex.encoding = THREE.sRGBEncoding;
                    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                    tex.needsUpdate = true;
                } catch (e) { }
            });
            try {
                mat.needsUpdate = true;
                if (mat.isMeshStandardMaterial) {
                    if (typeof mat.roughness === 'undefined') mat.roughness = 0.6;
                    if (typeof mat.metalness === 'undefined') mat.metalness = 0.0;
                }
            } catch (e) { }
            node.castShadow = node.receiveShadow = true;
        });
    });
}

function onPlayerReady() {
    gameState.isReady = true;
    const loadingScreen = getEl('loading-message');
    if (loadingScreen) loadingScreen.style.display = 'none';
}

function setupPlayerFromScene(sceneObj) {
    playerRef.bike = sceneObj;

    if (difficulty === 2) {
        playerRef.bike.position.set(0, 0, 0);
        playerRef.bike.rotation.set(0, 0, 0);
        playerRef.bike.scale.set(1, 1, 1);

        const bbox = new THREE.Box3().setFromObject(playerRef.bike);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        const factor = size.y > 0.001 ? (4.0 / size.y) * 1.5 : 0.6;
        playerRef.bike.scale.setScalar(factor);

        const bbox2 = new THREE.Box3().setFromObject(playerRef.bike);
        playerRef.bike.position.set(0, 1.5 - bbox2.min.y, PLAYER_START_Z);
        playerRef.bike.rotation.y = 11 + Math.PI / 2;

        try { applyModelTextureSettings(playerRef.bike); } catch (e) { }

        // Enable dynamic light layer on all mesh nodes so dynamic lights affect the player only
        try {
            playerRef.bike.traverse(n => { if (n.isMesh) n.layers.enable(1); });
        } catch (e) { }

        // Raise camera for difficulty 2 for better overview
        cameraOffset.default.set(0, 12, 36);
        cameraOffset.boost.set(0, 18, 46);
        cameraOffset.brake.set(0, 6, 16);
        cameraOffset.current.copy(cameraOffset.default);
        cameraOffset.target.copy(cameraOffset.default);
    } else {
        playerRef.bike.scale.set(4, 4, 4);
        playerRef.bike.position.set(0, 11, PLAYER_START_Z);
        playerRef.bike.rotation.y = 11;
    }

    scene.add(playerRef.bike);
    onPlayerReady();
}

function fallbackToCube() {
    if (gameState.isReady) return;
    const size = difficulty === 2 ? 6 : 4;
    const posY = difficulty === 2 ? 7 : 5;
    playerRef.bike = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshPhongMaterial({ color: 0x00ffff })
    );
    playerRef.bike.position.set(0, posY, PLAYER_START_Z);
    // Ensure fallback cube is visible to dynamic lights
    if (playerRef.bike.layers) playerRef.bike.layers.enable(1);
    scene.add(playerRef.bike);
    console.warn('Fallback cube utilisé pour le joueur');
    onPlayerReady();
}

export function createPlayer() {
    // OPTIMISATION: Garder seulement les chemins de production (/game/assets/...)
    // Supprimer les chemins locaux/fallback qui ajoutent du temps inutile
    const carCandidates = [
        '/game/assets/models/voiture.glb',
        '/game/assets/models/voiture/voiture.glb',
        'game/assets/models/voiture.glb',
        'game/assets/models/voiture/voiture.glb',
    ];
    const bikeCandidates = [
        '/game/assets/models/akira_bike.glb',
        '/game/assets/models/akira_bike.gltf',
        'game/assets/models/akira_bike.glb',
        'game/assets/models/akira_bike.gltf',
    ];
    return new Promise(resolve => {
        let finished = false;
        const finish = () => { if (finished) return; finished = true; resolve(); };

        loadGLTFWithCandidates(difficulty === 2 ? carCandidates : bikeCandidates)
            .then(({ gltf, path }) => {
                const obj = gltf.scene || gltf.scenes?.[0];
                if (obj) { console.log('Modèle joueur chargé :', path); setupPlayerFromScene(obj); }
                else { console.warn('GLTF sans scène :', path); fallbackToCube(); }
                finish();
            })
            .catch(() => { fallbackToCube(); finish(); });

        // safety fallback if loader hangs
        setTimeout(() => { if (!gameState.isReady) { fallbackToCube(); finish(); } }, 2500);
    });
}
