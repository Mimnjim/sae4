import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'stats.js';


// ============================================================
// 0. CHARGEMENT GLTF ROBUSTE
// ============================================================
function loadGLTFWithCandidates(paths) {
    return new Promise((resolve, reject) => {
        let idx = 0;

        const tryNext = () => {
            if (idx >= paths.length) {
                reject(new Error('Aucun modèle trouvé parmi les candidats'));
                return;
            }

            const path = paths[idx++];
            console.log('[ModelLoader] Essai :', path);

            const basePath = path.replace(/[^/]*$/, '');
            const baseAbs  = new URL(basePath, window.location.href).href;

            const manager = new THREE.LoadingManager();
            manager.onError = (url) => console.warn('[ModelLoader] Ressource introuvable :', url);
            manager.setURLModifier((url) => {
                if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('/')) return url;
                try   { return new URL(url, baseAbs).href; }
                catch { return baseAbs + url; }
            });

            const loader = new GLTFLoader(manager);
            loader.load(
                path,
                (gltf) => resolve({ gltf, path }),
                undefined,
                (err) => { console.warn('[ModelLoader] Échec :', path, err); tryNext(); }
            );
        };

        tryNext();
    });
}


// ============================================================
// 1. CONFIGURATION & DIFFICULTÉ
// ============================================================
const urlParams   = new URLSearchParams(window.location.search);
const difficulty  = parseInt(urlParams.get("difficulty")) || 1;

const config = {
    bikeSpeed:        1.0,
    bikeLateralSpeed: 0.3,
    maxEnemies:       10,
    enemyMoveSpeed:   -0.08,
    playerHealth:     100,
    maxHealth:        100,
    roadLength:       500,
    boostMultiplier:  2.5,
    boostCooldown:    10000,
    boostDuration:    3000,
    itemCount:        6,
};

switch (difficulty) {
    case 1:
        config.bikeSpeed        = 1.2;
        config.bikeLateralSpeed = 0.5;
        config.maxEnemies       = 25;
        config.playerHealth     = 120;
        config.maxHealth        = 120;
        config.roadLength       = 700;
        config.itemCount        = 8;
        break;
    case 2:
        config.bikeSpeed        = 1.8;
        config.bikeLateralSpeed = 0.5;
        config.maxEnemies       = 40;
        config.playerHealth     = 100;
        config.maxHealth        = 100;
        config.roadLength       = 1500;
        config.itemCount        = 15;
        break;
    case 3:
        config.bikeSpeed        = 2.5;
        config.bikeLateralSpeed = 0.5;
        config.maxEnemies       = 60;
        config.playerHealth     = 80;
        config.maxHealth        = 80;
        config.roadLength       = 3000;
        config.itemCount        = 25;
        break;
}

const isEmbedded = window.parent && window.parent !== window;
if (isEmbedded) {
    window.parent.postMessage({ type: 'game_init', difficulty, total: config.itemCount }, '*');
}


// ============================================================
// 2. ÉTAT DU JEU & CACHES D'OPTIMISATIONS
// ============================================================
const gameState = {
    keysPressed:    {},
    playerHealth:   config.playerHealth,
    itemsCollected: 0,
    hasWon:         false,
    isReady:        false,
    boostReady:     false,
    boostActive:    false,
    boostUsedAt:    Date.now() - config.boostCooldown,
    boostStartedAt: 0,
    currentSpeed:   0,
};

// OPTIMISATION : Anti-Spam PostMessage
const lastPostValues = { speed: -1, progress: -1, health: -1, boostStatus: null, boostPct: -1 };

// OPTIMISATION : Cache DOM
const domCache = {};
function getEl(id) { return domCache[id] || (domCache[id] = document.getElementById(id)); }
function getSel(sel) { return domCache[sel] || (domCache[sel] = document.querySelector(sel)); }


