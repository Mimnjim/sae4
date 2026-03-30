import './lights.js';
import './controls.js';

import { scene, camera, renderer, stats } from './scene.js';
import { config, difficulty, isEmbedded } from './config.js';
import { gameState, playerRef, getEl, getSel } from './state.js';
import { createHUD, initEmbeddedUI } from './hud.js';
import { tryLoadBuildingPrefabs, getRandomTrackX, recycleBuildings, resetBuildings } from './road.js';
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

createHUD();
initEmbeddedUI();

if (isEmbedded) {
    window.parent.postMessage({ type: 'game_init', difficulty, total: config.itemCount }, '*');
}

const loadPromises = [
    tryLoadBuildingPrefabs(),
    tryLoadEnemyModel(),
    tryLoadItemModel(),
    createPlayer(),
];

const assetsLoadedPromise = Promise.all(loadPromises).then(() => {
    const el = document.getElementById('loading-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (isEmbedded) window.parent.postMessage({ type: 'game_loaded', difficulty }, '*');
}).catch((err) => {
    console.error('Erreur lors du chargement des assets:', err);
    const el = document.getElementById('loading-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    // Continuer quand même, au moins on peut voir la scène vide
});

function handleBoost(currentTime) {
    const elapsed = currentTime - gameState.boostUsedAt;
    if (!gameState.boostActive && elapsed >= config.boostCooldown) gameState.boostReady = true;

    if (gameState.keysPressed['Shift'] && gameState.boostReady && !gameState.boostActive) {
        gameState.boostActive = true;
        gameState.boostReady = false;
        gameState.boostStartedAt = currentTime;
        gameState.boostUsedAt = currentTime;
    }

    if (gameState.boostActive && (currentTime - gameState.boostStartedAt) >= config.boostDuration) {
        gameState.boostActive = false;
    }
}

const ITEM_CULL_AHEAD = 50;

function handleCollectibles(playerData) {
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        if (item.userData.collected) continue;

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

// OPTIMISATION : Distance de calcul réduite pour raccorder au fog
const ENEMY_CULL_RANGE = 250;

function handleEnemies(playerData) {
    if (gameState.playerHealth <= 0) return;

    const bikeZ = playerRef.bike.position.z;

    enemies.forEach(entry => {
        const enemyRoot = entry.root;

        if (Math.abs(enemyRoot.position.z - bikeZ) > ENEMY_CULL_RANGE) return;

        enemyRoot.position.z += config.enemyMoveSpeed;

        const collides = isCollidingWithEnemy(playerData, entry);

        // OPTIMISATION : Suppression de la logique d'opacité, on garde juste la couleur de collision
        if (entry._lastCollides !== collides) {
            for (const node of entry.meshNodes) {
                if (node.material && node.material.color) node.material.color.setHex(collides ? 0xff0000 : 0xffffff);
            }
            entry._lastCollides = collides;
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
                for (const node of entry.meshNodes) {
                    if (node.material && node.material.color) node.material.color.setHex(0xffffff);
                }
                entry._lastCollides = null;
            }
        }
    });
}

function calculateRaceProgress() {
    const travelled = Math.max(0, PLAYER_START_Z - playerRef.bike.position.z);
    const total = Math.max(1, PLAYER_START_Z + config.roadLength);
    return Math.min(100, (travelled / total) * 100);
}

let lastFrameTime = 0;
let animationFrameId = null;

const tick = () => {
    animationFrameId = requestAnimationFrame(tick);

    const now = performance.now();
    if (now - lastFrameTime < FRAME_DURATION) return;
    lastFrameTime = now;

    if (stats) stats.begin();

    if (!gameState.isReady || !playerRef.bike) {
        renderer.render(scene, camera);
        if (stats) stats.end();
        return;
    }

    const currentTime = Date.now();

    handleBoost(currentTime);
    updateBoostUI(currentTime);
    handlePlayerMovement();
    updateSpeedUI();
    handleCamera();

    // Recycle buildings so there's always scenery ahead
    try { recycleBuildings(playerRef.bike.position.z); } catch (e) {}

    const playerData = getPlayerCollisionData(playerRef.bike);
    handleCollectibles(playerData);
    handleEnemies(playerData);

    const racePercent = calculateRaceProgress();
    updateRaceProgressUI(racePercent);

    if (gameState.playerHealth <= 0 && !gameState.hasWon) {
        showGameOver();
        if (stats) stats.end();
        return;
    }

    if (!gameState.hasWon && playerRef.bike.position.z < -config.roadLength) {
        gameState.hasWon = true;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        showVictory();
        renderer.render(scene, camera);
        if (stats) stats.end();
        return;
    }

    renderer.render(scene, camera);
    if (stats) stats.end();
};

function startGame() {
    if (!animationFrameId) tick();
}

function resetGameObjects() {
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

    for (let i = 0; i < collectibles.length; i++) {
        const item = collectibles[i];
        if (!item) continue;
        const init = item.userData && item.userData.initialPosition ? item.userData.initialPosition : null;
        if (init) item.position.copy(init);
        item.userData = item.userData || {};
        item.userData.collected = false;
        item.visible = true;
    }

    for (const entry of enemies) {
        if (!entry || !entry.root) continue;
        if (entry.initialPosition) entry.root.position.copy(entry.initialPosition);
        else entry.root.position.set(getRandomTrackX(), 2, -120 - Math.random() * 300);

        if (entry.meshNodes) {
            for (const node of entry.meshNodes) {
                if (node.material && node.material.color) node.material.color.setHex(0xffffff);
            }
        }
    }

    try {
        if (playerRef.bike && playerRef.bike.parent) scene.remove(playerRef.bike);
    } catch (e) { }
    playerRef.bike = null;

    // Reset building pool positions
    try { resetBuildings(); } catch (e) {}

    const itemCounter = getSel('.item-got');
    if (itemCounter) itemCounter.innerHTML = '0';
    updateHealthUI();
    updateBoostUI(Date.now());
    updateSpeedUI();
    updateRaceProgressUI(0);
    
        // Hide overlays if present
        try { const vs = document.getElementById('victory-screen'); if (vs) vs.style.display = 'none'; } catch (e) {}
        try { const go = document.getElementById('game-over'); if (go) go.style.display = 'none'; } catch (e) {}
}

function restartGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    resetGameObjects();
    createPlayer().then(() => { if (!animationFrameId) tick(); });
}

if (isEmbedded) {
    window.addEventListener('message', event => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;
        if (data.type === 'start') {
            assetsLoadedPromise.then(() => startGame());
        } else if (data.type === 'restart') restartGame();
    });
} else {
    assetsLoadedPromise.then(() => startGame());
}

// Rendu initial immédiat pour afficher la scène pendant le chargement
let initialRenderDone = false;
const renderInitial = () => {
    if (!initialRenderDone) {
        initialRenderDone = true;
        renderer.render(scene, camera);
    }
    if (!animationFrameId) {
        requestAnimationFrame(renderInitial);
    }
};
renderInitial();