import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'stats.js';


// ==========================
// --- CONFIGURATION ---
// ==========================
const params = new URLSearchParams(window.location.search);
const difficulty = parseInt(params.get("difficulty")) || 1;

const config = {
    bikeSpeed: 1.0,
    bikeSpeedLateral: 0.3,
    maxEnemies: 10,
    enemyAdvanceSpeed: -0.08,
    playerHealth: 100,
    maxHealth: 100,
    lengthOfRoad: 500,
    boostMultiplier: 2.5,
    boostChargeTime: 10000,
    boostDuration: 3000,
    itemCount: 6
};

// Notify parent (if embedded) about initial config
if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'game_init', difficulty, total: config.itemCount }, '*');
}

// Appliquer la difficulté
switch(difficulty) {
    case 1: // facile
        config.bikeSpeed = 1.2;
        config.bikeSpeedLateral = 0.5;
        config.maxEnemies = 25;
        config.playerHealth = 120;
        config.maxHealth = 120;
        config.lengthOfRoad = 700;
        config.itemCount = 8;
        break;
    case 2: // normal
        config.bikeSpeed = 1.8;
        config.bikeSpeedLateral = 0.5;
        config.maxEnemies = 40;
        config.playerHealth = 100;
        config.maxHealth = 100;
        config.lengthOfRoad = 1500;
        config.itemCount = 15;
        break;
    case 3: // difficile
        config.bikeSpeed = 2.5;
        config.bikeSpeedLateral = 0.5;
        config.maxEnemies = 60;
        config.playerHealth = 80;
        config.maxHealth = 80;
        config.lengthOfRoad = 3000;
        config.itemCount = 25;
        break;
}

// État du jeu
const gameState = {
    keysPressed: {},
    playerHealth: config.playerHealth,
    hasWon: false,
    isGameReady: false,
    itemGotCount: 0,
    boostReady: false,
    boostActive: false,
    boostLastUsed: Date.now() - config.boostChargeTime,
    boostStartTime: 0
};
// ==========================
// --- SCÈNE ---
// ==========================


const stats = new Stats();
stats.showPanel(0);

const gameContainer = document.getElementById("game-container");
const statsHost = gameContainer || document.body;
stats.dom.style.position = "absolute";
stats.dom.style.top = "12px";
stats.dom.style.right = "12px";
statsHost.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3557);
scene.fog = new THREE.Fog(0x1d3557, 200, 800);

