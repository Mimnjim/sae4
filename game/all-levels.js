import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'stats.js';


// ============================================================
// 1. CONFIGURATION & DIFFICULTÉ
// Valeurs de base, puis on les écrase selon la difficulté
// passée en paramètre URL (?difficulty=1)
// ============================================================
const urlParams = new URLSearchParams(window.location.search);
const difficulty = parseInt(urlParams.get("difficulty")) || 1;

const config = {
    bikeSpeed:         1.0,
    bikeLateralSpeed:  0.3,
    maxEnemies:        10,
    enemyMoveSpeed:    -0.08,   // vitesse à laquelle les ennemis avancent vers le joueur
    playerHealth:      100,
    maxHealth:         100,
    roadLength:        500,
    boostMultiplier:   2.5,
    boostCooldown:     10000,   // ms avant que le boost soit rechargé
    boostDuration:     3000,    // ms pendant lesquelles le boost est actif
    itemCount:         6
};

switch (difficulty) {
    case 1: // Facile
        config.bikeSpeed        = 1.2;
        config.bikeLateralSpeed = 0.5;
        config.maxEnemies       = 25;
        config.playerHealth     = 120;
        config.maxHealth        = 120;
        config.roadLength       = 700;
        config.itemCount        = 8;
        break;
    case 2: // Normal
        config.bikeSpeed        = 1.8;
        config.bikeLateralSpeed = 0.5;
        config.maxEnemies       = 40;
        config.playerHealth     = 100;
        config.maxHealth        = 100;
        config.roadLength       = 1500;
        config.itemCount        = 15;
        break;
    case 3: // Difficile
        config.bikeSpeed        = 2.5;
        config.bikeLateralSpeed = 0.5;
        config.maxEnemies       = 60;
        config.playerHealth     = 80;
        config.maxHealth        = 80;
        config.roadLength       = 3000;
        config.itemCount        = 25;
        break;
}

// Prévenir la page parente (si le jeu est dans un iframe)
const isEmbedded = window.parent && window.parent !== window;
if (isEmbedded) {
    window.parent.postMessage({ type: 'game_init', difficulty, total: config.itemCount }, '*');
}


// ============================================================
// 2. ÉTAT DU JEU
// Un seul objet qui centralise tout ce qui change pendant la partie
// ============================================================
const gameState = {
    keysPressed:    {},
    playerHealth:   config.playerHealth,
    itemsCollected: 0,
    hasWon:         false,
    isReady:        false,  // devient true quand le modèle joueur est chargé

    boostReady:     false,
    boostActive:    false,
    boostUsedAt:    Date.now() - config.boostCooldown,  // on commence avec le boost dispo
    boostStartedAt: 0,
};


// ============================================================
// 3. SCÈNE, CAMÉRA, RENDERER
// ============================================================
const stats = new Stats();
stats.showPanel(0); // 0 = affiche le FPS

const gameContainer = document.getElementById("game-container");

// On attache le compteur FPS au bon conteneur
const statsParent = gameContainer || document.body;
stats.dom.style.position = "absolute";
stats.dom.style.top = "12px";
stats.dom.style.right = "12px";
statsParent.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3557);
scene.fog = new THREE.Fog(0x1d3557, 200, 800);

const camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 1000);
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

