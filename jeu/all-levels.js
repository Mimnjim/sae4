import * as THREE from "three";
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// ==========================
// --- DIFFICULTÉ ---
// ==========================
const params = new URLSearchParams(window.location.search);
const difficulty = parseInt(params.get("difficulty")) || 1;

let bikeSpeed = 0.2;
let bikeSpeedLateral = 0.2; // Vitesse de déplacement latéral de la moto, ajustée en fonction de la difficulté
let maxEnemies = 10;
let playerHealth = 100;
// let winningTime = 15000; // 15s
let lengthOfRoad = 500;

switch(difficulty) {
    case 1: // facile
        bikeSpeed = 0.25;
        bikeSpeedLateral = 0.2;
        maxEnemies = 25;
        playerHealth = 120;
        // winningTime = 15000; // 15s
        lengthOfRoad = 700;
        break;
    case 2: // normal
        bikeSpeed = 0.35;
        bikeSpeedLateral = 0.3;
        maxEnemies = 50;
        playerHealth = 100;
        // winningTime = 20000; // 20s
        lengthOfRoad = 1500;
        break;
    case 3: // difficile
        bikeSpeed = 0.4;
        bikeSpeedLateral = 0.4;
        maxEnemies = 70;
        playerHealth = 80;
        // winningTime = 30000; // 30s
        lengthOfRoad = 3000;
        break;
}
let maxHealth = playerHealth;

const keysPressed = {};
let startTime = Date.now();
let hasWon = false;

// Pour s'assurer que le jeu ne commence qu'une fois que tous les modèles sont chargés sinon on affiche une interface de chargement des assets
let isGameReady = false;
let modelsLoaded = 0;
let modelsToLoad = 2; // moto + ville

// ==========================
// --- SCÈNE / CAMÉRA / LUMIÈRE ---
// ==========================
const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0000ff);
scene.fog = new THREE.FogExp2(0xffffffff, 0.01);

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
// const camera = new THREE.PerspectiveCamera(80, width / height, 1, 1000);
// camera.position.set(0, 15, 0);
// camera.lookAt(0, 20, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 0, 0);
scene.add(directionalLight);

// Lumière de remplissage pour éviter les ombres trop dures
const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
frontLight.position.set(0, 50, -100);
scene.add(frontLight);



// ==========================
// --- SOL INFINI ---
// ==========================
// const roadLength = 200;
const roadLength = lengthOfRoad;
const roadGeometry = new THREE.PlaneGeometry(50, roadLength);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.z = -roadLength / 2;
scene.add(road);

// const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
// road2.rotation.x = -Math.PI / 2;
// road2.position.z = road.position.z + roadLength;
// scene.add(road2);

// const roads = [road, road2];

// ==========================
// --- VILLES ---
// ==========================
const cities = [];
const cityLength = 200;

function createCity() {
    const loaderCity = new GLTFLoader();
    loaderCity.load('assets/models/beautiful_city.glb', (gltf) => {
        const city1 = gltf.scene;
        const city2 = city1.clone();

        city1.scale.set(100, 20, 30);
        city2.scale.set(100, 20, 30);

        city1.rotation.y = Math.PI/2;
        // city1.rotation.y = (Math.PI/2) + (Math.sin(Date.now() * 0.003) * 0.02);
        // city2.rotation.y = (Math.PI/2) + (Math.sin(Date.now() * 0.003) * 0.02);

        city2.rotation.y = Math.PI/2;
        // city1.rotation.y = (Math.PI/2) + (Math.sin(Date.now() * 0.0042) * 0.03);
        // city2.rotation.y = (Math.PI/2) + (Math.sin(Date.now() * 0.0042) * 0.03);


        city1.position.set(-20, 10, -cityLength/2);
        city2.position.set(-20, 10, city1.position.z - cityLength);


        // ICI, on pourrait ajouter des animations aux villes, comme des lumières qui s'allument ou des éléments qui bougent pour les rendre plus vivantes. Par exemple, on pourrait faire clignoter certaines fenêtres ou faire tourner des hélicoptères autour des gratte-ciels. Cela ajouterait une touche de dynamisme et d'immersion à l'environnement urbain.
        // scene.add(city1, city2);
        cities.push(city1, city2);
        
        modelsLoaded++;
        if (modelsLoaded === modelsToLoad) {
            isGameReady = true;
            startTime = Date.now(); // Reset timer quand tout est chargé
        }
    });
}

