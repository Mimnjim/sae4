import * as THREE from 'three';
import { scene } from './scene.js';
import { config } from './config.js';
import { loadGLTFWithCandidates } from './loader.js';

export const roadGeometry = new THREE.PlaneGeometry(60, config.roadLength);
export const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
export const road         = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x  = -Math.PI / 2;
road.position.z  = -config.roadLength / 2;
scene.add(road);

const roadHalfWidth    = roadGeometry.parameters.width / 2;
const SIDE_MARGIN      = 1.5;
const ACTOR_WIDTH      = 2;
export const TRACK_MIN_X = -roadHalfWidth + SIDE_MARGIN + ACTOR_WIDTH;
export const TRACK_MAX_X =  roadHalfWidth - SIDE_MARGIN - ACTOR_WIDTH;

export function getRandomTrackX() {
    return Math.random() * (TRACK_MAX_X - TRACK_MIN_X) + TRACK_MIN_X;
}

export const edgeGeometry = new THREE.BoxGeometry(1.2, 1.5, config.roadLength);
export const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
export const leftEdge     = new THREE.Mesh(edgeGeometry, edgeMaterial);
export const rightEdge    = new THREE.Mesh(edgeGeometry, edgeMaterial);
leftEdge.position.set( -roadHalfWidth + 0.6, 0.75, -config.roadLength / 2);
rightEdge.position.set( roadHalfWidth - 0.6, 0.75, -config.roadLength / 2);
scene.add(leftEdge, rightEdge);

const BUILDING_HEIGHT  = 180;
const BUILDING_WIDTH   = 140;
export const BUILDING_DEPTH   = 220; // Exporté pour l'utiliser dans main.js
const BUILDING_EXTEND  = Math.round(config.roadLength * 0.6);
const FAKE_ROAD_LENGTH = BUILDING_EXTEND;

export let fakeRoadMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
let fakeRoadMesh = null;

function createFakeRoadAndEdges() {
    try {
        fakeRoadMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(roadGeometry.parameters.width, FAKE_ROAD_LENGTH),
            fakeRoadMaterial
        );
        fakeRoadMesh.rotation.x = -Math.PI / 2;
        fakeRoadMesh.position.z = -config.roadLength - FAKE_ROAD_LENGTH / 2;
        scene.add(fakeRoadMesh);

        const edgeGeomFake = new THREE.BoxGeometry(edgeGeometry.parameters.width, edgeGeometry.parameters.height, FAKE_ROAD_LENGTH);
        const fakeLeft  = new THREE.Mesh(edgeGeomFake, edgeMaterial);
        const fakeRight = new THREE.Mesh(edgeGeomFake, edgeMaterial);
        fakeLeft.position.set( leftEdge.position.x,  leftEdge.position.y,  fakeRoadMesh.position.z);
        fakeRight.position.set(rightEdge.position.x, rightEdge.position.y, fakeRoadMesh.position.z);
        scene.add(fakeLeft, fakeRight);
    } catch (e) {
        console.warn('[FakeRoad] Impossible de créer le faux tronçon :', e);
    }
}

createFakeRoadAndEdges();

new THREE.TextureLoader().load(
    '/texture_sol.jpg',
    texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 10);
        roadMaterial.map = fakeRoadMaterial.map = texture;
        roadMaterial.color.set(0xffffff);
        roadMaterial.needsUpdate = fakeRoadMaterial.needsUpdate = true;
    },
    undefined,
    () => console.warn('Texture de route non chargée, couleur par défaut utilisée')
);

const buildingVariantDirs = ['building1.1', 'building1.3', 'building1.4', 'building2.1'];
const buildingPrefabs     = [];
const buildingMaterials   = [];

const _sharedBuildingGeom    = new THREE.BoxGeometry(BUILDING_WIDTH, BUILDING_HEIGHT, BUILDING_DEPTH);
const _sharedPlainBuildingMat = new THREE.MeshBasicMaterial({ color: 0x666666 });

function createBuildingMesh(material, side) {
    const mat = material || _sharedPlainBuildingMat;
    const mesh = new THREE.Mesh(_sharedBuildingGeom, mat);
    mesh.castShadow = mesh.receiveShadow = false;
    mesh.rotation.y = side === -1 ? Math.PI : 0;
    mesh.position.y = BUILDING_HEIGHT / 2;
    return mesh;
}

// OPTIMISATION : Object Pooling pour les bâtiments
export const activeBuildings = [];
export const NUM_BUILDINGS_PER_SIDE = 6;
export const BUILDING_SPAN = NUM_BUILDINGS_PER_SIDE * BUILDING_DEPTH;