// Adapter le renderer quand la fenêtre est redimensionnée
function resizeRenderer() {
    const width  = (gameContainer ? gameContainer.clientWidth  : window.innerWidth)  || window.innerWidth;
    const height = (gameContainer ? gameContainer.clientHeight : window.innerHeight) || window.innerHeight;

    // On ne redimensionne que si c'est vraiment nécessaire
    const pixelWidth  = Math.floor(width  * window.devicePixelRatio);
    const pixelHeight = Math.floor(height * window.devicePixelRatio);
    const alreadyCorrectSize =
        renderer.domElement.width  === pixelWidth &&
        renderer.domElement.height === pixelHeight;

    if (!alreadyCorrectSize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

window.addEventListener('resize', resizeRenderer);
resizeRenderer(); // appel initial pour avoir la bonne taille dès le départ


// ============================================================
// 4. HUD EN JEU (affiché par-dessus le canvas)
// On crée les éléments DOM pour la progression et les items
// ============================================================
let nextLevelButton = null;

function createHUD() {
    const host = gameContainer || document.body;

    // Conteneur principal du HUD
    const hud = document.createElement('div');
    hud.id = 'in-game-hud';
    Object.assign(hud.style, {
        position:      'absolute',
        left:          '12px',
        bottom:        '12px',
        zIndex:        '9999',
        fontFamily:    'sans-serif',
        color:         '#ffffff',
        pointerEvents: 'none',
    });

    // Panneau de progression (fond semi-transparent)
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        width:         '220px',
        background:    'rgba(0,0,0,0.5)',
        padding:       '6px',
        borderRadius:  '6px',
        pointerEvents: 'auto',
    });

    panel.appendChild(createProgressBar({
        label:   'Progression',
        barId:   'hud-progress-bar',
        textId:  'hud-progress-text',
        color:   '#00ffcc',
        initial: '0%',
    }));

    panel.appendChild(createProgressBar({
        label:   'Objets',
        barId:   'hud-items-bar',
        textId:  'hud-items-text',
        color:   '#ffd54f',
        initial: '0 / ' + config.itemCount,
        topMargin: '10px',
    }));

    // Bouton "Niveau suivant" (désactivé par défaut, activé à la victoire si score suffisant)
    const btn = document.createElement('button');
    btn.id = 'next-level-btn';
    btn.textContent = 'Niveau suivant';
    btn.disabled = true;
    Object.assign(btn.style, {
        marginTop:     '8px',
        padding:       '6px 10px',
        borderRadius:  '6px',
        border:        'none',
        background:    '#777',
        color:         '#fff',
        cursor:        'pointer',
        pointerEvents: 'auto',
    });
    btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (isEmbedded) {
            window.parent.postMessage({ type: 'next_level' }, '*');
        }
    });

    nextLevelButton = btn;
    panel.appendChild(btn);
    hud.appendChild(panel);

    // Si le jeu est dans un iframe, le conteneur doit être en position relative
    if (gameContainer) {
        gameContainer.style.position = gameContainer.style.position || 'relative';
        gameContainer.appendChild(hud);
    } else {
        document.body.appendChild(hud);
    }
}

// Fonction helper pour créer une barre de progression réutilisable
function createProgressBar({ label, barId, textId, color, initial, topMargin = '0px' }) {
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = topMargin;

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    Object.assign(labelEl.style, { fontSize: '12px', marginBottom: '6px' });
    wrapper.appendChild(labelEl);

    const track = document.createElement('div');
    Object.assign(track.style, {
        width:        '200px',
        height:       '10px',
        background:   '#333',
        borderRadius: '6px',
        overflow:     'hidden',
    });

    const bar = document.createElement('div');
    bar.id = barId;
    Object.assign(bar.style, {
        height:     '100%',
        width:      '0%',
        background: color,
        transition: 'width 200ms linear',
    });

    track.appendChild(bar);
    wrapper.appendChild(track);

    const text = document.createElement('div');
    text.id = textId;
    Object.assign(text.style, { fontSize: '12px', marginTop: '6px' });
    text.textContent = initial;
    wrapper.appendChild(text);

    return wrapper;
}

createHUD();

// Masquer les panneaux internes si on est dans un iframe
// (la page parente a son propre HUD)
if (isEmbedded) {
    document.body.classList.add('embedded');
    const boostPanel = document.querySelector('.boost-panel');
    const itemsPanel = document.querySelector('.items-panel');
    const timerBar   = document.getElementById('container-timer');
    if (boostPanel) boostPanel.style.display = 'none';
    if (itemsPanel) itemsPanel.style.display = 'none';
    if (timerBar)   timerBar.style.display   = 'none';
}


// ============================================================
// 5. LUMIÈRES
// ============================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);

// Lumière principale (suit le joueur dans le tick)
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(0, 100, 0);
scene.add(sunLight);

// Lumière frontale (suit le joueur dans le tick)
const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
frontLight.position.set(0, 50, -100);
scene.add(frontLight);

// Lumières latérales bleutées (fixes)
const leftLight  = new THREE.DirectionalLight(0x6699ff, 1.0);
const rightLight = new THREE.DirectionalLight(0x6699ff, 1.0);
leftLight.position.set(-50, 30, 0);
rightLight.position.set(50, 30, 0);
scene.add(leftLight, rightLight);