const camera = new THREE.PerspectiveCamera(45, 16/9, 1, 1000);
camera.position.set(0, 15, 0);
camera.lookAt(0, 20, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.style.width = '110%';
renderer.domElement.style.height = '110%';
if (gameContainer) {
    gameContainer.appendChild(renderer.domElement);
} else {
    document.body.appendChild(renderer.domElement);
}

// --- In-game HUD: progress display + next-level button ---
let lastProgressPercent = 0;
let nextLevelButton = null;
function createInGameHUD() {
    const host = gameContainer || document.body;
    const hud = document.createElement('div');
    hud.id = 'in-game-hud';
    hud.style.position = 'absolute';
    hud.style.left = '12px';
    hud.style.bottom = '12px';
    hud.style.zIndex = 9999;
    hud.style.fontFamily = 'sans-serif';
    hud.style.color = '#ffffff';
    hud.style.pointerEvents = 'none';

    const progWrap = document.createElement('div');
    progWrap.style.width = '220px';
    progWrap.style.background = 'rgba(0,0,0,0.5)';
    progWrap.style.padding = '6px';
    progWrap.style.borderRadius = '6px';
    progWrap.style.pointerEvents = 'auto';

    const label = document.createElement('div');
    label.textContent = 'Progression';
    label.style.fontSize = '12px';
    label.style.marginBottom = '6px';
    progWrap.appendChild(label);

    const barBg = document.createElement('div');
    barBg.style.width = '200px';
    barBg.style.height = '10px';
    barBg.style.background = '#333';
    barBg.style.borderRadius = '6px';
    barBg.style.overflow = 'hidden';

    const bar = document.createElement('div');
    bar.id = 'in-game-progress-bar';
    bar.style.height = '100%';
    bar.style.width = '0%';
    bar.style.background = '#00ffcc';
    bar.style.transition = 'width 200ms linear';
    barBg.appendChild(bar);
    progWrap.appendChild(barBg);

    const percentText = document.createElement('div');
    percentText.id = 'in-game-progress-text';
    percentText.style.fontSize = '12px';
    percentText.style.marginTop = '6px';
    percentText.textContent = '0%';
    progWrap.appendChild(percentText);

    // items progress (second bar at bottom)
    const itemsLabel = document.createElement('div');
    itemsLabel.textContent = 'Objets';
    itemsLabel.style.fontSize = '12px';
    itemsLabel.style.marginTop = '10px';
    itemsLabel.style.marginBottom = '6px';
    progWrap.appendChild(itemsLabel);

    const itemsBg = document.createElement('div');
    itemsBg.style.width = '200px';
    itemsBg.style.height = '10px';
    itemsBg.style.background = '#333';
    itemsBg.style.borderRadius = '6px';
    itemsBg.style.overflow = 'hidden';

    const itemsBar = document.createElement('div');
    itemsBar.id = 'in-game-items-bar';
    itemsBar.style.height = '100%';
    itemsBar.style.width = '0%';
    itemsBar.style.background = '#ffd54f';
    itemsBar.style.transition = 'width 200ms linear';
    itemsBg.appendChild(itemsBar);
    progWrap.appendChild(itemsBg);

    const itemsText = document.createElement('div');
    itemsText.id = 'in-game-items-text';
    itemsText.style.fontSize = '12px';
    itemsText.style.marginTop = '6px';
    itemsText.textContent = '0 / ' + config.itemCount;
    progWrap.appendChild(itemsText);

    // next level button (disabled by default)
    const btn = document.createElement('button');
    btn.id = 'next-level-btn';
    btn.textContent = 'Niveau suivant';
    btn.disabled = true;
    btn.style.marginTop = '8px';
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '6px';
    btn.style.border = 'none';
    btn.style.background = '#777';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.pointerEvents = 'auto';
    btn.addEventListener('click', () => {
        // Only act if enabled
        if (btn.disabled) return;
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'next_level' }, '*');
        } else {
            console.log('Next level requested');
        }
    });
    progWrap.appendChild(btn);
    nextLevelButton = btn;

    hud.appendChild(progWrap);
    // append hud into same container that holds renderer so it overlays the canvas
    if (gameContainer) {
        gameContainer.style.position = gameContainer.style.position || 'relative';
        gameContainer.appendChild(hud);
    } else {
        document.body.appendChild(hud);
    }
}
createInGameHUD();

// If embedded inside a parent, hide the internal HUD elements (we use parent HUD)
if (window.parent && window.parent !== window) {
    document.body.classList.add('embedded');
    const boostPanel = document.querySelector('.boost-panel');
    if (boostPanel) boostPanel.style.display = 'none';
    const itemsPanel = document.querySelector('.items-panel');
    if (itemsPanel) itemsPanel.style.display = 'none';
}

// Additionally: always hide the top-right items HUD and the top timer bar
// (user prefers these removed in-game; we keep health value accessible elsewhere)
try {
    const itemsPanelAlways = document.querySelector('.items-panel');
    if (itemsPanelAlways) itemsPanelAlways.style.display = 'none';
    const containerTimer = document.getElementById('container-timer');
    if (containerTimer) containerTimer.style.display = 'none';
} catch (e) {
    // ignore
}

// ==========================
// --- LUMIÈRES ---
// ==========================
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(0, 100, 0);
scene.add(directionalLight);

const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
frontLight.position.set(0, 50, -100);
scene.add(frontLight);

const sideLight1 = new THREE.DirectionalLight(0x6699ff, 1.0);
sideLight1.position.set(-50, 30, 0);
scene.add(sideLight1);

const sideLight2 = new THREE.DirectionalLight(0x6699ff, 1.0);
sideLight2.position.set(50, 30, 0);
scene.add(sideLight2);

