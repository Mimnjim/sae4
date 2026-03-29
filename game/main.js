// ── Imports ───────────────────────────────────────────────────
import './lights.js';       // side-effect : ajoute les lumières à la scène
import './controls.js';     // side-effect : enregistre les event listeners clavier

import { scene, camera, renderer, stats } from './scene.js';
import { config, difficulty, isEmbedded } from './config.js';
import { gameState, playerRef, getEl, getSel } from './state.js';
import { createHUD, initEmbeddedUI } from './hud.js';
import { tryLoadBuildingPrefabs, getRandomTrackX } from './road.js';
import { createPlayer, PLAYER_START_Z } from './player.js';
import { enemies, tryLoadEnemyModel } from './enemies.js';
import { collectibles, tryLoadItemModel } from './collectibles.js';
import {
    FRAME_DURATION,
    getPlayerCollisionData,
    isCollidingWithItem,
    isCollidingWithEnemy,
    handlePlayerMovement,
    handleCamera,
} from './physics.js';
import {
    updateHealthUI,
    updateBoostUI,
    updateSpeedUI,
    updateRaceProgressUI,
    showGameOver,
    showVictory,
} from './ui.js';

// ── Init HUD ──────────────────────────────────────────────────
createHUD();
initEmbeddedUI();

if (isEmbedded) {
    window.parent.postMessage({ type: 'game_init', difficulty, total: config.itemCount }, '*');
}
// The loading overlay is defined statically in `game.html` (#loading-overlay).
// We don't create it here to avoid duplicate overlays.

// ── Chargement assets (tous en parallèle) ─────────────────────
const loadPromises = [
    tryLoadBuildingPrefabs(),
    tryLoadEnemyModel(),
    tryLoadItemModel(),
    // createPlayer now returns a Promise resolving when player is ready or fallback used
    createPlayer(),
];