// ============================================================
// 6. ROUTE & DÉCOR
// ============================================================

// Géométrie de la route (plan horizontal)
const roadGeometry = new THREE.PlaneGeometry(60, config.roadLength);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x  = -Math.PI / 2;
road.position.z  = -config.roadLength / 2;
scene.add(road);

// Limites de déplacement latéral (partagées par joueur, ennemis et items)
const roadHalfWidth = roadGeometry.parameters.width / 2;
const SIDE_MARGIN   = 1.5;  // marge par rapport au bord de la route
const ACTOR_WIDTH   = 2;    // demi-largeur d'un acteur (joueur ou ennemi)
const TRACK_MIN_X   = -roadHalfWidth + SIDE_MARGIN + ACTOR_WIDTH;
const TRACK_MAX_X   =  roadHalfWidth - SIDE_MARGIN - ACTOR_WIDTH;

function getRandomTrackX() {
    return Math.random() * (TRACK_MAX_X - TRACK_MIN_X) + TRACK_MIN_X;
}

// Bordures de la route
const edgeGeometry = new THREE.BoxGeometry(1.2, 1.5, config.roadLength);
const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
const leftEdge  = new THREE.Mesh(edgeGeometry, edgeMaterial);
const rightEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
leftEdge.position.set( -roadHalfWidth + 0.6, 0.75, -config.roadLength / 2);
rightEdge.position.set( roadHalfWidth - 0.6, 0.75, -config.roadLength / 2);
scene.add(leftEdge, rightEdge);

// Texture de la route (chargée en asynchrone, la route grise s'affiche en attendant)
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    '/texture_sol.jpg',
    (texture) => {
        texture.colorSpace  = THREE.SRGBColorSpace;
        texture.wrapS       = THREE.RepeatWrapping;
        texture.wrapT       = THREE.RepeatWrapping;
        texture.repeat.set(2, 10);
        roadMaterial.map    = texture;
        roadMaterial.color.set(0xffffff);
        roadMaterial.needsUpdate = true;
    },
    undefined,
    () => console.warn('Texture de route non chargée, affichage de la couleur par défaut')
);


// ============================================================
// 7. JOUEUR
// ============================================================
let playerBike = null;
const PLAYER_START_Z = 20;

function createPlayer() {
    const loader = new GLTFLoader();
    loader.load(
        'assets/models/akira_bike.glb',
        (gltf) => {
            playerBike = gltf.scene;
            playerBike.scale.set(4, 4, 4);
            playerBike.position.set(0, 11, PLAYER_START_Z);
            playerBike.rotation.y = 11;
            scene.add(playerBike);
            onPlayerReady();
        },
        undefined,
        // Si le modèle ne charge pas, on utilise un cube de remplacement
        () => {
            const geometry = new THREE.BoxGeometry(4, 4, 4);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
            playerBike = new THREE.Mesh(geometry, material);
            playerBike.position.set(0, 5, PLAYER_START_Z);
            scene.add(playerBike);
            onPlayerReady();
        }
    );
}

function onPlayerReady() {
    gameState.isReady = true;
    const loadingScreen = document.getElementById("loading-message");
    if (loadingScreen) loadingScreen.style.display = "none";
}


// ============================================================
// 8. ENNEMIS
// ============================================================
const enemies = [];

function spawnEnemy(index) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 1 });
    const enemy    = new THREE.Mesh(geometry, material);

    const spacing  = config.roadLength / Math.max(1, config.maxEnemies);
    enemy.position.set(
        getRandomTrackX(),
        2,
        -120 - (index * spacing) - Math.random() * 80
    );

    scene.add(enemy);
    enemies.push(enemy);
}

for (let i = 0; i < config.maxEnemies; i++) {
    spawnEnemy(i);
}


// ============================================================
// 9. ITEMS À COLLECTER
// ============================================================
const collectibles = [];

for (let i = 0; i < config.itemCount; i++) {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const item     = new THREE.Mesh(geometry, material);

    const spacing  = (config.roadLength - 220) / Math.max(1, config.itemCount);
    item.position.set(
        getRandomTrackX(),
        1,
        -180 - i * spacing - Math.random() * 40
    );

    scene.add(item);
    collectibles.push(item);
}