// ============================================================
// 3. SCÈNE, CAMÉRA, RENDERER
// ============================================================
const stats = new Stats();
stats.showPanel(0);
const gameContainer = document.getElementById("game-container");
const statsParent   = gameContainer || document.body;
stats.dom.style.cssText = 'position:absolute;top:12px;right:12px;';
statsParent.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3557);
scene.fog = new THREE.Fog(0x1d3557, 200, 800);

const camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 1000);
camera.position.set(-2, 20, 50); 
camera.lookAt(0, 0, 20);

// OPTIMISATION : force la CG dédiée
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
renderer.domElement.style.cssText = 'width:110%;height:110%;';

if (gameContainer) gameContainer.appendChild(renderer.domElement);
else               document.body.appendChild(renderer.domElement);

function resizeRenderer() {
    const w = (gameContainer?.clientWidth  || window.innerWidth);
    const h = (gameContainer?.clientHeight || window.innerHeight);
    const pw = Math.floor(w * window.devicePixelRatio);
    const ph = Math.floor(h * window.devicePixelRatio);
    if (renderer.domElement.width !== pw || renderer.domElement.height !== ph) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
}
window.addEventListener('resize', resizeRenderer);
resizeRenderer();


// ============================================================
// 4. HUD
// ============================================================
let nextLevelButton = null;

function createProgressBar({ label, barId, textId, color, initial, topMargin = '0px' }) {
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = topMargin;

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.cssText = 'font-size:12px;margin-bottom:6px;';
    wrapper.appendChild(labelEl);

    const track = document.createElement('div');
    track.style.cssText = 'width:200px;height:10px;background:#333;border-radius:6px;overflow:hidden;';

    const bar = document.createElement('div');
    bar.id = barId;
    bar.style.cssText = `height:100%;width:0%;background:${color};transition:width 200ms linear;`;
    track.appendChild(bar);
    wrapper.appendChild(track);

    const text = document.createElement('div');
    text.id = textId;
    text.style.cssText = 'font-size:12px;margin-top:6px;';
    text.textContent = initial;
    wrapper.appendChild(text);

    return wrapper;
}

function createHUD() {
    if (isEmbedded) return;

    const host = gameContainer || document.body;
    const hud  = document.createElement('div');
    hud.id = 'in-game-hud';
    hud.style.cssText = 'position:absolute;left:12px;bottom:12px;z-index:9999;font-family:sans-serif;color:#fff;pointer-events:none;';

    const panel = document.createElement('div');
    panel.style.cssText = 'width:220px;background:rgba(0,0,0,0.5);padding:6px;border-radius:6px;pointer-events:auto;';

    panel.appendChild(createProgressBar({ label: 'Progression', barId: 'hud-progress-bar', textId: 'hud-progress-text', color: '#00ffcc', initial: '0%' }));
    panel.appendChild(createProgressBar({ label: 'Objets',      barId: 'hud-items-bar',    textId: 'hud-items-text',    color: '#ffd54f', initial: `0 / ${config.itemCount}`, topMargin: '10px' }));

    const btn = document.createElement('button');
    btn.id = 'next-level-btn';
    btn.textContent = 'Niveau suivant';
    btn.disabled = true;
    btn.style.cssText = 'margin-top:8px;padding:6px 10px;border-radius:6px;border:none;background:#777;color:#fff;cursor:pointer;pointer-events:auto;';
    btn.addEventListener('click', () => {
        if (!btn.disabled && isEmbedded) window.parent.postMessage({ type: 'next_level' }, '*');
    });
    nextLevelButton = btn;
    panel.appendChild(btn);

    const speedWrapper = document.createElement('div');
    speedWrapper.style.marginTop = '8px';
    const speedLabel = document.createElement('div');
    speedLabel.textContent = 'Vitesse';
    speedLabel.style.cssText = 'font-size:12px;margin-bottom:6px;';
    const speedText = document.createElement('div');
    speedText.id = 'hud-speed-text';
    speedText.style.cssText = 'font-size:14px;font-weight:bold;';
    speedText.textContent = '0 km/h';
    speedWrapper.appendChild(speedLabel);
    speedWrapper.appendChild(speedText);
    panel.appendChild(speedWrapper);

    hud.appendChild(panel);
    if (gameContainer) {
        gameContainer.style.position = gameContainer.style.position || 'relative';
        gameContainer.appendChild(hud);
    } else {
        document.body.appendChild(hud);
    }
}