// ==========================
// --- SOL ---
// ==========================
const roadGeometry = new THREE.PlaneGeometry(60, config.lengthOfRoad);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.z = -config.lengthOfRoad / 2;
scene.add(road);

// Limites latérales partagées (joueur + ennemis + items)
const roadHalfWidth = roadGeometry.parameters.width / 2;
const sideMargin = 1.5;
const minTrackX = -roadHalfWidth + sideMargin;
const maxTrackX = roadHalfWidth - sideMargin;
const actorHalfWidth = 2;
const limitLeft = minTrackX + actorHalfWidth;
const limitRight = maxTrackX - actorHalfWidth;

function getRandomTrackX() {
    return Math.random() * (limitRight - limitLeft) + limitLeft;
}

const edgeGeometry = new THREE.BoxGeometry(1.2, 1.5, config.lengthOfRoad);
const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
const leftEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
const rightEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
leftEdge.position.set(-roadHalfWidth + 0.6, 0.75, -config.lengthOfRoad / 2);
rightEdge.position.set(roadHalfWidth - 0.6, 0.75, -config.lengthOfRoad / 2);
scene.add(leftEdge, rightEdge);

// Charger texture en arrière-plan
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    '/texture_sol.jpg',
    (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 10);
        roadMaterial.map = texture;
        roadMaterial.color.set(0xffffff);
        roadMaterial.needsUpdate = true;
    },
    undefined,
    (error) => console.warn('⚠️ Texture non chargée')
);

// ==========================
// --- JOUEUR ---
// ==========================
let playerBike = null;

function createPlayer() {
    const loader = new GLTFLoader();
    loader.load('assets/models/akira_bike.glb', 
        (gltf) => {
            playerBike = gltf.scene;
            playerBike.scale.set(4, 4, 4);
            playerBike.position.set(0, 11, 20);
            playerBike.rotation.y = 11;
            scene.add(playerBike);
            hideLoading();
        },
        undefined,
        (error) => {
            const geometry = new THREE.BoxGeometry(4, 4, 4);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
            playerBike = new THREE.Mesh(geometry, material);
            playerBike.position.set(0, 5, 20);
            scene.add(playerBike);
            hideLoading();
        }
    );
}

function hideLoading() {
    gameState.isGameReady = true;
    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) loadingMessage.style.display = "none";
}

// ==========================
// --- ENNEMIS ---
// ==========================
const enemies = [];

function createEnemy(index) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 1 });
    const enemy = new THREE.Mesh(geometry, material);
    const x = getRandomTrackX();
    const spacing = config.lengthOfRoad / Math.max(1, config.maxEnemies);
    const z = -120 - (index * spacing) - Math.random() * 80;
    enemy.position.set(x, 2, z);
    scene.add(enemy);
    enemies.push(enemy);
}

for(let i = 0; i < config.maxEnemies; i++) {
    createEnemy(i);
}

// ==========================
// --- ITEMS ---
// ==========================
const items = [];

for(let i = 0; i < config.itemCount; i++) {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const item = new THREE.Mesh(geometry, material);
    const spacing = (config.lengthOfRoad - 220) / Math.max(1, config.itemCount);
    const x = getRandomTrackX();
    const z = -180 - i * spacing - Math.random() * 40;
    item.position.set(x, 1, z);
    scene.add(item);
    items.push(item);
}

// ==========================
// --- CONTRÔLES ---
// ==========================
window.addEventListener('keydown', (e) => {
    // Prevent arrow keys from scrolling parent when embedded
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ' , 'Shift'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
    }
    gameState.keysPressed[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ' , 'Shift'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
    }
    gameState.keysPressed[e.key] = false;
});

