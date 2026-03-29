import * as THREE from 'three';
import { scene } from './scene.js';
import { config } from './config.js';
import { loadGLTFWithCandidates } from './loader.js';

// ── Route principale ──────────────────────────────────────────
export const roadGeometry = new THREE.PlaneGeometry(60, config.roadLength);
export const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
export const road         = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x  = -Math.PI / 2;
road.position.z  = -config.roadLength / 2;
scene.add(road);

// ── Limites de piste ──────────────────────────────────────────
const roadHalfWidth    = roadGeometry.parameters.width / 2;
const SIDE_MARGIN      = 1.5;
const ACTOR_WIDTH      = 2;
export const TRACK_MIN_X = -roadHalfWidth + SIDE_MARGIN + ACTOR_WIDTH;
export const TRACK_MAX_X =  roadHalfWidth - SIDE_MARGIN - ACTOR_WIDTH;

export function getRandomTrackX() {
    return Math.random() * (TRACK_MAX_X - TRACK_MIN_X) + TRACK_MIN_X;
}

// ── Bordures ──────────────────────────────────────────────────
export const edgeGeometry = new THREE.BoxGeometry(1.2, 1.5, config.roadLength);
export const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
export const leftEdge     = new THREE.Mesh(edgeGeometry, edgeMaterial);
export const rightEdge    = new THREE.Mesh(edgeGeometry, edgeMaterial);
leftEdge.position.set( -roadHalfWidth + 0.6, 0.75, -config.roadLength / 2);
rightEdge.position.set( roadHalfWidth - 0.6, 0.75, -config.roadLength / 2);
scene.add(leftEdge, rightEdge);

// ── Prolongation visuelle de la route (non jouable) ───────────
const BUILDING_HEIGHT  = 180;
const BUILDING_WIDTH   = 140;
const BUILDING_DEPTH   = 220;
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

// Texture de route (chargement non-bloquant)
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

// ── Bâtiments ─────────────────────────────────────────────────
const buildingVariantDirs = ['building1.1', 'building1.3', 'building1.4', 'building2.1'];
const buildingPrefabs     = [];

// OPTIMISATION : géométrie et matériau fallback partagés entre tous les bâtiments
const _sharedBuildingGeom    = new THREE.BoxGeometry(BUILDING_WIDTH, BUILDING_HEIGHT, BUILDING_DEPTH);
const _sharedPlainBuildingMat = new THREE.MeshBasicMaterial({ color: 0x666666 });

function createBuildingMesh(prefabDef, side) {
    let mat;
    if (prefabDef?.texture) {
        const tex = prefabDef.texture.clone();
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        try { tex.encoding = THREE.sRGBEncoding; } catch (e) {}
        tex.repeat.set(Math.max(1, Math.round(BUILDING_WIDTH / 20)), Math.max(1, Math.round(BUILDING_HEIGHT / 20)));
        mat = new THREE.MeshBasicMaterial({ map: tex });
    } else {
        mat = _sharedPlainBuildingMat;
    }
    const mesh = new THREE.Mesh(_sharedBuildingGeom, mat);
    mesh.castShadow = mesh.receiveShadow = false;
    mesh.rotation.y = side === -1 ? Math.PI : 0;
    mesh.position.y = BUILDING_HEIGHT / 2;
    return mesh;
}

function placeBuildings() {
    const spacing    = BUILDING_DEPTH;
    const endZ       = -config.roadLength - BUILDING_EXTEND;
    const edgeHalf   = edgeGeometry.parameters.width / 2;
    const leftOuterX  = leftEdge.position.x  - edgeHalf - BUILDING_WIDTH / 2;
    const rightOuterX = rightEdge.position.x + edgeHalf + BUILDING_WIDTH / 2;

    let li = 0, zLeft = -10;
    while (zLeft > endZ) {
        const mesh = createBuildingMesh(buildingPrefabs[li % buildingPrefabs.length] || null, -1);
        mesh.position.set(leftOuterX, mesh.position.y, zLeft);
        scene.add(mesh);
        li++; zLeft -= spacing;
    }

    let ri = 0, zRight = -10;
    while (zRight > endZ) {
        const mesh = createBuildingMesh(buildingPrefabs[ri % buildingPrefabs.length] || null, 1);
        mesh.position.set(rightOuterX, mesh.position.y, zRight);
        scene.add(mesh);
        ri++; zRight -= spacing;
    }
}

export function tryLoadBuildingPrefabs() {
    const promises = buildingVariantDirs.map(name => {
        const candidates = [
            `game/assets/buildings/${name}/Project Name.gltf`,
            `game/assets/buildings/${name}/ProjectName.gltf`,
            `game/assets/buildings/${name}/Project%20Name.gltf`,
            `/game/assets/buildings/${name}/Project Name.gltf`,
            `assets/buildings/${name}/Project Name.gltf`,
            `assets/buildings/${name}/Project%20Name.gltf`,
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
        placeBuildings();
    });
}