const assetsLoadedPromise = Promise.all(loadPromises).then(() => {
    // hide overlay when absolutely all assets are ready
    const el = document.getElementById('loading-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (isEmbedded) window.parent.postMessage({ type: 'game_loaded', difficulty }, '*');
}).catch(() => {
    // even if some assets failed, remove overlay and allow playing with fallbacks
    const el = document.getElementById('loading-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
});

// ── Boost ─────────────────────────────────────────────────────
function handleBoost(currentTime) {
    const elapsed = currentTime - gameState.boostUsedAt;
    if (!gameState.boostActive && elapsed >= config.boostCooldown) gameState.boostReady = true;

    if (gameState.keysPressed['Shift'] && gameState.boostReady && !gameState.boostActive) {
        gameState.boostActive    = true;
        gameState.boostReady     = false;
        gameState.boostStartedAt = currentTime;
        gameState.boostUsedAt    = currentTime;
    }

    if (gameState.boostActive && (currentTime - gameState.boostStartedAt) >= config.boostDuration) {
        gameState.boostActive = false;
    }
}

// ── Collectibles ──────────────────────────────────────────────
// OPTIMISATION : culling par distance — on ignore les items trop loin devant le joueur
const ITEM_CULL_AHEAD = 50;

function handleCollectibles(playerData) {
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        if (item.userData.collected) continue;

        // Skip les items encore loin devant (le joueur n'y est pas encore)
        if (item.position.z < playerRef.bike.position.z - ITEM_CULL_AHEAD) continue;

        if (isCollidingWithItem(playerData, item)) {
            item.userData.collected = true;
            gameState.itemsCollected++;

            const itemCounter = getSel('.item-got');
            if (itemCounter) itemCounter.innerHTML = gameState.itemsCollected;

            if (isEmbedded) {
                window.parent.postMessage({
                    type: 'game_progress', difficulty,
                    collected: gameState.itemsCollected, total: config.itemCount,
                }, '*');
            }
        }
    }
}

// ── Ennemis ───────────────────────────────────────────────────
// OPTIMISATION : culling par distance — on ne traite que les ennemis proches
const ENEMY_CULL_RANGE = 400;

function handleEnemies(playerData) {
    if (gameState.playerHealth <= 0) return;

    const bikeZ = playerRef.bike.position.z;

    enemies.forEach(entry => {
        const enemyRoot = entry.root;

        // OPTIMISATION : skip les ennemis hors de portée de traitement
        if (Math.abs(enemyRoot.position.z - bikeZ) > ENEMY_CULL_RANGE) return;

        enemyRoot.position.z += config.enemyMoveSpeed;

        const isPast   = enemyRoot.position.z > bikeZ;
        const collides = isCollidingWithEnemy(playerData, entry);

        // OPTIMISATION : on itère sur entry.meshNodes (cachés au chargement)
        // au lieu de faire visual.traverse() à chaque frame
        for (const node of entry.meshNodes) {
            node.material.opacity = isPast ? 0.4 : 1;
            if (node.material.color) node.material.color.setHex(collides ? 0xff0000 : 0xffffff);
        }

        if (collides) {
            gameState.playerHealth = Math.max(0, gameState.playerHealth - 10);
            updateHealthUI();
            enemyRoot.position.z -= 200;
        }

        if (enemyRoot.position.z > bikeZ + 50) {
            const newZ = bikeZ - 220 - Math.random() * 320;
            if (newZ > -config.roadLength) {
                enemyRoot.position.set(
                        getRandomTrackX(),
                    2,
                    newZ
                );
                // Reset opacité via le cache
                for (const node of entry.meshNodes) node.material.opacity = 1;
            }
        }
    });
}

// ── Progression course ────────────────────────────────────────
function calculateRaceProgress() {
    const travelled = Math.max(0, PLAYER_START_Z - playerRef.bike.position.z);
    const total     = Math.max(1, PLAYER_START_Z + config.roadLength);
    return Math.min(100, (travelled / total) * 100);
}

// ── Boucle principale ─────────────────────────────────────────
let lastFrameTime    = 0;
let animationFrameId = null;

const tick = () => {
    animationFrameId = requestAnimationFrame(tick);

    const now = performance.now();
    if (now - lastFrameTime < FRAME_DURATION) return;
    lastFrameTime = now;

    stats.begin();

    if (!gameState.isReady || !playerRef.bike) {
        renderer.render(scene, camera);
        stats.end();
        return;
    }

    const currentTime = Date.now();

    handleBoost(currentTime);
    updateBoostUI(currentTime);
    handlePlayerMovement();
    updateSpeedUI();
    handleCamera();

    const playerData = getPlayerCollisionData(playerRef.bike);
    handleCollectibles(playerData);
    handleEnemies(playerData);

    const racePercent = calculateRaceProgress();
    updateRaceProgressUI(racePercent);

    if (gameState.playerHealth <= 0 && !gameState.hasWon) {
        showGameOver();
        stats.end();
        return;
    }

    if (!gameState.hasWon && playerRef.bike.position.z < -config.roadLength) {
        gameState.hasWon = true;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        showVictory();
        renderer.render(scene, camera);
        stats.end();
        return;
    }

    renderer.render(scene, camera);
    stats.end();
};

// ── Démarrage ─────────────────────────────────────────────────
function startGame() {
    if (!animationFrameId) tick();
}

// Reset in-memory objects so we can restart without reloading the page.
function resetGameObjects() {
    // Reset state
    gameState.playerHealth = config.playerHealth;
    gameState.itemsCollected = 0;
    gameState.hasWon = false;
    gameState.isReady = false;
    gameState.boostReady = false;
    gameState.boostActive = false;
    gameState.boostUsedAt = Date.now() - config.boostCooldown;
    gameState.boostStartedAt = 0;
    gameState.currentSpeed = 0;
    gameState.keysPressed = {};

    // Reset collectibles to their initial positions and state
    for (let i = 0; i < collectibles.length; i++) {
        const item = collectibles[i];
        if (!item) continue;
        const init = item.userData && item.userData.initialPosition ? item.userData.initialPosition : null;
        if (init) item.position.copy(init);
        item.userData = item.userData || {};
        item.userData.collected = false;
        item.visible = true;
    }

    // Reset enemies positions and visuals
    for (const entry of enemies) {
        if (!entry || !entry.root) continue;
        if (entry.initialPosition) entry.root.position.copy(entry.initialPosition);
        else entry.root.position.set(getRandomTrackX(), 2, -120 - Math.random() * 300);
        // restore visuals/materials
        if (entry.meshNodes) {
            for (const node of entry.meshNodes) {
                if (node.material) {
                    node.material.opacity = 1;
                    if (node.material.color) node.material.color.setHex(0xffffff);
                }
            }
        }
    }

    // Remove old player model (if any) and recreate so texture/material hooks run again
    try {
        if (playerRef.bike && playerRef.bike.parent) scene.remove(playerRef.bike);
    } catch (e) {}
    playerRef.bike = null;

    // Reset HUD and UI
    const itemCounter = getSel('.item-got');
    if (itemCounter) itemCounter.innerHTML = '0';
    updateHealthUI();
    updateBoostUI(Date.now());
    updateSpeedUI();
    updateRaceProgressUI(0);
}

function restartGame() {
    // stop current animation loop if running
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    resetGameObjects();
    // create player again (will use cached models) and start loop when ready
    createPlayer().then(() => { if (!animationFrameId) tick(); });
}

if (isEmbedded) {
    window.addEventListener('message', event => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;
        if (data.type === 'start') {
            // Wait for assets to finish loading before starting
            assetsLoadedPromise.then(() => startGame());
        } else if (data.type === 'restart') restartGame();
    });
    // don't auto-start when embedded; parent will send 'start'
} else {
    // Start after all assets loaded
    assetsLoadedPromise.then(() => startGame());
}