function resizeRendererToContainer() {
    const width = (gameContainer ? gameContainer.clientWidth : window.innerWidth) || window.innerWidth;
    const height = (gameContainer ? gameContainer.clientHeight : window.innerHeight) || window.innerHeight;
    const needResize = renderer.domElement.width !== Math.floor(width * window.devicePixelRatio) || renderer.domElement.height !== Math.floor(height * window.devicePixelRatio);
    if (needResize) {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

window.addEventListener('resize', resizeRendererToContainer);
// ensure initial correct size
resizeRendererToContainer();

// ==========================
// --- FONCTIONS UTILS ---
// ==========================
function updateHealthUI() {
    const healthPercent = (gameState.playerHealth / config.maxHealth) * 100;
    const timerBar = document.getElementById("timer");
    const healthText = document.getElementById("health-value");
    
    if (timerBar) {
        timerBar.style.width = healthPercent + "%";
        timerBar.style.background = healthPercent > 60 ? "#00ffff" : 
                                    healthPercent > 30 ? "#ffaa00" : "#ff0033";
    }
    if (healthText) {
        healthText.textContent = Math.floor(healthPercent);
    }

    // notify parent about health when embedded
    if (window.parent && window.parent !== window) {
        const val = Math.floor(healthPercent);
        if (!window._lastHealth || window._lastHealth !== val) {
            window.parent.postMessage({ type: 'game_health', percent: val }, '*');
            window._lastHealth = val;
        }
    }
}

function showGameOver() {
    const gameOverDiv = document.getElementById("game-over");
    if (gameOverDiv) gameOverDiv.style.display = "block";
    // notify parent that game ended (game over)
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'game_over',
            difficulty,
            collected: gameState.itemGotCount,
            total: config.itemCount
        }, '*');
    }
}

function showVictory() {
    const victoryDiv = document.getElementById("victory-screen");
    if (victoryDiv) victoryDiv.style.display = "block";
    // enable next-level button only if player collected >=70% of items
    try {
        if (nextLevelButton) {
            const itemsCollected = gameState.itemGotCount || 0;
            const itemsTotal = config.itemCount || 1;
            const itemsPercent = Math.round((itemsCollected / itemsTotal) * 100);
            if (itemsPercent >= 70) {
                nextLevelButton.disabled = false;
                nextLevelButton.style.background = '#1e88e5';
            } else {
                nextLevelButton.disabled = true;
                nextLevelButton.style.background = '#777';
            }
        }
    } catch (e) {
        // ignore
    }
}

function updateBoostUI(currentTime) {
    const timeSinceLastBoost = currentTime - gameState.boostLastUsed;
    const boostBar = document.getElementById('boost-bar');
    const boostStatus = document.getElementById('boost-status');
    
    if (!boostBar || !boostStatus) return;
    
    if (gameState.boostActive) {
        const boostProgress = ((currentTime - gameState.boostStartTime) / config.boostDuration) * 100;
        boostBar.style.width = (100 - boostProgress) + '%';
        boostBar.style.background = '#ff0055';
        boostStatus.textContent = 'ACTIF!';
        boostStatus.style.color = '#ff0055';
    } else if (gameState.boostReady) {
        boostBar.style.width = '100%';
        boostBar.style.background = '#00ff00';
        boostStatus.textContent = 'PRÊT (SHIFT)';
        boostStatus.style.color = '#00ff00';
    } else {
        const chargeProgress = (timeSinceLastBoost / config.boostChargeTime) * 100;
        boostBar.style.width = chargeProgress + '%';
        boostBar.style.background = '#00ffff';
        boostStatus.textContent = 'CHARGEMENT...';
        boostStatus.style.color = '#00ffff';
    }

    // post boost state to parent if embedded (throttled by small change)
    if (window.parent && window.parent !== window) {
        const status = gameState.boostActive ? 'active' : (gameState.boostReady ? 'ready' : 'charging');
        const percent = gameState.boostActive ? Math.max(0, 100 - ((currentTime - gameState.boostStartTime) / config.boostDuration) * 100) : (gameState.boostReady ? 100 : Math.min(100, (timeSinceLastBoost / config.boostChargeTime) * 100));
        if (!window._lastBoostState || window._lastBoostState.status !== status || Math.abs(window._lastBoostState.percent - percent) > 1) {
            window.parent.postMessage({ type: 'game_boost', status, percent: Math.round(percent) }, '*');
            window._lastBoostState = { status, percent };
        }
    }
}