createHUD();

if (isEmbedded) {
    document.body.classList.add('embedded');
    ['boost-panel', 'items-panel'].forEach(cls => {
        const el = document.querySelector('.' + cls);
        if (el) el.style.display = 'none';
    });
    const timerBar = document.getElementById('container-timer');
    if (timerBar) timerBar.style.display = 'none';
}


// ============================================================
// 5. LUMIÈRES
// ============================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
const sunLight     = new THREE.DirectionalLight(0xffffff, 2.5);
const frontLight   = new THREE.DirectionalLight(0xffffff, 2.0);
const leftLight    = new THREE.DirectionalLight(0x6699ff, 1.0);
const rightLight   = new THREE.DirectionalLight(0x6699ff, 1.0);

sunLight.position.set(0, 100, 0);
frontLight.position.set(0, 50, -100);
leftLight.position.set(-50, 30, 0);
rightLight.position.set(50, 30, 0);

scene.add(ambientLight, sunLight, frontLight, leftLight, rightLight);


// ============================================================
// 6. ROUTE & DÉCOR
// ============================================================
const roadGeometry  = new THREE.PlaneGeometry(60, config.roadLength);
const roadMaterial  = new THREE.MeshPhongMaterial({ color: 0x444444 });
const road          = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x     = -Math.PI / 2;
road.position.z     = -config.roadLength / 2;
scene.add(road);

const roadHalfWidth = roadGeometry.parameters.width / 2;
const SIDE_MARGIN   = 1.5;
const ACTOR_WIDTH   = 2;
const TRACK_MIN_X   = -roadHalfWidth + SIDE_MARGIN + ACTOR_WIDTH;
const TRACK_MAX_X   =  roadHalfWidth - SIDE_MARGIN - ACTOR_WIDTH;

function getRandomTrackX() {
    return Math.random() * (TRACK_MAX_X - TRACK_MIN_X) + TRACK_MIN_X;
}

const edgeGeometry = new THREE.BoxGeometry(1.2, 1.5, config.roadLength);
const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
const leftEdge     = new THREE.Mesh(edgeGeometry, edgeMaterial);
const rightEdge    = new THREE.Mesh(edgeGeometry, edgeMaterial);
leftEdge.position.set(-roadHalfWidth + 0.6,  0.75, -config.roadLength / 2);
rightEdge.position.set( roadHalfWidth - 0.6, 0.75, -config.roadLength / 2);
scene.add(leftEdge, rightEdge);

new THREE.TextureLoader().load(
    '/texture_sol.jpg',
    (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 10);
        roadMaterial.map   = texture;
        roadMaterial.color.set(0xffffff);
        roadMaterial.needsUpdate = true;
    },
    undefined,
    () => console.warn('Texture de route non chargée, couleur par défaut utilisée')
);


// ============================================================
// 7. JOUEUR
// ============================================================
let playerBike   = null;
const PLAYER_START_Z = 20;

function onPlayerReady() {
    gameState.isReady = true;
    const loadingScreen = getEl("loading-message");
    if (loadingScreen) loadingScreen.style.display = "none";
}

function setupPlayerFromScene(sceneObj) {
    playerBike = sceneObj;

    if (difficulty === 2) {
        playerBike.position.set(0, 0, 0);
        playerBike.rotation.set(0, 0, 0);
        playerBike.scale.set(1, 1, 1);

        const bbox = new THREE.Box3().setFromObject(playerBike);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        const factor = size.y > 0.001 ? (4.0 / size.y) * 1.5 : 0.6;
        playerBike.scale.setScalar(factor);

        const bbox2  = new THREE.Box3().setFromObject(playerBike);
        playerBike.position.set(0, 1.5 - bbox2.min.y, PLAYER_START_Z);
        playerBike.rotation.y = 11 + Math.PI / 2;

        cameraOffset.default.set(-2, 9, 36);
        cameraOffset.boost.set(0, 16, 44);
        cameraOffset.brake.set(0, 8, 22);
        cameraOffset.current.copy(cameraOffset.default);
        cameraOffset.target.copy(cameraOffset.default);
    } else {
        playerBike.scale.set(4, 4, 4);
        playerBike.position.set(0, 11, PLAYER_START_Z);
        playerBike.rotation.y = 11;
    }

    scene.add(playerBike);
    onPlayerReady();
}

