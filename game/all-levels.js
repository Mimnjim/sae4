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
    enemyAdvanceSpeed: 0.08,
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

const containerWidth = (gameContainer ? gameContainer.clientWidth : window.innerWidth) || window.innerWidth;
const containerHeight = (gameContainer ? gameContainer.clientHeight : window.innerHeight) || window.innerHeight;
const aspect = containerWidth / containerHeight;
const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
camera.position.set(0, 15, 0);
camera.lookAt(0, 20, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(containerWidth, containerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
if (gameContainer) {
    gameContainer.appendChild(renderer.domElement);
} else {
    document.body.appendChild(renderer.domElement);
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
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.addEventListener('resize', resizeRendererToContainer);

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
}

function showGameOver() {
    const gameOverDiv = document.getElementById("game-over");
    if (gameOverDiv) gameOverDiv.style.display = "block";
}

function showVictory() {
    const victoryDiv = document.getElementById("victory-screen");
    if (victoryDiv) victoryDiv.style.display = "block";
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
    if (keys['ArrowLeft']) {
        acceleration = -1;
        action = true;
        playerBike.rotation.y = -1.30;
    } else if (keys['ArrowRight']) {
        acceleration = 1;
        action = true;
        playerBike.rotation.y = -1.73;
    } else {
        playerBike.rotation.y = 11;
    }

    if (action) lateralSpeed += acceleration * config.bikeSpeedLateral * 0.35;
    lateralSpeed *= 0.85;
    playerBike.position.x += lateralSpeed;

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
            window.parent.postMessage({
                type: 'game_victory',
                difficulty,
                collected: gameState.itemGotCount,
                total: config.itemCount
            }, '*');
        }
        renderer.render(scene, camera);
        if (stats) stats.end();
        return;
    }
    
    stats.end();
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