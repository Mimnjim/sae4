import * as THREE from 'three';

// --- CONFIGURATION ---
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 5, 60); // Brouillard plus dense pour l'ambiance

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// Angle plus bas et plus reculé (type "Third Person Shooter") pour voir l'horizon
camera.position.set(0, 2, 9); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- ÉTAT DU JEU ---
let lives = 3;
let gameOver = false;
let gameWin = false;
let playerX = 0;
let timeElapsed = 0;
const winTime = 20; // On passe à 20s pour que le défi soit réel
const enemies = [];
const enemySpeed = 0.30; // Légèrement ralenti pour l'anticipation

// --- LA MOTO (STYLE AKIRA) ---
const bikeGroup = new THREE.Group();
const bikeBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.4, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xe60000, emissive: 0x660000 })
);
bikeGroup.add(bikeBody);

// Traînées néon persistantes sur la moto
const trailGeo = new THREE.BoxGeometry(0.05, 0.05, 1.5);
const trailMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const trailL = new THREE.Mesh(trailGeo, trailMat);
trailL.position.set(0.3, -0.1, 1);
bikeGroup.add(trailL);

scene.add(bikeGroup);

// --- SOL ET COULOIRS ---
const grid = new THREE.GridHelper(300, 60, 0xff0055, 0x111111);
grid.position.y = -0.5;
scene.add(grid);

// --- LOGIQUE DES ENNEMIS (OBSTACLES) ---
function createEnemy() {
    const geo = new THREE.BoxGeometry(2, 1.2, 0.8);
    const mat = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        emissive: 0x00ffcc, 
        emissiveIntensity: 2 
    });
    const mesh = new THREE.Mesh(geo, mat);
    
    mesh.position.z = -80;
    mesh.position.x = (Math.floor(Math.random() * 5) - 2) * 2.5;
    mesh.position.y = 0.1;
    
    scene.add(mesh);
    enemies.push(mesh);
}

const enemyTimer = setInterval(() => {
    if (!gameOver && !gameWin) createEnemy();
}, 1800);

// --- CONTRÔLES ---
window.addEventListener('keydown', (e) => {
    if (gameOver || gameWin) return;
    // On garde le système de couloirs mais on limite la zone
    if (e.key === "ArrowLeft" && playerX > -5) playerX -= 2.5;
    if (e.key === "ArrowRight" && playerX < 5) playerX += 2.5;
});

// --- UI UPDATE ---
const updateUI = () => {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        const progress = Math.min((timeElapsed / winTime) * 100, 100);
        timerElement.style.width = `${progress}%`;
    }
};

// --- BOUCLE PRINCIPALE ---
function animate() {
    if (gameOver || gameWin) return;
    requestAnimationFrame(animate);

    // CHRONO DE VICTOIRE
    timeElapsed += 1/60;
    updateUI();
    if (timeElapsed >= winTime) {
        victory();
    }

    // MOUVEMENT MOTO (Accélération ralentie pour plus de poids)
    bikeGroup.position.x = THREE.MathUtils.lerp(bikeGroup.position.x, playerX, 0.07); 
    bikeGroup.rotation.z = (bikeGroup.position.x - playerX) * 0.15;
    bikeGroup.rotation.y = (playerX - bikeGroup.position.x) * 0.1;

    // EFFET DE VITESSE (GRID)
    grid.position.z += 0.8;
    if (grid.position.z > 10) grid.position.z = 0;

    // GESTION ENNEMIS
    enemies.forEach((enemy, index) => {
        enemy.position.z += enemySpeed;
        
        // Collision
        if (Math.abs(enemy.position.z - bikeGroup.position.z) < 1 && 
            Math.abs(enemy.position.x - bikeGroup.position.x) < 1.5) {
            hit();
            scene.remove(enemy);
            enemies.splice(index, 1);
        }

        if (enemy.position.z > 20) {
            scene.remove(enemy);
            enemies.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

function hit() {
    lives--;
    document.getElementById('lives-display').innerText = `GHOST_INTEGRITY: ${lives * 33}%`;
    if (lives <= 0) {
        gameOver = true;
        document.getElementById('game-over').style.display = 'block';
    }
}

function victory() {
    gameWin = true;
    clearInterval(enemyTimer);
    document.getElementById('victory-screen').style.display = 'block';
}

animate();