const playerCollisionBox = new THREE.Box3();

function getPlayerCollisionState(player) {
    playerCollisionBox.setFromObject(player);

    const centerX = (playerCollisionBox.min.x + playerCollisionBox.max.x) / 2;
    const centerZ = (playerCollisionBox.min.z + playerCollisionBox.max.z) / 2;
    const width = playerCollisionBox.max.x - playerCollisionBox.min.x;
    const depth = playerCollisionBox.max.z - playerCollisionBox.min.z;

    // Rayon joueur dérivé de la vraie taille de la moto (avec bornes stables)
    const radius = THREE.MathUtils.clamp(Math.min(width, depth) * 0.35, 1.2, 2.2);

    return { x: centerX, z: centerZ, radius };
}

function detectItemCollision(playerCollision, item) {
    const itemRadius = 1.2;
    const dx = item.position.x - playerCollision.x;
    const dz = item.position.z - playerCollision.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < (playerCollision.radius + itemRadius);
}

function detectEnemyCollision(playerCollision, enemy) {
    const enemyRadius = 2.0;
    const dx = enemy.position.x - playerCollision.x;
    const dz = enemy.position.z - playerCollision.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < (playerCollision.radius + enemyRadius);
}

// ==========================
// --- BOUCLE PRINCIPALE (TICK) ---
// ==========================
const cameraOffsets = {
    default: new THREE.Vector3(-2, 5, 30),
    boost: new THREE.Vector3(0, 12, 40),
    brake: new THREE.Vector3(0, 6, 18),
    current: new THREE.Vector3(-2, 5, 30),
    target: new THREE.Vector3(-2, 5, 30)
};

const cameraRoll = { current: 0, target: 0 };
let action = false;
let acceleration = 0;
let lateralSpeed = 0;
let animationFrameId = null;
const targetFps = 60;
const frameDuration = 1000 / targetFps;
let lastFrameTime = 0;
// smooth player rotation state
const playerRotation = { current: 11, target: 11, neutral: 11 };