// ================================
// --- ITEMS / CORPS A RAMASSER ---
// ================================

const items = [];
const itemGeometry = new THREE.SphereGeometry(1, 16, 16);
const itemMaterial = new THREE.MeshPhongMaterial({color:0x00ff00});

const itemCount = 6;
const itemSpacing = 100;

let itemGotCount = 0;

for(let i=0;i<itemCount;i++) {
    const item = new THREE.Mesh(itemGeometry, itemMaterial);
    item.position.set((Math.random()-0.5)*40, 1, -150 - i*itemSpacing);
    scene.add(item);
    items.push(item);
}

function checkItemCollisions() {
    if(!window.playerBike) return;

    const playerBox = new THREE.Box3().setFromObject(window.playerBike);
    const itemGot = document.querySelector(".item-got");

    items.forEach((item, index) => {
        const itemBox = new THREE.Box3().setFromObject(item);

        if(playerBox.intersectsBox(itemBox)) {
            // Ramasser l'item
            scene.remove(item);
            items.splice(index, 1);

            itemGotCount++;
            itemGot.innerHTML = itemGotCount;

            return;
        }
    });


    // if(!window.playerBike) return;
    // const playerBox = new THREE.Box3().setFromObject(window.playerBike);
    // items.forEach((item, index)=>{
    //     const itemBox = new THREE.Box3().setFromObject(item);
    //     if(playerBox.intersectsBox(itemBox)) {
    //         // Ramasser l'item
    //         scene.remove(item);
    //         items.splice(index, 1);
    //         // Bonus : restaurer un peu de santé
    //         playerHealth += 20;
    //         if(playerHealth > maxHealth) playerHealth = maxHealth;
    //         updateHealthUI();
    //     }
    // });
}


// ==========================
// --- SYSTÈME DE BOOST ---
// ==========================
let boostReady = false;
let boostActive = false;
let boostChargeTime = 10000; // 10 secondes pour charger
let boostDuration = 3000; // 3 secondes de boost
let boostLastUsed = Date.now() - boostChargeTime; // Disponible au début
let boostStartTime = 0;



// ==========================
// --- ENNEMIS ---
// ==========================
const enemies = [];
const enemySpacing = 30;
const lanes = [-10, -3, 3, 10]; // 4 voies bien définies

function createEnemy(zOffset) {
    const geometry = new THREE.BoxGeometry(4,4,4);
    const material = new THREE.MeshPhongMaterial({color:0xff0000});
    const enemy = new THREE.Mesh(geometry, material);

    // // Distribuer les ennemis aléatoirement le long de toute la route
    // let zPos = -Math.random() * lengthOfRoad + 50; // +50 pour éviter de les faire apparaître trop près du joueur au début
    
    // Distribuer les ennemis entre -50 et -(lengthOfRoad - 50)
    // let zPos = -50 - Math.random() * (lengthOfRoad + 100);    
    // let zPos = -50 - Math.random() * Math.max(lengthOfRoad - 100, 200);
    
    // OLD
        // Choosir une position z aléatoire, mais s'assurer qu'elle est à au moins 50 unités du joueur et pas trop loin pour éviter les pop-in  
    // let zPos = -50 - Math.random() * lengthOfRoad;
    // if(zOffset) {
    //     zPos = -zOffset;
    // }
    // enemy.position.set(
    //     (Math.random()-0.5)*40,
    //     5,             
    //     zPos                            
    // );

    // NEW
        // Choisir une lane aléatoire
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    enemy.position.set(lane, 5, window.playerBike ? window.playerBike.position.z -100 - zOffset : -100 - zOffset);


    scene.add(enemy);
    enemies.push(enemy);
}

for(let i=0;i<maxEnemies;i++) createEnemy(i*enemySpacing);

// ==========================
// --- JOUEUR ---
// ==========================
function createPlayer() {
    const loader = new GLTFLoader();
    loader.load('assets/models/akira_bike.glb', (gltf)=>{
        const bike = gltf.scene;


        bike.scale.set(4,4,4);
        // bike.position.set(0,11,20);
        bike.position.set(5,11,30);
        // bike.rotation.y = 11;
        bike.rotation.y = 11;

        scene.add(bike);
        window.playerBike = bike;
        
        modelsLoaded++;
        if (modelsLoaded === modelsToLoad) {
            isGameReady = true;
            startTime = Date.now(); // Reset timer quand tout est chargé
        }
    });
}