// ============================================================
// 10. CONTRÔLES CLAVIER
// ============================================================
const BLOCKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Shift'];

window.addEventListener('keydown', (e) => {
    // Empêche les touches de direction de faire défiler la page parente
    if (BLOCKED_KEYS.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
    }
    gameState.keysPressed[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (BLOCKED_KEYS.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
    }
    gameState.keysPressed[e.key] = false;
});


// ============================================================
// 11. PHYSIQUE & MOUVEMENT (variables d'état)
// Ces variables gardent en mémoire l'état entre chaque frame
// ============================================================

// Offsets de caméra selon l'état (normal, boost, freinage)
const cameraOffset = {
    default: new THREE.Vector3(-2, 5, 30),
    boost:   new THREE.Vector3(0, 12, 40),
    brake:   new THREE.Vector3(0,  6, 18),
    current: new THREE.Vector3(-2, 5, 30),  // interpolée vers target chaque frame
    target:  new THREE.Vector3(-2, 5, 30),
};

// Inclinaison (roulis) de la caméra dans les virages
const cameraRoll = { current: 0, target: 0 };

// Vitesse latérale du joueur (accumulée puis freinée)
let lateralSpeed = 0;

// Rotation de la moto (inclinaison dans les virages)
const bikeRotation = {
    current: 11,
    target:  11,
    neutral: 11,
};

// Contrôle du framerate cible
const TARGET_FPS      = 60;
const FRAME_DURATION  = 1000 / TARGET_FPS;
let lastFrameTime     = 0;
let animationFrameId  = null;

// Boîte de collision réutilisée (évite de la recréer à chaque frame)
const playerCollisionBox = new THREE.Box3();

// Constantes de tuning pour le mouvement
const LATERAL_FRICTION      = 0.85;   // ralentissement latéral à chaque frame
const LEAN_AMOUNT            = 0.5;   // combien la moto penche dans un virage
const ROTATION_INTERP        = 0.06;  // vitesse d'interpolation de la rotation
const MAX_ROTATION_PER_FRAME = 0.6;   // évite les rotations trop brusques
const MAX_LEAN_Z             = 0.35;  // inclinaison max sur l'axe Z
const CAMERA_LERP_SPEED      = 0.08;  // vitesse d'interpolation de la caméra
const CAMERA_ROLL_SPEED      = 0.1;
const CAMERA_ROLL_AMOUNT     = 0.06;


// ============================================================
// 12. FONCTIONS UTILITAIRES
// ============================================================

// --- Collisions ---

function getPlayerCollisionData(player) {
    playerCollisionBox.setFromObject(player);

    const centerX = (playerCollisionBox.min.x + playerCollisionBox.max.x) / 2;
    const centerZ = (playerCollisionBox.min.z + playerCollisionBox.max.z) / 2;
    const width   = playerCollisionBox.max.x - playerCollisionBox.min.x;
    const depth   = playerCollisionBox.max.z - playerCollisionBox.min.z;

    // Rayon basé sur la vraie taille du modèle, avec des limites min/max
    const radius = THREE.MathUtils.clamp(Math.min(width, depth) * 0.35, 1.2, 2.2);

    return { x: centerX, z: centerZ, radius };
}

function isCollidingWithItem(playerData, item) {
    const ITEM_RADIUS = 1.2;
    const dx = item.position.x - playerData.x;
    const dz = item.position.z - playerData.z;
    return Math.sqrt(dx * dx + dz * dz) < (playerData.radius + ITEM_RADIUS);
}

function isCollidingWithEnemy(playerData, enemy) {
    const ENEMY_RADIUS = 2.0;
    const dx = enemy.position.x - playerData.x;
    const dz = enemy.position.z - playerData.z;
    return Math.sqrt(dx * dx + dz * dz) < (playerData.radius + ENEMY_RADIUS);
}

// --- Mise à jour des UI ---

function updateHealthUI() {
    const healthPercent = (gameState.playerHealth / config.maxHealth) * 100;
    const healthBar     = document.getElementById("timer");
    const healthText    = document.getElementById("health-value");

    if (healthBar) {
        healthBar.style.width = healthPercent + "%";
        healthBar.style.background =
            healthPercent > 60 ? "#00ffff" :
            healthPercent > 30 ? "#ffaa00" : "#ff0033";
    }
    if (healthText) {
        healthText.textContent = Math.floor(healthPercent);
    }

    if (isEmbedded) {
        window.parent.postMessage({ type: 'game_health', percent: Math.floor(healthPercent) }, '*');
    }
}

function updateBoostUI(currentTime) {
    const boostBar    = document.getElementById('boost-bar');
    const boostStatus = document.getElementById('boost-status');
    if (!boostBar || !boostStatus) return;

    const timeSinceLastBoost = currentTime - gameState.boostUsedAt;

    if (gameState.boostActive) {
        const boostProgress = ((currentTime - gameState.boostStartedAt) / config.boostDuration) * 100;
        boostBar.style.width      = (100 - boostProgress) + '%';
        boostBar.style.background = '#ff0055';
        boostStatus.textContent   = 'ACTIF!';
        boostStatus.style.color   = '#ff0055';
    } else if (gameState.boostReady) {
        boostBar.style.width      = '100%';
        boostBar.style.background = '#00ff00';
        boostStatus.textContent   = 'PRÊT (SHIFT)';
        boostStatus.style.color   = '#00ff00';
    } else {
        const chargePercent       = (timeSinceLastBoost / config.boostCooldown) * 100;
        boostBar.style.width      = chargePercent + '%';
        boostBar.style.background = '#00ffff';
        boostStatus.textContent   = 'CHARGEMENT...';
        boostStatus.style.color   = '#00ffff';
    }

    if (isEmbedded) {
        const boostPercent = gameState.boostActive
            ? Math.max(0, 100 - ((currentTime - gameState.boostStartedAt) / config.boostDuration) * 100)
            : gameState.boostReady ? 100
            : Math.min(100, (timeSinceLastBoost / config.boostCooldown) * 100);

        window.parent.postMessage({
            type:    'game_boost',
            status:  gameState.boostActive ? 'active' : (gameState.boostReady ? 'ready' : 'charging'),
            percent: Math.round(boostPercent),
        }, '*');
    }
}

function updateRaceProgressUI(percent) {
    const bar  = document.getElementById('hud-progress-bar');
    const text = document.getElementById('hud-progress-text');
    if (bar)  bar.style.width    = percent + '%';
    if (text) text.textContent   = Math.round(percent) + '%';

    const itemsCollected  = gameState.itemsCollected;
    const itemsBar        = document.getElementById('hud-items-bar');
    const itemsText       = document.getElementById('hud-items-text');
    const itemPercent     = Math.min(100, Math.round((itemsCollected / config.itemCount) * 100));
    if (itemsBar)  itemsBar.style.width  = itemPercent + '%';
    if (itemsText) itemsText.textContent = itemsCollected + ' / ' + config.itemCount;

    if (isEmbedded) {
        window.parent.postMessage({ type: 'race_progress', percent: Math.round(percent) }, '*');
    }
}

// --- Fin de partie ---

function showGameOver() {
    const gameOverDiv = document.getElementById("game-over");
    if (gameOverDiv) gameOverDiv.style.display = "block";

    if (isEmbedded) {
        window.parent.postMessage({
            type:      'game_over',
            difficulty,
            collected: gameState.itemsCollected,
            total:     config.itemCount,
        }, '*');
    }
}

function showVictory() {
    const victoryDiv = document.getElementById("victory-screen");
    if (victoryDiv) victoryDiv.style.display = "block";

    // Le bouton "niveau suivant" n'est activé que si le joueur a collecté ≥70% des items
    if (nextLevelButton) {
        const collectedPercent = Math.round((gameState.itemsCollected / config.itemCount) * 100);
        const canGoNext        = collectedPercent >= 70;
        nextLevelButton.disabled          = !canGoNext;
        nextLevelButton.style.background  = canGoNext ? '#1e88e5' : '#777';
    }

    if (isEmbedded) {
        const collectedPercent = Math.round((gameState.itemsCollected / config.itemCount) * 100);
        window.parent.postMessage({
            type:              'game_victory',
            difficulty,
            collected:         gameState.itemsCollected,
            total:             config.itemCount,
            itemsPercent:      collectedPercent,
            eligibleNextLevel: collectedPercent >= 70,
        }, '*');
    }
}


// ============================================================
// 13. BOUCLE PRINCIPALE (tick)
// Appelée ~60 fois par seconde.
// On la découpe en sous-fonctions pour que ce soit lisible.
// ============================================================

function handleBoost(currentTime) {
    const timeSinceLastBoost = currentTime - gameState.boostUsedAt;

    // Le boost se recharge après le cooldown
    if (!gameState.boostActive && timeSinceLastBoost >= config.boostCooldown) {
        gameState.boostReady = true;
    }

    // Shift déclenche le boost s'il est prêt
    if (gameState.keysPressed['Shift'] && gameState.boostReady && !gameState.boostActive) {
        gameState.boostActive    = true;
        gameState.boostReady     = false;
        gameState.boostStartedAt = currentTime;
        gameState.boostUsedAt    = currentTime;
    }

    // Le boost s'arrête après sa durée
    if (gameState.boostActive && (currentTime - gameState.boostStartedAt) >= config.boostDuration) {
        gameState.boostActive = false;
    }
}

function handlePlayerMovement() {
    const keys = gameState.keysPressed;

    // Vitesse avant/arrière
    let speed = config.bikeSpeed;
    if (gameState.boostActive)   speed *= config.boostMultiplier;
    if (keys['ArrowUp'])         speed += 1.2;
    if (keys['ArrowDown'])       speed -= 1.0;
    playerBike.position.z -= speed;

    // Mouvement latéral (avec accélération/friction)
    if (keys['ArrowLeft']) {
        lateralSpeed -= config.bikeLateralSpeed * 0.35;
        bikeRotation.target = bikeRotation.neutral + LEAN_AMOUNT;
    } else if (keys['ArrowRight']) {
        lateralSpeed += config.bikeLateralSpeed * 0.35;
        bikeRotation.target = bikeRotation.neutral - LEAN_AMOUNT;
    } else {
        bikeRotation.target = bikeRotation.neutral;
    }

    lateralSpeed *= LATERAL_FRICTION;
    playerBike.position.x += lateralSpeed;

    // Contraindre le joueur dans les limites de la route
    if (playerBike.position.x < TRACK_MIN_X) {
        playerBike.position.x = TRACK_MIN_X;
        if (lateralSpeed < 0) lateralSpeed = 0;
    }
    if (playerBike.position.x > TRACK_MAX_X) {
        playerBike.position.x = TRACK_MAX_X;
        if (lateralSpeed > 0) lateralSpeed = 0;
    }

    // Rotation de la moto (interpolation douce pour éviter les saccades)
    const rawDelta     = (bikeRotation.target - bikeRotation.current) * ROTATION_INTERP;
    const clampedDelta = THREE.MathUtils.clamp(rawDelta, -MAX_ROTATION_PER_FRAME, MAX_ROTATION_PER_FRAME);
    bikeRotation.current += clampedDelta;
    playerBike.rotation.y = bikeRotation.current;

    // Légère inclinaison sur l'axe Z selon la vitesse latérale
    playerBike.rotation.z = THREE.MathUtils.clamp(lateralSpeed * 0.06, -MAX_LEAN_Z, MAX_LEAN_Z);
}

function handleCamera() {
    const keys = gameState.keysPressed;

    // Choisir l'offset cible selon l'état
    if (keys['ArrowUp']) {
        cameraOffset.target.copy(cameraOffset.boost);
    } else if (keys['ArrowDown']) {
        cameraOffset.target.copy(cameraOffset.brake);
    } else {
        cameraOffset.target.copy(cameraOffset.default);
    }

    // Roulis de caméra dans les virages
    if      (keys['ArrowLeft'])  cameraRoll.target =  CAMERA_ROLL_AMOUNT;
    else if (keys['ArrowRight']) cameraRoll.target = -CAMERA_ROLL_AMOUNT;
    else                         cameraRoll.target =  0;

    cameraRoll.current += (cameraRoll.target - cameraRoll.current) * CAMERA_ROLL_SPEED;

    // Interpolation de la position caméra
    cameraOffset.current.lerp(cameraOffset.target, CAMERA_LERP_SPEED);
    camera.position.copy(playerBike.position).add(cameraOffset.current);
    camera.lookAt(playerBike.position);
    camera.rotation.z = cameraRoll.current;

    // Les lumières principales suivent le joueur
    frontLight.position.set(playerBike.position.x, 50, playerBike.position.z - 100);
    sunLight.position.set(   playerBike.position.x, 100, playerBike.position.z - 50);
}

function handleCollectibles(playerData) {
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        if (isCollidingWithItem(playerData, item)) {
            scene.remove(item);
            collectibles.splice(i, 1);
            gameState.itemsCollected++;

            // Mettre à jour le compteur dans le DOM (si présent)
            const itemCounter = document.querySelector(".item-got");
            if (itemCounter) itemCounter.innerHTML = gameState.itemsCollected;

            if (isEmbedded) {
                window.parent.postMessage({
                    type:      'game_progress',
                    difficulty,
                    collected: gameState.itemsCollected,
                    total:     config.itemCount,
                }, '*');
            }
        }
    }
}