function createPlayer() {
    const truckCandidates = [
        'assets/models/camion.gltf',         'assets/models/camion/camion.gltf',
        'assets/models/camion.glb',           'assets/models/camion/camion.glb',
        '/game/assets/models/camion.gltf',    '/game/assets/models/camion/camion.gltf',
        '/game/assets/models/camion.glb',     '/game/assets/models/camion/camion.glb',
        'game/assets/models/camion.gltf',     'game/assets/models/camion/camion.gltf',
        'game/assets/models/camion.glb',      'game/assets/models/camion/camion.glb',
    ];

    const bikeCandidates = [
        'assets/models/akira_bike.glb',       'assets/models/akira_bike.gltf',
        '/game/assets/models/akira_bike.glb', '/game/assets/models/akira_bike.gltf',
        'game/assets/models/akira_bike.glb',  'game/assets/models/akira_bike.gltf',
    ];

    const candidates = difficulty === 2 ? truckCandidates : bikeCandidates;

    loadGLTFWithCandidates(candidates)
        .then(({ gltf, path }) => {
            const obj = gltf.scene || gltf.scenes?.[0];
            if (obj) { console.log('Modèle chargé :', path); setupPlayerFromScene(obj); }
            else     { console.warn('GLTF sans scène :', path); fallbackToCube(); }
        })
        .catch(() => fallbackToCube());

    setTimeout(() => {
        if (!gameState.isReady) fallbackToCube();
    }, 2500);
}

function fallbackToCube() {
    if (gameState.isReady) return; 
    const size   = difficulty === 2 ? 6 : 4;
    const posY   = difficulty === 2 ? 7 : 5;
    playerBike   = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshPhongMaterial({ color: 0x00ffff })
    );
    playerBike.position.set(0, posY, PLAYER_START_Z);
    scene.add(playerBike);
    console.warn('Fallback cube utilisé pour le joueur');
    onPlayerReady();
}


// ============================================================
// 8. ENNEMIS
// ============================================================
const enemies = [];
const enemyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 1 });
const enemyGeometry = new THREE.BoxGeometry(4, 4, 4);

for (let i = 0; i < config.maxEnemies; i++) {
    const enemy    = new THREE.Mesh(enemyGeometry, enemyMaterial.clone()); 
    const spacing  = config.roadLength / Math.max(1, config.maxEnemies);
    enemy.position.set(
        getRandomTrackX(),
        2,
        -120 - (i * spacing) - Math.random() * 80
    );
    scene.add(enemy);
    enemies.push(enemy);
}


// ============================================================
// 9. ITEMS À COLLECTER
// ============================================================
const collectibles = [];
const itemGeometry = new THREE.SphereGeometry(1, 16, 16);
const itemMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

for (let i = 0; i < config.itemCount; i++) {
    const item    = new THREE.Mesh(itemGeometry, itemMaterial.clone());
    const spacing = (config.roadLength - 220) / Math.max(1, config.itemCount);
    item.position.set(
        getRandomTrackX(),
        1,
        -180 - i * spacing - Math.random() * 40
    );
    item.userData.isPlaceholder = true;
    item.userData.collected     = false;
    scene.add(item);
    collectibles.push(item);
}