function updateHealthUI() {
    const healthPercent = (playerHealth/maxHealth)*100;
    const timerBar = document.getElementById("timer");
    const healthText = document.getElementById("health-value");

    timerBar.style.width = healthPercent + "%";
    healthText.textContent = Math.floor(healthPercent);

    if(healthPercent>60) {
        timerBar.style.background="#00ffff";
    }

    else if(healthPercent>30) {
        timerBar.style.background="#ffaa00";
    } 
    else {
        timerBar.style.background="#ff0033";
    }   
}

window.addEventListener('keydown', e => {
    keysPressed[e.key] = true;
});
window.addEventListener('keyup', e => {
    keysPressed[e.key] = false;
});

// ==========================
// --- COLLISIONS ---
// ==========================
function checkCollisions() {
    if(!window.playerBike) return;
    if(checkGameOver()) return;
    const playerBox = new THREE.Box3().setFromObject(window.playerBike);
    enemies.forEach(enemy=>{
        const enemyBox = new THREE.Box3().setFromObject(enemy);
        if(playerBox.intersectsBox(enemyBox)) {
            playerHealth -= 10;
            if(playerHealth<0) { 
                playerHealth=0; 
            }
            updateHealthUI();
            enemy.position.z -= 200;
        }
    });
}

function checkGameOver() {
    if(playerHealth<=0){
        showGameOverScreen();
        return true;
    }
    return false;
}

function showGameOverScreen() {
    const gameOverDiv = document.getElementById("game-over");
    if(gameOverDiv) {
        gameOverDiv.style.display="block";
    } 
}

function showVictoryScreen() {
    const victoryDiv = document.getElementById("victory-screen");
    if(victoryDiv) {
        victoryDiv.style.display="block";
    }
}

// ==========================
// --- ANIMATION ---
// ==========================
// const cameraOffset = new THREE.Vector3(0,10,23);
// const cameraOffset = new THREE.Vector3(0,0,20);

// const defaultOffset = new THREE.Vector3(-2, -2, 30);
// const defaultOffset = new THREE.Vector3(-3, -2, 30);
const defaultOffset = new THREE.Vector3(-4, -2, 30);
const boostOffset = new THREE.Vector3(0, 12, 40);
const brakeOffset = new THREE.Vector3(0, 6, 18);

let currentOffset = defaultOffset.clone();
let targetOffset = defaultOffset.clone();