function handleEnemies(playerData) {
    // Les ennemis avancent légèrement vers le joueur
    enemies.forEach(enemy => {
        enemy.position.z += config.enemyMoveSpeed;
    });

    if (gameState.playerHealth <= 0) return;

    enemies.forEach(enemy => {
        if (isCollidingWithEnemy(playerData, enemy)) {
            gameState.playerHealth = Math.max(0, gameState.playerHealth - 10);
            updateHealthUI();

            // On téléporte l'ennemi loin derrière pour éviter les dégâts en boucle
            enemy.position.z -= 200;
            enemy.material.color.set('red');
        } else {
            enemy.material.color.set('white');
        }

        // Un ennemi dépassé devient transparent
        enemy.material.opacity = enemy.position.z > playerBike.position.z ? 0.4 : 1;
    });

    // Respawn des ennemis dépassés devant le joueur
    enemies.forEach(enemy => {
        const isToFarBehind = enemy.position.z > playerBike.position.z + 50;
        if (isToFarBehind) {
            const newZ = playerBike.position.z - 220 - Math.random() * 320;
            if (newZ > -config.roadLength) {
                enemy.position.set(getRandomTrackX(), 2, newZ);
                enemy.material.opacity = 1;
            }
        }
    });
}

function calculateRaceProgress() {
    const distanceTravelled = Math.max(0, PLAYER_START_Z - playerBike.position.z);
    const totalDistance     = Math.max(1, PLAYER_START_Z - (-config.roadLength));
    return Math.min(100, Math.max(0, (distanceTravelled / totalDistance) * 100));
}