function tryLoadItemModel() {
    const candidates = [
        'assets/models/main/Main_item.gltf',   'assets/models/Main_item.gltf',
        'assets/models/main.gltf',             'assets/models/main/main.gltf',
        'assets/models/main.glb',              'assets/models/main/Main_item.glb',
        'assets/models/main/main.glb',         'assets/models/Main_item.glb',
        '/assets/models/main/Main_item.gltf',  '/assets/models/Main_item.gltf',
        '/assets/models/main.gltf',            '/assets/models/main/main.gltf',
        '/assets/models/main.glb',
        'game/assets/models/main/Main_item.gltf', 'game/assets/models/Main_item.gltf',
        '/game/assets/models/main/Main_item.gltf', '/game/assets/models/Main_item.gltf',
        'game/assets/models/main.gltf',           '/game/assets/models/main.gltf',
    ];

    loadGLTFWithCandidates(candidates)
        .then(({ gltf, path }) => {
            const base = gltf.scene || gltf.scenes?.[0];
            if (!base) { console.warn('GLTF item sans scène :', path); return; }

            const tmpBox  = new THREE.Box3().setFromObject(base);
            const tmpSize = new THREE.Vector3();
            tmpBox.getSize(tmpSize);
            const scaleFactor = tmpSize.y > 0.0001 ? 1.2 / tmpSize.y : 1;

            collectibles.forEach((placeholder, idx) => {
                if (!placeholder.userData.isPlaceholder) return;
                const clone = base.clone(true);
                clone.scale.multiplyScalar(scaleFactor);
                const newBox = new THREE.Box3().setFromObject(clone);
                clone.position.copy(placeholder.position);
                clone.position.y -= newBox.min.y;
                clone.userData.collected = false;
                placeholder.visible = false;
                scene.add(clone);
                collectibles[idx] = clone;
            });
        })
        .catch(() => {});
}
tryLoadItemModel();


// ============================================================
// 10. CONTRÔLES CLAVIER
// ============================================================
const BLOCKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Shift'];