function animate(){
    requestAnimationFrame(animate);
    if(window.playerBike && isGameReady){
        // GESTION DU BOOST
        const currentTime = Date.now();
        const timeSinceLastBoost = currentTime - boostLastUsed;
        
            // Vérifier si le boost est chargé
        if (!boostActive && timeSinceLastBoost >= boostChargeTime) {
            boostReady = true;
        }
        
            // Activer le boost avec Shift
        if (keysPressed['Shift'] && boostReady && !boostActive) {
            boostActive = true;
            boostReady = false;
            boostStartTime = currentTime;
            boostLastUsed = currentTime;
        }
        
            // Désactiver le boost après la durée
        if (boostActive && (currentTime - boostStartTime) >= boostDuration) {
            boostActive = false;
        }
        
            // Mise à jour de l'UI du boost
        const boostBar = document.getElementById('boost-bar');
        const boostStatus = document.getElementById('boost-status');
        
        if (boostActive) {
            const boostProgress = ((currentTime - boostStartTime) / boostDuration) * 100;
            boostBar.style.width = (100 - boostProgress) + '%';
            boostBar.style.background = '#ff0055';
            boostStatus.textContent = 'ACTIF!';
            boostStatus.style.color = '#ff0055';
        } else if (boostReady) {
            boostBar.style.width = '100%';
            boostBar.style.background = '#00ff00';
            boostStatus.textContent = 'PRÊT (SHIFT)';
            boostStatus.style.color = '#00ff00';
        } else {
            const chargeProgress = (timeSinceLastBoost / boostChargeTime) * 100;
            boostBar.style.width = chargeProgress + '%';
            boostBar.style.background = '#00ffff';
            boostStatus.textContent = 'CHARGEMENT...';
            boostStatus.style.color = '#00ffff';
        }
            


        // Contrôle du mouvement de la moto
        let speed = bikeSpeed;

        // Appliquer le boost
        if (boostActive) {
            speed *= 2.5; // 2.5x plus rapide pendant le boost
        }

        if(keysPressed['ArrowUp']) { 
            speed += 0.3; 
            window.playerBike.rotation.y = 11; // Inclinaison vers la gauche

        }

        if(keysPressed['ArrowDown']) {
            speed -= 0.3;
            window.playerBike.rotation.y = 11; // Inclinaison vers la gauche

        }

        window.playerBike.position.z -= speed;

        if(keysPressed['ArrowLeft'] && window.playerBike.position.x>-20) {
            // window.playerBike.position.x -= 0.2;
            window.playerBike.position.x -= bikeSpeedLateral;
            // window.playerBike.rotation.y = -1.02; // Inclinaison vers la gauche
            window.playerBike.rotation.y = -1.30; // Inclinaison vers la gauche
            // window.playerBike.position.x -= 0.8;

        }
        if(keysPressed['ArrowRight'] && window.playerBike.position.x<28) {
            // window.playerBike.position.x += 0.2;
            window.playerBike.position.x += bikeSpeedLateral;
            window.playerBike.rotation.y = -1.73; // Inclinaison vers la droite
            // window.playerBike.position.x += 0.8;

        } 
        
        // =====================
        // CAMÉRA DYNAMIQUE
        // =====================
        if(keysPressed['ArrowUp']) {
            targetOffset.copy(boostOffset);
        } 
        else if(keysPressed['ArrowDown']) {
            targetOffset.copy(brakeOffset);
        }
        else if (keysPressed['ArrowLeft'] || keysPressed['ArrowRight']) {
            targetOffset.copy(defaultOffset).add(new THREE.Vector3(0, 0, 5)); // Décalage vers l'avant pour les virages
        } 
        else if (keysPressed['ArrowLeft']) {
            targetOffset.copy(defaultOffset).add(new THREE.Vector3(20, 0, 0)); // Décalage vers la droite pour les virages à gauche
        }
        else if (keysPressed['ArrowRight']) {
            targetOffset.copy(defaultOffset).add(new THREE.Vector3(-20, 0, 0)); // Décalage vers la gauche pour les virages à droite
        }
        else {
            targetOffset.copy(defaultOffset);
        }

        // LERP : Linear Interpolation : va progressivement de current vers target (0.05 = vitesse de transition)
        currentOffset.lerp(targetOffset, 0.08);
        
        camera.position.copy(window.playerBike.position).add(currentOffset);
        camera.lookAt(window.playerBike.position);

        // Les lumières suivent le joueur
        frontLight.position.set(window.playerBike.position.x, 50, window.playerBike.position.z - 100);
        directionalLight.position.set(window.playerBike.position.x, 100, window.playerBike.position.z - 50);


        // Afficher/masquer le message de chargement
        const loadingMessage = document.getElementById("loading-message");
        if (loadingMessage) {
            loadingMessage.style.display = isGameReady ? "none" : "block";
        }

        // roads.forEach(r=>{
        //     if(window.playerBike.position.z - r.position.z < -(roadLength-60)) {
        //         r.position.z -= 2 * roadLength;
        //     }
        // });


        checkItemCollisions();
        checkCollisions();
        enemies.forEach(enemy=>{
            if(enemy.position.z>window.playerBike.position.z + 50){
                // Réapparition aléatoire, mais dans la limite de la route
                let newZ = window.playerBike.position.z -300 - Math.random()*100;
                if(newZ > -lengthOfRoad) {
                    enemy.position.z = newZ + 25;

                    // enemy.position.x = (Math.random() - 0.5) * 40;
                    enemy.position.x = lanes[Math.floor(Math.random() * lanes.length)];
                }
            }
        });

        // VICTOIRE
        // if(!hasWon && (Date.now()-startTime) >= winningTime){
        //     hasWon=true;
        //     showVictoryScreen();
        // }
    
        if(!hasWon && window.playerBike.position.z < -lengthOfRoad) {
            hasWon=true;
            showVictoryScreen();
        }
    
    }
    renderer.render(scene,camera);
}

createPlayer();
createCity();
animate();