const tick = () => {
    animationFrameId = requestAnimationFrame(tick);

    // Limiter le framerate à TARGET_FPS
    const now = performance.now();
    if (now - lastFrameTime < FRAME_DURATION) return;
    lastFrameTime = now;

    stats.begin();

    // Attendre que le joueur soit chargé avant de démarrer
    if (!gameState.isReady || !playerBike) {
        renderer.render(scene, camera);
        stats.end();
        return;
    }

    const currentTime = Date.now();

    handleBoost(currentTime);
    updateBoostUI(currentTime);
    handlePlayerMovement();
    handleCamera();

    const playerData = getPlayerCollisionData(playerBike);
    handleCollectibles(playerData);
    handleEnemies(playerData);

    const racePercent = calculateRaceProgress();
    updateRaceProgressUI(racePercent);

    // Game over si la santé tombe à 0
    if (gameState.playerHealth <= 0 && !gameState.hasWon) {
        showGameOver();
        stats.end();
        return;
    }

    // Victoire si le joueur atteint le bout de la route
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

// Si le jeu est dans un iframe, il attend le signal de la page parente
// Sinon il démarre tout seul
if (isEmbedded) {
    window.addEventListener('message', (event) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'start') {
            startGame();
        } else if (data.type === 'restart') {
            location.reload();
        }
    });
} else {
    startGame();
}

// Filet de sécurité : si le modèle n'a pas chargé après 2.5s, on crée un cube de remplacement
setTimeout(() => {
    if (!gameState.isReady && !playerBike) {
        const geometry = new THREE.BoxGeometry(4, 4, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0055 });
        playerBike = new THREE.Mesh(geometry, material);
        playerBike.position.set(0, 5, PLAYER_START_Z);
        scene.add(playerBike);
        onPlayerReady();
    }
}, 2500);