window.addEventListener('keydown', (e) => {
    if (BLOCKED_KEYS.includes(e.key)) { e.preventDefault(); e.stopPropagation(); }
    gameState.keysPressed[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (BLOCKED_KEYS.includes(e.key)) { e.preventDefault(); e.stopPropagation(); }
    gameState.keysPressed[e.key] = false;
});


// ============================================================
// 11. PHYSIQUE & MOUVEMENT
// ============================================================
const cameraOffset = {
    default: new THREE.Vector3(-2, 5, 30),
    boost:   new THREE.Vector3(0, 12, 40),
    brake:   new THREE.Vector3(0,  6, 18),
    current: new THREE.Vector3(-2, 5, 30),
    target:  new THREE.Vector3(-2, 5, 30),
};

const cameraRoll    = { current: 0, target: 0 };
let   lateralSpeed  = 0;
const bikeRotation  = { current: 11, target: 11, neutral: 11 };

const TARGET_FPS     = 60;
const FRAME_DURATION = 1000 / TARGET_FPS;
let lastFrameTime    = 0;
let animationFrameId = null;

// L'ORIGINALE : On recrée la Box3 à chaque frame comme avant.
const playerCollisionBox = new THREE.Box3();

const LATERAL_FRICTION       = 0.85;
const LEAN_AMOUNT            = 0.5;
const ROTATION_INTERP        = 0.06;
const MAX_ROTATION_PER_FRAME = 0.6;
const MAX_LEAN_Z             = 0.35;
const CAMERA_LERP_SPEED      = 0.08;
const CAMERA_ROLL_SPEED      = 0.1;
const CAMERA_ROLL_AMOUNT     = 0.06;


// ============================================================
// 12. FONCTIONS UTILITAIRES ET COLLISION (RESTAURÉES)
// ============================================================

// RESTAURÉ COMME DANS TON CODE ORIGINAL
function getPlayerCollisionData(player) {
    playerCollisionBox.setFromObject(player);
    const cx = (playerCollisionBox.min.x + playerCollisionBox.max.x) / 2;
    const cz = (playerCollisionBox.min.z + playerCollisionBox.max.z) / 2;
    const w  = playerCollisionBox.max.x - playerCollisionBox.min.x;
    const d  = playerCollisionBox.max.z - playerCollisionBox.min.z;
    return { x: cx, z: cz, radius: THREE.MathUtils.clamp(Math.min(w, d) * 0.35, 1.2, 2.2) };
}

// RESTAURÉ COMME DANS TON CODE ORIGINAL
function dist2D(ax, az, bx, bz) {
    const dx = ax - bx, dz = az - bz;
    return Math.sqrt(dx * dx + dz * dz);
}

// RESTAURÉ COMME DANS TON CODE ORIGINAL
function isCollidingWithItem(playerData, item) {
    return dist2D(item.position.x, item.position.z, playerData.x, playerData.z) < (playerData.radius + 1.2);
}

// RESTAURÉ COMME DANS TON CODE ORIGINAL
function isCollidingWithEnemy(playerData, enemy) {
    return dist2D(enemy.position.x, enemy.position.z, playerData.x, playerData.z) < (playerData.radius + 2.0);
}

// --- Mise à jour UI OPTIMISÉE ---

function updateHealthUI() {
    const pct = Math.floor((gameState.playerHealth / config.maxHealth) * 100);
    
    // Anti-spam Iframe
    if (lastPostValues.health === pct) return;
    lastPostValues.health = pct;

    const healthBar = getEl("timer");
    const healthTxt = getEl("health-value");
    if (healthBar) {
        healthBar.style.width      = pct + "%";
        healthBar.style.background = pct > 60 ? "#00ffff" : pct > 30 ? "#ffaa00" : "#ff0033";
    }
    if (healthTxt) healthTxt.textContent = pct;
    
    if (isEmbedded) window.parent.postMessage({ type: 'game_health', percent: pct }, '*');
}

function updateBoostUI(currentTime) {
    const elapsed = currentTime - gameState.boostUsedAt;
    let pct, statusText, statusColor, statusId;

    if (gameState.boostActive) {
        pct         = Math.max(0, 100 - ((currentTime - gameState.boostStartedAt) / config.boostDuration) * 100);
        statusText  = 'ACTIF!';
        statusColor = '#ff0055';
        statusId    = 'active';
    } else if (gameState.boostReady) {
        pct         = 100;
        statusText  = 'PRÊT (SHIFT)';
        statusColor = '#00ff00';
        statusId    = 'ready';
    } else {
        pct         = Math.min(100, (elapsed / config.boostCooldown) * 100);
        statusText  = 'CHARGEMENT...';
        statusColor = '#00ffff';
        statusId    = 'charging';
    }

    const roundedPct = Math.round(pct);

    // Anti-spam Iframe
    if (isEmbedded && (lastPostValues.boostStatus !== statusId || Math.abs(lastPostValues.boostPct - roundedPct) > 2)) {
        window.parent.postMessage({ type: 'game_boost', status: statusId, percent: roundedPct }, '*');
        lastPostValues.boostStatus = statusId;
        lastPostValues.boostPct = roundedPct;
    }

    const boostBar    = getEl('boost-bar');
    const boostStatus = getEl('boost-status');
    if (boostBar)    { boostBar.style.width = roundedPct + '%'; boostBar.style.background = statusColor; }
    if (boostStatus) { boostStatus.textContent = statusText; boostStatus.style.color = statusColor; }
}

function updateSpeedUI() {
    const kmh = Math.round((gameState.currentSpeed || 0) * 80);
    
    // Anti-spam Iframe
    if (lastPostValues.speed === kmh) return;
    lastPostValues.speed = kmh;

    const el  = getEl('hud-speed-text');
    if (el) el.textContent = kmh + ' km/h';
    if (isEmbedded) window.parent.postMessage({ type: 'game_speed', speed: kmh }, '*');
}

function updateRaceProgressUI(percent) {
    const rounded = Math.round(percent);
    
    // Anti-spam Iframe
    if (lastPostValues.progress !== rounded) {
        lastPostValues.progress = rounded;
        const bar  = getEl('hud-progress-bar');
        const text = getEl('hud-progress-text');
        if (bar)  bar.style.width  = rounded + '%';
        if (text) text.textContent = rounded + '%';
        if (isEmbedded) window.parent.postMessage({ type: 'race_progress', percent: rounded }, '*');
    }

    const itemPct  = Math.min(100, Math.round((gameState.itemsCollected / config.itemCount) * 100));
    const itemsBar = getEl('hud-items-bar');
    const itemsTxt = getEl('hud-items-text');
    if (itemsBar)  itemsBar.style.width  = itemPct + '%';
    if (itemsTxt)  itemsTxt.textContent  = gameState.itemsCollected + ' / ' + config.itemCount;
}

function showGameOver() {
    const el = getEl("game-over");
    if (el) el.style.display = "block";
    if (isEmbedded) {
        window.parent.postMessage({ type: 'game_over', difficulty, collected: gameState.itemsCollected, total: config.itemCount }, '*');
    }
}

function showVictory() {
    const el = getEl("victory-screen");
    if (el) el.style.display = "block";

    if (nextLevelButton) {
        const pct    = Math.round((gameState.itemsCollected / config.itemCount) * 100);
        const canGo  = pct >= 70;
        nextLevelButton.disabled         = !canGo;
        nextLevelButton.style.background = canGo ? '#1e88e5' : '#777';
    }

    if (isEmbedded) {
        const pct = Math.round((gameState.itemsCollected / config.itemCount) * 100);
        window.parent.postMessage({
            type: 'game_victory', difficulty,
            collected: gameState.itemsCollected, total: config.itemCount,
            itemsPercent: pct, eligibleNextLevel: pct >= 70,
        }, '*');
    }
}


// ============================================================
// 13. BOUCLE PRINCIPALE
// ============================================================

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

function handlePlayerMovement() {
    const keys  = gameState.keysPressed;
    let speed   = config.bikeSpeed;
    if (gameState.boostActive) speed *= config.boostMultiplier;
    if (keys['ArrowUp'])       speed += 1.2;
    if (keys['ArrowDown'])     speed -= 1.0;
    playerBike.position.z  -= speed;
    gameState.currentSpeed  = Math.max(0, speed);

    if      (keys['ArrowLeft'])  { lateralSpeed -= config.bikeLateralSpeed * 0.35; bikeRotation.target = bikeRotation.neutral + LEAN_AMOUNT; }
    else if (keys['ArrowRight']) { lateralSpeed += config.bikeLateralSpeed * 0.35; bikeRotation.target = bikeRotation.neutral - LEAN_AMOUNT; }
    else                         { bikeRotation.target = bikeRotation.neutral; }

    lateralSpeed            *= LATERAL_FRICTION;
    playerBike.position.x  += lateralSpeed;

    if (playerBike.position.x < TRACK_MIN_X) { playerBike.position.x = TRACK_MIN_X; if (lateralSpeed < 0) lateralSpeed = 0; }
    if (playerBike.position.x > TRACK_MAX_X) { playerBike.position.x = TRACK_MAX_X; if (lateralSpeed > 0) lateralSpeed = 0; }

    const rawDelta    = (bikeRotation.target - bikeRotation.current) * ROTATION_INTERP;
    bikeRotation.current += THREE.MathUtils.clamp(rawDelta, -MAX_ROTATION_PER_FRAME, MAX_ROTATION_PER_FRAME);

    if (difficulty === 2) {
        playerBike.rotation.y = 11 + Math.PI / 2 + (bikeRotation.current - bikeRotation.neutral) * 0.2;
    } else {
        playerBike.rotation.y = bikeRotation.current;
    }

    playerBike.rotation.z = THREE.MathUtils.clamp(lateralSpeed * 0.06, -MAX_LEAN_Z, MAX_LEAN_Z);
}

function handleCamera() {
    const keys = gameState.keysPressed;

    if      (keys['ArrowUp'])    cameraOffset.target.copy(cameraOffset.boost);
    else if (keys['ArrowDown'])  cameraOffset.target.copy(cameraOffset.brake);
    else                         cameraOffset.target.copy(cameraOffset.default);

    if      (keys['ArrowLeft'])  cameraRoll.target =  CAMERA_ROLL_AMOUNT;
    else if (keys['ArrowRight']) cameraRoll.target = -CAMERA_ROLL_AMOUNT;
    else                         cameraRoll.target =  0;

    cameraRoll.current += (cameraRoll.target - cameraRoll.current) * CAMERA_ROLL_SPEED;
    cameraOffset.current.lerp(cameraOffset.target, CAMERA_LERP_SPEED);

    camera.position.copy(playerBike.position).add(cameraOffset.current);
    camera.lookAt(playerBike.position);
    camera.rotation.z = cameraRoll.current;

    frontLight.position.set(playerBike.position.x, 50,  playerBike.position.z - 100);
    sunLight.position.set(  playerBike.position.x, 100, playerBike.position.z - 50);
}

function handleCollectibles(playerData) {
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        if (!item.visible || item.userData.collected) continue;

        if (isCollidingWithItem(playerData, item)) {
            item.visible            = false;
            item.userData.collected = true;
            gameState.itemsCollected++;

            const itemCounter = getSel(".item-got");
            if (itemCounter) itemCounter.innerHTML = gameState.itemsCollected;

            if (isEmbedded) {
                // ATTENTION: C'est LE message qui te fait laguer, s'il freeze encore un peu à la prise de l'item, 
                // c'est parce que ton site web (le parent) doit faire de gros calculs React/Vuejs pour actualiser l'interface.
                window.parent.postMessage({
                    type: 'game_progress', difficulty,
                    collected: gameState.itemsCollected, total: config.itemCount,
                }, '*');
            }
        }
    }
}

