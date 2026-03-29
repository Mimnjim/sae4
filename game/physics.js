import * as THREE from 'three';
import { camera } from './scene.js';
import { config, difficulty } from './config.js';
import { gameState, playerRef } from './state.js';
import { TRACK_MIN_X, TRACK_MAX_X } from './road.js';
// OPTIMISATION : import de frontLight retiré
import { sunLight } from './lights.js';

export const LATERAL_FRICTION = 0.85;
export const LEAN_AMOUNT = 0.5;
export const ROTATION_INTERP = 0.06;
export const MAX_ROTATION_PER_FRAME = 0.6;
export const MAX_LEAN_Z = 0.35;
export const CAMERA_LERP_SPEED = 0.08;
export const CAMERA_ROLL_SPEED = 0.1;
export const CAMERA_ROLL_AMOUNT = 0.06;

export const TARGET_FPS = 60;
export const FRAME_DURATION = 1000 / TARGET_FPS;

export const cameraOffset = {
    default: new THREE.Vector3(-2, 5, 30),
    boost: new THREE.Vector3(0, 12, 40),
    brake: new THREE.Vector3(0, 6, 18),
    current: new THREE.Vector3(-2, 5, 30),
    target: new THREE.Vector3(-2, 5, 30),
};

const cameraLookTarget = new THREE.Vector3();
export const cameraRoll = { current: 0, target: 0 };
export const bikeRotation = { current: 11, target: 11, neutral: 11 };
export let lateralSpeed = 0;

const playerCollisionBox = new THREE.Box3();

export function getPlayerCollisionData(player) {
    playerCollisionBox.setFromObject(player);
    const cx = (playerCollisionBox.min.x + playerCollisionBox.max.x) / 2;
    const cz = (playerCollisionBox.min.z + playerCollisionBox.max.z) / 2;
    const w = playerCollisionBox.max.x - playerCollisionBox.min.x;
    const d = playerCollisionBox.max.z - playerCollisionBox.min.z;
    return { x: cx, z: cz, radius: THREE.MathUtils.clamp(Math.min(w, d) * 0.35, 1.2, 2.2) };
}

export function dist2D(ax, az, bx, bz) {
    const dx = ax - bx, dz = az - bz;
    return Math.sqrt(dx * dx + dz * dz);
}

export function isCollidingWithItem(playerData, item) {
    return dist2D(item.position.x, item.position.z, playerData.x, playerData.z) < (playerData.radius + 1.2);
}

export function isCollidingWithEnemy(playerData, enemy) {
    const pos = (enemy?.root?.position) ?? enemy?.position ?? enemy;
    const ex = (pos && typeof pos.x === 'number') ? pos.x : 0;
    const ez = (pos && typeof pos.z === 'number') ? pos.z : 0;
    return dist2D(ex, ez, playerData.x, playerData.z) < (playerData.radius + 2.0);
}

export function handlePlayerMovement() {
    const keys = gameState.keysPressed;
    const bike = playerRef.bike;
    let speed = config.bikeSpeed;

    if (gameState.boostActive) speed *= config.boostMultiplier;
    if (keys['ArrowUp']) speed += 1.2;
    if (keys['ArrowDown']) speed -= 1.0;
    bike.position.z -= speed;
    gameState.currentSpeed = Math.max(0, speed);

    if (keys['ArrowLeft']) { lateralSpeed -= config.bikeLateralSpeed * 0.35; bikeRotation.target = bikeRotation.neutral + LEAN_AMOUNT; }
    else if (keys['ArrowRight']) { lateralSpeed += config.bikeLateralSpeed * 0.35; bikeRotation.target = bikeRotation.neutral - LEAN_AMOUNT; }
    else { bikeRotation.target = bikeRotation.neutral; }

    lateralSpeed *= LATERAL_FRICTION;
    bike.position.x += lateralSpeed;

    if (bike.position.x < TRACK_MIN_X) { bike.position.x = TRACK_MIN_X; if (lateralSpeed < 0) lateralSpeed = 0; }
    if (bike.position.x > TRACK_MAX_X) { bike.position.x = TRACK_MAX_X; if (lateralSpeed > 0) lateralSpeed = 0; }

    const rawDelta = (bikeRotation.target - bikeRotation.current) * ROTATION_INTERP;
    bikeRotation.current += THREE.MathUtils.clamp(rawDelta, -MAX_ROTATION_PER_FRAME, MAX_ROTATION_PER_FRAME);

    if (difficulty === 2) {
        bike.rotation.y = 11 + Math.PI / 2 + (bikeRotation.current - bikeRotation.neutral) * 0.2;
    } else {
        bike.rotation.y = bikeRotation.current;
    }
    bike.rotation.z = THREE.MathUtils.clamp(lateralSpeed * 0.06, -MAX_LEAN_Z, MAX_LEAN_Z);
}

export function handleCamera() {
    const keys = gameState.keysPressed;
    const bike = playerRef.bike;

    if (keys['ArrowUp']) cameraOffset.target.copy(cameraOffset.boost);
    else if (keys['ArrowDown']) cameraOffset.target.copy(cameraOffset.brake);
    else cameraOffset.target.copy(cameraOffset.default);

    if (keys['ArrowLeft']) cameraRoll.target = CAMERA_ROLL_AMOUNT;
    else if (keys['ArrowRight']) cameraRoll.target = -CAMERA_ROLL_AMOUNT;
    else cameraRoll.target = 0;

    cameraRoll.current += (cameraRoll.target - cameraRoll.current) * CAMERA_ROLL_SPEED;
    cameraOffset.current.lerp(cameraOffset.target, CAMERA_LERP_SPEED);

    camera.position.copy(bike.position).add(cameraOffset.current);
    cameraLookTarget.copy(bike.position);
    if (difficulty === 2) cameraLookTarget.z -= 8;
    camera.lookAt(cameraLookTarget);
    camera.rotation.z = cameraRoll.current;

    // OPTIMISATION : Mise à jour uniquement de la sunLight
    sunLight.position.set(bike.position.x, 100, bike.position.z - 50);
}