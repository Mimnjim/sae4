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
    bikeSpeedLateral: 0.8,
    maxEnemies: 10,
    playerHealth: 100,
    maxHealth: 100,
    lengthOfRoad: 500,
    boostMultiplier: 2.5,
    boostChargeTime: 10000,
    boostDuration: 3000,
    itemCount: 6
};

// Appliquer la difficulté
switch(difficulty) {
    case 1: // facile
        config.bikeSpeed = 1.2;
        config.bikeSpeedLateral = 1.0;
        config.maxEnemies = 25;
        config.playerHealth = 120;
        config.maxHealth = 120;
        config.lengthOfRoad = 700;
        break;
    case 2: // normal
        config.bikeSpeed = 1.8;
        config.bikeSpeedLateral = 1.3;
        config.maxEnemies = 50;
        config.playerHealth = 100;
        config.maxHealth = 100;
        config.lengthOfRoad = 1500;
        break;
    case 3: // difficile
        config.bikeSpeed = 2.5;
        config.bikeSpeedLateral = 1.8;
        config.maxEnemies = 70;
        config.playerHealth = 80;
        config.maxHealth = 80;
        config.lengthOfRoad = 3000;
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
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3557);
scene.fog = new THREE.Fog(0x1d3557, 200, 800);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
camera.position.set(0, 15, 0);
camera.lookAt(0, 20, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

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
const roadGeometry = new THREE.PlaneGeometry(50, config.lengthOfRoad);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.z = -config.lengthOfRoad / 2;
scene.add(road);

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
        console.log('✅ Texture chargée');
    },
    undefined,
    (error) => console.warn('⚠️ Texture non chargée')
);

// ==========================
// --- JOUEUR ---
// ==========================
let playerBike = null;
const lanes = [-10, -3, 3, 10];

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
            console.log('✅ Moto chargée');
        },
        undefined,
        (error) => {
            const geometry = new THREE.BoxGeometry(4, 4, 4);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
            playerBike = new THREE.Mesh(geometry, material);
            playerBike.position.set(0, 5, 20);
            scene.add(playerBike);
            hideLoading();
            console.log('⚠️ Cube de remplacement');
        }
    );
}

function hideLoading() {
    gameState.isGameReady = true;
    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) loadingMessage.style.display = "none";
}

// ==========================
// --- VILLES ---
// ==========================
const cities = [];

function createCity() {
    const loader = new GLTFLoader();
    loader.load('assets/models/beautiful_city.glb', 
        (gltf) => {
            const city1 = gltf.scene;
            const city2 = city1.clone();
            city1.scale.set(100, 20, 30);
            city2.scale.set(100, 20, 30);
            city1.rotation.y = Math.PI/2;
            city2.rotation.y = Math.PI/2;
            city1.position.set(-20, 10, -100);
            city2.position.set(-20, 10, -300);
            scene.add(city1, city2);
            cities.push(city1, city2);
            console.log('✅ Villes chargées');
        },
        undefined,
        (error) => console.warn('⚠️ Villes non chargées')
    );
}

// ==========================
// --- ENNEMIS ---
// ==========================
const enemies = [];

function createEnemy(index) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    enemy.position.set(lane, 5, -100 - index * 30);
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
    item.position.set((Math.random() - 0.5) * 40, 1, -150 - i * 100);
    scene.add(item);
    items.push(item);
}

// ==========================
// --- CONTRÔLES ---
// ==========================
window.addEventListener('keydown', (e) => {
    gameState.keysPressed[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    gameState.keysPressed[e.key] = false;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

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

function detectCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

// ==========================
// --- BOUCLE PRINCIPALE (TICK) ---
// ==========================
const cameraOffsets = {
    default: new THREE.Vector3(-2, -2, 30),
    boost: new THREE.Vector3(0, 12, 40),
    brake: new THREE.Vector3(0, 6, 18),
    current: new THREE.Vector3(-2, -2, 30),
    target: new THREE.Vector3(-2, -2, 30)
};

const tick = () => {
    requestAnimationFrame(tick);
    
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
    
    if (keys['ArrowLeft'] && playerBike.position.x > -20) {
        playerBike.position.x -= config.bikeSpeedLateral;
        playerBike.rotation.y = -1.30;
    } else if (keys['ArrowRight'] && playerBike.position.x < 28) {
        playerBike.position.x += config.bikeSpeedLateral;
        playerBike.rotation.y = -1.73;
    } else {
        playerBike.rotation.y = 11;
    }
    
    // === CAMÉRA ===
    if (keys['ArrowUp']) {
        cameraOffsets.target.copy(cameraOffsets.boost);
    } else if (keys['ArrowDown']) {
        cameraOffsets.target.copy(cameraOffsets.brake);
    } else if (keys['ArrowLeft'] || keys['ArrowRight']) {
        cameraOffsets.target.copy(cameraOffsets.default).add(new THREE.Vector3(0, 0, 5));
    } else {
        cameraOffsets.target.copy(cameraOffsets.default);
    }
    
    cameraOffsets.current.lerp(cameraOffsets.target, 0.08);
    camera.position.copy(playerBike.position).add(cameraOffsets.current);
    camera.lookAt(playerBike.position);
    
    // Lumières suivent le joueur
    frontLight.position.set(playerBike.position.x, 50, playerBike.position.z - 100);
    directionalLight.position.set(playerBike.position.x, 100, playerBike.position.z - 50);
    
    // === ITEMS ===
    items.forEach((item, index) => {
        if (detectCollision(playerBike, item)) {
            scene.remove(item);
            items.splice(index, 1);
            gameState.itemGotCount++;
            const itemGot = document.querySelector(".item-got");
            if (itemGot) itemGot.innerHTML = gameState.itemGotCount;
        }
    });
    
    // === COLLISIONS ENNEMIS ===
    if (gameState.playerHealth > 0) {
        enemies.forEach(enemy => {
            if (detectCollision(playerBike, enemy)) {
                gameState.playerHealth -= 10;
                if (gameState.playerHealth < 0) gameState.playerHealth = 0;
                updateHealthUI();
                enemy.position.z -= 200;
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
            const newZ = playerBike.position.z - 300 - Math.random() * 100;
            if (newZ > -config.lengthOfRoad) {
                enemy.position.z = newZ + 25;
                enemy.position.x = lanes[Math.floor(Math.random() * lanes.length)];
            }
        }
    });
    
    // === VICTOIRE ===
    if (!gameState.hasWon && playerBike.position.z < -config.lengthOfRoad) {
        gameState.hasWon = true;
        showVictory();
    }
    
    stats.end();
    renderer.render(scene, camera);
    if (stats) stats.end();
};

// ==========================
// --- INITIALISATION ---
// ==========================
createPlayer();
createCity();
tick();

// Timeout de sécurité
setTimeout(() => {
    if (!gameState.isGameReady) {
        console.log('⏱️ Timeout - Démarrage forcé');
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