function handleEnemies(playerData) {
    if (gameState.playerHealth <= 0) return;

    enemies.forEach(enemy => {
        enemy.position.z += config.enemyMoveSpeed;
        enemy.material.opacity = enemy.position.z > playerBike.position.z ? 0.4 : 1;

        if (isCollidingWithEnemy(playerData, enemy)) {
            gameState.playerHealth = Math.max(0, gameState.playerHealth - 10);
            updateHealthUI();
            enemy.position.z      -= 200; 
            enemy.material.color.setHex(0xff0000); 
        } else {
            enemy.material.color.setHex(0xffffff); 
        }

        if (enemy.position.z > playerBike.position.z + 50) {
            const newZ = playerBike.position.z - 220 - Math.random() * 320;
            if (newZ > -config.roadLength) {
                enemy.position.set(getRandomTrackX(), 2, newZ);
                enemy.material.opacity = 1;
            }
        }
    });
}

function calculateRaceProgress() {
    const travelled = Math.max(0, PLAYER_START_Z - playerBike.position.z);
    const total     = Math.max(1, PLAYER_START_Z + config.roadLength);
    return Math.min(100, (travelled / total) * 100);
}

const tick = () => {
    animationFrameId = requestAnimationFrame(tick);

    const now = performance.now();
    if (now - lastFrameTime < FRAME_DURATION) return;
    lastFrameTime = now;

    stats.begin();

    if (!gameState.isReady || !playerBike) {
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

    const playerData = getPlayerCollisionData(playerBike);
    handleCollectibles(playerData);
    handleEnemies(playerData);

    const racePercent = calculateRaceProgress();
    updateRaceProgressUI(racePercent);

    if (gameState.playerHealth <= 0 && !gameState.hasWon) {
        showGameOver();
        stats.end();
        return;
    }

    if (!gameState.hasWon && playerBike.position.z < -config.roadLength) {
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


// ============================================================
// 14. INITIALISATION
// ============================================================
function startGame() {
    createPlayer();
    if (!animationFrameId) tick();
}

if (isEmbedded) {
    window.addEventListener('message', (event) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;
        if      (data.type === 'start')   startGame();
        else if (data.type === 'restart') location.reload();
    });
} else {
    startGame();
}