function placeBuildings() {
    const edgeHalf   = edgeGeometry.parameters.width / 2;
    const leftOuterX  = leftEdge.position.x  - edgeHalf - BUILDING_WIDTH / 2;
    const rightOuterX = rightEdge.position.x + edgeHalf + BUILDING_WIDTH / 2;

    // On crée seulement 6 bâtiments par côté, qui tourneront en boucle
    for (let i = 0; i < NUM_BUILDINGS_PER_SIDE; i++) {
        const z = -10 - i * BUILDING_DEPTH;
        
        // Bâtiment gauche
        const matL = buildingMaterials.length ? buildingMaterials[i % buildingMaterials.length] : _sharedPlainBuildingMat;
        const meshL = createBuildingMesh(matL, -1);
        meshL.position.set(leftOuterX, meshL.position.y, z);
        meshL.userData.initialZ = z; // Sauvegardé pour le reset
        meshL.userData.side = 'left';
        scene.add(meshL);
        activeBuildings.push(meshL);

        // Bâtiment droit
        const matR = buildingMaterials.length ? buildingMaterials[(i + 1) % buildingMaterials.length] : _sharedPlainBuildingMat;
        const meshR = createBuildingMesh(matR, 1);
        meshR.position.set(rightOuterX, meshR.position.y, z);
        meshR.userData.initialZ = z; // Sauvegardé pour le reset
        meshR.userData.side = 'right';
        scene.add(meshR);
        activeBuildings.push(meshR);
    }
}

// Recycle buildings that are behind the player by moving them further ahead.
// This keeps a constant number of buildings while the player advances.
export function recycleBuildings(playerZ) {
    if (!activeBuildings || activeBuildings.length === 0) return;
    const DESPAWN_MARGIN = Math.max(40, Math.round(BUILDING_DEPTH * 0.5));

    const sides = ['left', 'right'];
    for (const side of sides) {
        const sideBuildings = activeBuildings.filter(b => b.userData && b.userData.side === side);
        if (sideBuildings.length === 0) continue;

        // Find the most negative Z (farthest ahead)
        let minZ = Math.min(...sideBuildings.map(b => b.position.z));

        // Process buildings that are behind the player first (highest z)
        sideBuildings.sort((a, b) => b.position.z - a.position.z);
        for (const bld of sideBuildings) {
            if (bld.position.z > playerZ + DESPAWN_MARGIN) {
                const jitter = (Math.random() - 0.5) * 20; // small randomness
                const newZ = minZ - BUILDING_DEPTH + jitter;
                bld.position.z = newZ;
                // update minZ for next placement
                minZ = newZ;
            }
        }
    }
}

export function resetBuildings() {
    if (!activeBuildings || activeBuildings.length === 0) return;
    for (const bld of activeBuildings) {
        if (bld.userData && typeof bld.userData.initialZ === 'number') {
            bld.position.z = bld.userData.initialZ;
        }
    }
}

export function tryLoadBuildingPrefabs() {
    const promises = buildingVariantDirs.map(name => {
        // OPTIMISATION: Réduire les chemins - garder seulement le chemin production
        const candidates = [
            `game/assets/buildings/${name}/Project Name.gltf`,
            `/game/assets/buildings/${name}/Project Name.gltf`,
        ];
        return loadGLTFWithCandidates(candidates)
            .then(({ gltf }) => {
                const base = gltf.scene || gltf.scenes?.[0];
                let foundTexture = null;
                if (base) {
                    base.traverse(n => {
                        if (!n.isMesh || !n.material || foundTexture) return;
                        const mats = Array.isArray(n.material) ? n.material : [n.material];
                        for (const m of mats) { if (m?.map) { foundTexture = m.map; break; } }
                    });
                }
                buildingPrefabs.push({ texture: foundTexture, name });
            })
            .catch(err => {
                console.warn('[Buildings] Impossible de charger', name, err);
                buildingPrefabs.push({ texture: null, name });
            });
    });

    return Promise.all(promises).then(() => {
        const repeatX = Math.max(1, Math.round(BUILDING_WIDTH / 20));
        const repeatY = Math.max(1, Math.round(BUILDING_HEIGHT / 20));
        buildingMaterials.length = 0;
        if (buildingPrefabs.length === 0) {
            buildingMaterials.push(_sharedPlainBuildingMat);
        } else {
            for (const pref of buildingPrefabs) {
                if (pref.texture) {
                    try {
                        pref.texture.wrapS = pref.texture.wrapT = THREE.RepeatWrapping;
                        if ('colorSpace' in pref.texture) pref.texture.colorSpace = THREE.SRGBColorSpace;
                        else if ('encoding' in pref.texture) pref.texture.encoding = THREE.sRGBEncoding;
                        pref.texture.repeat.set(repeatX, repeatY);
                    } catch (e) {}
                    buildingMaterials.push(new THREE.MeshBasicMaterial({ map: pref.texture }));
                } else {
                    buildingMaterials.push(_sharedPlainBuildingMat);
                }
            }
        }
        placeBuildings();
    });
}