const tick = () => {
    animationFrameId = requestAnimationFrame(tick);

    const now = performance.now();
    if (now - lastFrameTime < frameDuration) {
        return;
    }
    lastFrameTime = now;
    
    if (stats) stats.begin();
    
    // Attendre que le jeu soit prêt
    if (!gameState.isGameReady || !playerBike) {
        renderer.render(scene, camera);
        if (stats) stats.end();
        return;
    }
    
    const currentTime = Date.now();
    const keys = gameState.keysPressed;
    
    // === BOOST ===
    const timeSinceLastBoost = currentTime - gameState.boostLastUsed;
    
    if (!gameState.boostActive && timeSinceLastBoost >= config.boostChargeTime) {
        gameState.boostReady = true;
    }
    
    if (keys['Shift'] && gameState.boostReady && !gameState.boostActive) {
        gameState.boostActive = true;
        gameState.boostReady = false;
        gameState.boostStartTime = currentTime;
        gameState.boostLastUsed = currentTime;
    }
    
    if (gameState.boostActive && (currentTime - gameState.boostStartTime) >= config.boostDuration) {
        gameState.boostActive = false;
    }
    
    updateBoostUI(currentTime);
    
    // === MOUVEMENT ===
    let speed = config.bikeSpeed;
    if (gameState.boostActive) speed *= config.boostMultiplier;
    if (keys['ArrowUp']) speed += 1.2;
    if (keys['ArrowDown']) speed -= 1.0;

    playerBike.position.z -= speed;
    
    action = false;
    acceleration = 0;
    // determine target rotation smoothly instead of snapping
    // reduced leanAmount to make turns less violent
    const leanAmount = 0.5; // tuning: how much the bike y-rotation leans when steering
    if (keys['ArrowLeft']) {
        acceleration = -1;
        action = true;
        playerRotation.target = playerRotation.neutral + leanAmount;
    } else if (keys['ArrowRight']) {
        acceleration = 1;
        action = true;
        playerRotation.target = playerRotation.neutral - leanAmount;
    } else {
        playerRotation.target = playerRotation.neutral;
    }

    if (action) lateralSpeed += acceleration * config.bikeSpeedLateral * 0.35;
    lateralSpeed *= 0.85;
    playerBike.position.x += lateralSpeed;

    // smooth interpolation towards target rotation (slower, clamped per-frame)
    const interp = 0.06; // smaller = smoother/slower
    const maxDelta = 0.6; // clamp maximum change per frame to avoid snaps
    let delta = (playerRotation.target - playerRotation.current) * interp;
    delta = THREE.MathUtils.clamp(delta, -maxDelta, maxDelta);
    playerRotation.current += delta;
    if (playerBike) playerBike.rotation.y = playerRotation.current;

    // add a small roll (z rotation) based on lateral speed for visual feedback (reduced)
    const maxLeanZ = 0.35;
    if (playerBike) playerBike.rotation.z = THREE.MathUtils.clamp(lateralSpeed * 0.06, -maxLeanZ, maxLeanZ);

    if (playerBike.position.x < limitLeft) {
        playerBike.position.x = limitLeft;
        if (lateralSpeed < 0) lateralSpeed = 0;
    }
    if (playerBike.position.x > limitRight) {
        playerBike.position.x = limitRight;
        if (lateralSpeed > 0) lateralSpeed = 0;
    }
    
    // Les ennemis avancent très légèrement vers le joueur (logique index.js)
    enemies.forEach(enemy => {
        enemy.position.z += config.enemyAdvanceSpeed;
    });

    // === CAMÉRA ===
    if (keys['ArrowUp']) {
        cameraOffsets.target.copy(cameraOffsets.boost);
    } else if (keys['ArrowDown']) {
        cameraOffsets.target.copy(cameraOffsets.brake);
    } else {
        cameraOffsets.target.copy(cameraOffsets.default);
    }

    // Roulis caméra lors des virages
    if (keys['ArrowLeft']) {
        cameraRoll.target = 0.06;
    } else if (keys['ArrowRight']) {
        cameraRoll.target = -0.06;
    } else {
        cameraRoll.target = 0;
    }
    cameraRoll.current += (cameraRoll.target - cameraRoll.current) * 0.1;

    cameraOffsets.current.lerp(cameraOffsets.target, 0.08);
    camera.position.copy(playerBike.position).add(cameraOffsets.current);
    camera.lookAt(playerBike.position);
    camera.rotation.z = cameraRoll.current;
    
    // Lumières suivent le joueur
    frontLight.position.set(playerBike.position.x, 50, playerBike.position.z - 100);
    directionalLight.position.set(playerBike.position.x, 100, playerBike.position.z - 50);

    const playerCollision = getPlayerCollisionState(playerBike);
    
    // === ITEMS ===
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (detectItemCollision(playerCollision, item)) {
            scene.remove(item);
            items.splice(i, 1);
            gameState.itemGotCount++;
            const itemGot = document.querySelector(".item-got");
            if (itemGot) itemGot.innerHTML = gameState.itemGotCount;
            // send progress update to parent window if embedded
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'game_progress',
                    difficulty,
                    collected: gameState.itemGotCount,
                    total: config.itemCount
                }, '*');
            }
        }
    }

    // === RACE PROGRESS ===
    // compute progress from starting z (approx 20) to finish (-config.lengthOfRoad)
    const startZ = 20; // player's initial z
    const endZ = -config.lengthOfRoad;
    const travelled = Math.max(0, startZ - playerBike.position.z);
    const total = Math.max(1, startZ - endZ);
    const percent = Math.min(100, Math.max(0, (travelled / total) * 100));
    lastProgressPercent = percent;

    // update in-game HUD progress bar and items bar
    try {
        const bar = document.getElementById('in-game-progress-bar');
        const txt = document.getElementById('in-game-progress-text');
        if (bar) bar.style.width = percent + '%';
        if (txt) txt.textContent = Math.round(percent) + '%';

        const itemsBar = document.getElementById('in-game-items-bar');
        const itemsTxt = document.getElementById('in-game-items-text');
        const itemsCollected = gameState.itemGotCount || 0;
        const itemsTotal = config.itemCount || 1;
        const itemPercent = Math.min(100, Math.round((itemsCollected / itemsTotal) * 100));
        if (itemsBar) itemsBar.style.width = itemPercent + '%';
        if (itemsTxt) itemsTxt.textContent = itemsCollected + ' / ' + itemsTotal;
    } catch (e) {
        // ignore if HUD not present
    }
    if (window.parent && window.parent !== window) {
        if (!window._lastRaceProgress || Math.abs(window._lastRaceProgress - percent) > 0.5) {
            window.parent.postMessage({ type: 'race_progress', percent: Math.round(percent) }, '*');
            window._lastRaceProgress = percent;
        }
    }
    
    // === COLLISIONS ENNEMIS ===
    if (gameState.playerHealth > 0) {
        enemies.forEach(enemy => {
            if (detectEnemyCollision(playerCollision, enemy)) {
                gameState.playerHealth -= 10;
                if (gameState.playerHealth < 0) gameState.playerHealth = 0;
                updateHealthUI();
                enemy.position.z -= 200;
                enemy.material.color.set('red');
            } else {
                enemy.material.color.set('white');
            }

            if (enemy.position.z > playerBike.position.z) {
                enemy.material.opacity = 0.4;
            } else {
                enemy.material.opacity = 1;
            }
        });
    }
    
    // === GAME OVER ===
    if (gameState.playerHealth <= 0 && !gameState.hasWon) {
        showGameOver();
        if (stats) stats.end();
        return;
    }
    
    // === RESPAWN ENNEMIS ===
    enemies.forEach(enemy => {
        if (enemy.position.z > playerBike.position.z + 50) {
            const newZ = playerBike.position.z - 220 - Math.random() * 320;
            if (newZ > -config.lengthOfRoad) {
                enemy.position.z = newZ;
                enemy.position.x = getRandomTrackX();
                enemy.position.y = 2;
                enemy.material.opacity = 1;
            }
        }
    });
    
    // === VICTOIRE ===
    if (!gameState.hasWon && playerBike.position.z < -config.lengthOfRoad) {
        gameState.hasWon = true;
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        showVictory();
        // notify parent about victory and final progress
        if (window.parent && window.parent !== window) {
            const itemsCollected = gameState.itemGotCount || 0;
            const itemsTotal = config.itemCount || 1;
            const itemsPercent = Math.round((itemsCollected / itemsTotal) * 100);
            window.parent.postMessage({
                type: 'game_victory',
                difficulty,
                collected: itemsCollected,
                total: itemsTotal,
                itemsPercent,
                eligibleNextLevel: itemsPercent >= 70
            }, '*');
        }
        renderer.render(scene, camera);
        if (stats) stats.end();
        return;
    }
    
    renderer.render(scene, camera);
    if (stats) stats.end();
};

// ==========================
// --- INITIALISATION ---
// ==========================

function startGame() {
    createPlayer();
    if (!animationFrameId) tick();
}

// If embedded in a parent, wait for a `start` message from parent.
if (window.parent && window.parent !== window) {
    window.addEventListener('message', (ev) => {
        const data = ev.data;
        if (!data || typeof data !== 'object') return;
        if (data.type === 'start') {
            startGame();
        } else if (data.type === 'restart') {
            // simplest replay mechanism: reload the iframe/page
            location.reload();
        }
    });
} else {
    // standalone page: auto-start immediately
    startGame();
}

// Timeout de sécurité (sans logs)
setTimeout(() => {
    if (!gameState.isGameReady) {
        if (!playerBike) {
            const geometry = new THREE.BoxGeometry(4, 4, 4);
            const material = new THREE.MeshPhongMaterial({ color: 0xff0055 });
            playerBike = new THREE.Mesh(geometry, material);
            playerBike.position.set(0, 5, 20);
            scene.add(playerBike);
        }
        hideLoading();
    }
}, 2500);