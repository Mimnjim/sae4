// import * as THREE from "three";
// // import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'; //pour importer un modele 3D

// // ==========================
// // --- VARIABLES GLOBALES ---
// // ==========================
// const width = window.innerWidth;
// const height = window.innerHeight;

// // ==========================
// // --- VARIABLES DE CONTROLE ---
// const bikeSpeed = 0.2;      // vitesse de base de la moto
// const bikeTurnSpeed = 0.5;  // vitesse latérale de la moto
// const keysPressed = {};     // suivi des touches pressées

// // ======================================
// // --- Scene, Camera, Renderer, Light ---
// // ======================================

// // Ajout de la scène
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x0000ff);
// scene.fog = new THREE.FogExp2(0xffffffff, 0.01);

// // Ajout de la caméra
// const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
// camera.position.set(0, 15, 0);
// camera.lookAt(0, 0, 0);

// // Ajout du renderer
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(width, height);
// renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

// // Ajout de lumières
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(0, 0, 0);
// scene.add(directionalLight);

// // ==========================
// // --- SOL INFINI ---
// // ==========================

// // Créer un sol simple
// const roadLength = 200;
// const roadGeometry = new THREE.PlaneGeometry(50, roadLength);
// const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
// const road = new THREE.Mesh(roadGeometry, roadMaterial);
// road.rotation.x = -Math.PI / 2; // mettre à plat
// road.position.z = -roadLength / 2;
// scene.add(road);

// // Deuxième segment pour l'effet infini
// const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
// road2.rotation.x = -Math.PI / 2;
// road2.position.z = road.position.z + roadLength;
// scene.add(road2);

// // Stocker dans un tableau pour le looping
// const roads = [road, road2];

// // ===================
// // ---- Fonctions ----
// // ===================

// // --- FONCTION DE CRÉATION D'ENNEMIS ---
// function createEnemy() {
//     const geometry = new THREE.BoxGeometry(2, 2, 2);
//     const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
//     const enemy = new THREE.Mesh(geometry, material);
    
//     window.enemy = enemy; // stocker la référence globale pour les collisions

//     for (let i = 0; i < 10; i++) {
//         const clone = enemy.clone();
//         clone.position.set((Math.random() - 0.5) * 40, 5, - Math.random() * 200);
//         scene.add(clone);
//     }


//     enemy.position.set(0, 5, 0);
//     scene.add(enemy);
//     return enemy;
// }

// // --- FONCTION DE CRÉATION DU JOUEUR ---
// function createPlayer() {
//     const loader = new GLTFLoader();
//     loader.load('assets/models/akira_bike.glb', (gltf) => {
//         const bike = gltf.scene;
//         console.log('Modèle chargé :', bike);

//         bike.scale.set(4, 4, 4);
//         bike.position.set(0, 11, 20);
//         bike.rotation.y = 11; // faire face à la caméra
//         scene.add(bike);

//         // Stocker la référence globale pour pouvoir contrôler la moto
//         window.playerBike = bike;

//     },
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% chargé'); // suivi du chargement
//     },
//     function (error) {
//         console.error('Erreur de chargement du modèle :', error);
//     });
// }

// // ======================
// // --- INITIALISATION ---
// // ======================
// const enemy = createEnemy();
// const player = createPlayer();

// // ==========================
// // --- GESTION DU CLAVIER ---
// // ==========================
// window.addEventListener('keydown', (event) => {
//     keysPressed[event.key] = true;
// });

// window.addEventListener('keyup', (event) => {
//     keysPressed[event.key] = false;
// });

// // ==========================
// // --- BOUCLE D'ANIMATION ---
// // ==========================
// const cameraOffset = new THREE.Vector3(0, 10, 23); // position relative de la caméra derrière la moto

// function animate() {
//     requestAnimationFrame(animate);

//     if (window.playerBike) {

//         let speed = bikeSpeed; // vitesse de base


//         // --- ACCELERATION / FREIN ---
//         if (keysPressed['ArrowUp']) {
//             speed += 0.1; // accélérer
//         }

//         if (keysPressed['ArrowDown']) {
//             speed -= 0.1; // ralentir / reculer
//         }

//         // --- Déplacement longitudinal (Z) ---
//         window.playerBike.position.z -= speed; // avancer automatiquement


//         // --- Déplacement latéral (X) ---
//         if (keysPressed['ArrowLeft'] && !(window.playerBike.position.x <= -20)) {
//         // if (keysPressed['ArrowLeft']) {
//             // console.log(window.playerBike.position.x);
//             window.playerBike.position.x -= bikeTurnSpeed;
//         } 

//         if (keysPressed['ArrowRight'] && !(window.playerBike.position.x >= 28)) {
//             // console.log(window.playerBike.position.x);
//             window.playerBike.position.x += bikeTurnSpeed;
//         }

//         // --- CAMÉRA QUI SUIT LA MOTO ---
//         camera.position.copy(window.playerBike.position).add(cameraOffset);
//         camera.lookAt(window.playerBike.position);

//         // --- LOOPING DU SOL ---
//         roads.forEach((r) => {
//             if (window.playerBike.position.z - r.position.z < - (roadLength - 60)) {
//                 r.position.z -= 2 * roadLength; // repositionner derrière
//             }
//         });
//     }

//     renderer.render(scene, camera);
// }

// animate();


// ICI, ON A UNE VERSION DE BASE FONCTIONNELLE AVEC MOTO, SOL INFINI, ET ENNEMIS STATIQUES. LA SUITE SERA D'AMÉLIORER LE JEU AVEC VIE, COLLISIONS, ET GÉNÉRATION CONTINUE D'ENNEMIS.
// ==========================================================================================================
// MEILLEURE VERSION AVEC VIE, COLLISIONS, ET GÉNÉRATION CONTINUE D'ENNEMIS (voir script2.js) :
// ==========================================================================================================

import * as THREE from "three";
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'; //pour importer un modele 3D

// ==========================
// --- VARIABLES GLOBALES ---
// ==========================
const width = window.innerWidth;
const height = window.innerHeight;

// ==========================
// --- VARIABLES DE CONTROLE --- 
// ==========================
const bikeSpeed = 0.2;      // vitesse de base de la moto
const bikeTurnSpeed = 0.5;  // vitesse latérale de la moto
const keysPressed = {};     // suivi des touches pressées
let playerHealth = 100;     // vie du joueur
let maxHealth = 100;        // vie maximale du joueur

let startTime = Date.now(); // timestamp en millisecondes au début du jeu
const winningTime = 15000;  // 15 000 ms = 15 secondes, tu peux mettre 10000 ou 20000
let hasWon = false;         // pour éviter de déclencher plusieurs fois


// ==========================
// --- Scene, Camera, Renderer, Light ---
// ==========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0000ff);
scene.fog = new THREE.FogExp2(0xffffffff, 0.01);

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.set(0, 15, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 0, 0);
scene.add(directionalLight);

// ==========================
// --- SOL INFINI ---
// ==========================
const roadLength = 200;
const roadGeometry = new THREE.PlaneGeometry(50, roadLength);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.z = -roadLength / 2;
scene.add(road);

const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
road2.rotation.x = -Math.PI / 2;
road2.position.z = road.position.z + roadLength;
scene.add(road2);

const roads = [road, road2];



const cities = [];
const cityLength = 200; // même longueur que la route

function createCity() {
    const loaderCity = new GLTFLoader();
    loaderCity.load('assets/models/beautiful_city.glb', (gltf) => {
        // const city = gltf.scene;
        // console.log('Modèle de ville chargé :', city);
        // city.scale.set(100, 20, 30);

        

        // // Position alignée à la route
        // city.position.set(-20, 10, -roadLength / 2);

        // // Rotation pour aligner profondeur sur Z
        // city.rotation.y = Math.PI / 2;


        const city1 = gltf.scene;
        const city2 = city1.clone();

        // SCALE
        city1.scale.set(100, 20, 30);
        city2.scale.set(100, 20, 30);

        // ROTATION (celle qui marche chez toi)
        city1.rotation.y = Math.PI / 2;
        city2.rotation.y = Math.PI / 2;

        // POSITION comme la route
        city1.position.set(-20, 10, -cityLength / 2);
        city2.position.set(-20, 10, city1.position.z - cityLength);

        scene.add(city1);
        scene.add(city2);

        cities.push(city1);
        cities.push(city2);


        scene.add(city);
    }
    , function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% de la ville chargé');
    }
    , function (error) {
        console.error('Erreur de chargement du modèle de ville :', error);
    });
}


// On crée 2 segments de ville pour commencer
// function createCitySegments() {
//     const loaderCity = new GLTFLoader();
//     loaderCity.load('assets/models/beautiful_city.glb', (gltf) => {

//         for (let i = 0; i < 2; i++) {
//             const city = gltf.scene.clone();
//             city.scale.set(100, 20, 30);

//             // position initiale : on aligne le premier à la route, et le second derrière
//             // city.position.set(-20, 10, -i * cityLength);
//             city.position.set(-20, 10, -i * cityLength);
//             city.rotation.y = Math.PI / 2;

//             scene.add(city);
//             cities.push(city);
//         }

//     }, undefined, (error) => {
//         console.error('Erreur chargement ville :', error);
//     });
// }

// // Appel au début
// createCitySegments();

// // Dans la boucle animate, on met à jour les segments
// function updateCities() {
//     // Trier par position Z (le plus proche de la caméra en dernier)
//     cities.sort((a, b) => a.position.z - b.position.z);

//     const firstCity = cities[0];  // segment le plus avancé (Z le plus petit, devant)
//     const lastCity = cities[cities.length - 1]; // segment le plus reculé (Z le plus grand, derrière)

//     cities.forEach((city) => {
//         // Si le joueur a complètement dépassé ce segment
//         if (window.playerBike.position.z - city.position.z > cityLength) {
//             // Repositionner ce segment **juste derrière le segment le plus reculé**
//             city.position.z = lastCity.position.z - cityLength;

//             // Mettre à jour la référence du dernier segment
//             cities.sort((a, b) => a.position.z - b.position.z);
//         }
//     });
// }

const enemies = [];
const maxEnemies = 10;
const enemySpacing = 50; // distance entre ennemis le long de l'axe Z

function createEnemy(zOffset) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);

    enemy.position.set((Math.random() - 0.5) * 40, 5, window.playerBike ? window.playerBike.position.z - 100 - zOffset : -100 - zOffset);
    scene.add(enemy);
    enemies.push(enemy);
}

// Générer les ennemis initiaux
for (let i = 0; i < maxEnemies; i++) {
    createEnemy(i * enemySpacing);
}

// ==========================
// --- JOUEUR ---
// ==========================
function createPlayer() {
    const loader = new GLTFLoader();
    loader.load('assets/models/akira_bike.glb', (gltf) => {
        const bike = gltf.scene;
        console.log('Modèle chargé :', bike);

        bike.scale.set(4, 4, 4);
        bike.position.set(0, 11, 20);
        bike.rotation.y = 11;
        scene.add(bike);

        window.playerBike = bike;
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% chargé');
    },
    function (error) {
        console.error('Erreur de chargement du modèle :', error);
    });
}


function updateHealthUI() {

    const healthPercent = (playerHealth / maxHealth) * 100;

    const timerBar = document.getElementById("timer");
    const healthText = document.getElementById("health-value");

    // Largeur de la barre
    timerBar.style.width = healthPercent + "%";

    // Texte %
    healthText.textContent = Math.floor(healthPercent);

    // Couleur dynamique cyberpunk
    if (healthPercent > 60) {
        timerBar.style.background = "#00ffff"; // cyan stable
    }
    else if (healthPercent > 30) {
        timerBar.style.background = "#ffaa00"; // orange alerte
    }
    else {
        timerBar.style.background = "#ff0033"; // rouge critique
    }
}

// ==========================
// --- GESTION DU CLAVIER ---
// ==========================
window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});
window.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

// ==========================
// --- COLLISIONS ---
// ==========================
function checkCollisions() {
    if (!window.playerBike) {
        return;
    }

    if(checkGameOver()) {
        return;
    }
    
    const playerBox = new THREE.Box3().setFromObject(window.playerBike);

    enemies.forEach(enemy => {
        const enemyBox = new THREE.Box3().setFromObject(enemy);
        if (playerBox.intersectsBox(enemyBox)) {
            playerHealth -= 10;

            if (playerHealth < 0) playerHealth = 0; // éviter les valeurs négatives

            updateHealthUI();

            console.log("Collision ! Vie restante :", playerHealth);

            // Repositionner l'ennemi plus loin devant
            enemy.position.z -= 200;
        }
    });
}

// ==========================
// --- GAME OVER ---
// ==========================

function checkGameOver() {
    if (playerHealth <= 0) {
        console.log("GAME OVER !");
        showGameOverScreen();

        // stopper la boucle d'animation
        cancelAnimationFrame(animationId);

        return true;
    }
    return false;
}

function showGameOverScreen() {
    const gameOverDiv = document.getElementById("game-over");
    if (gameOverDiv) {
        gameOverDiv.querySelector("h2").textContent = "SYSTÈME COMPROMIS\nDÉFAILLANCE DU NIVEAU";
        gameOverDiv.style.display = "block"; 
    }
}


// ==========================
// --- VICTORY ---
// ==========================
function showVictoryScreen() {
    console.log("VOUS AVEZ GAGNÉ !");
    const gameOverDiv = document.getElementById("victory-screen"); 
    if (gameOverDiv) {
        gameOverDiv.querySelector("h2").textContent = "MISSION ACCOMPLIE\nVOUS AVEZ SURVÉCU";
        gameOverDiv.style.display = "block"; 
    }
    
    // Optionnel : stopper la boucle si tu veux bloquer le jeu
    // cancelAnimationFrame(animationId);
}

// ==========================
// --- BOUCLE D'ANIMATION ---
// ==========================
const cameraOffset = new THREE.Vector3(0, 10, 23);

function animate() {
    requestAnimationFrame(animate);

    if (window.playerBike) {

        let speed = bikeSpeed;

        // --- ACCELERATION / FREIN ---
        if (keysPressed['ArrowUp']) speed += 0.1;
        if (keysPressed['ArrowDown']) speed -= 0.1;

        // --- Déplacement longitudinal (Z) ---
        window.playerBike.position.z -= speed;

        // --- Déplacement latéral (X) ---
        if (keysPressed['ArrowLeft'] && window.playerBike.position.x > -20) {
            window.playerBike.position.x -= bikeTurnSpeed;
        }
        if (keysPressed['ArrowRight'] && window.playerBike.position.x < 28) {
            window.playerBike.position.x += bikeTurnSpeed;
        }

        // --- CAMÉRA QUI SUIT LA MOTO ---
        camera.position.copy(window.playerBike.position).add(cameraOffset);
        camera.lookAt(window.playerBike.position);

        // --- LOOPING DU SOL ---
        roads.forEach((r) => {
            if (window.playerBike.position.z - r.position.z < - (roadLength - 60)) {
                r.position.z -= 2 * roadLength;
            }
        });

        // cities.forEach((c) => {
        //     // si la moto a franchi presque la fin de ce segment
        //     if (window.playerBike.position.z - c.position.z < - (cityLength / 2)) {
        //         // on recule le segment derrière le dernier segment de la ville
        //         const maxZ = Math.max(...cities.map(city => city.position.z));
        //         c.position.z = maxZ + cityLength;
        //     }
        // });


        // updateCities();

        // --- COLLISIONS ---
        checkCollisions();

        // --- GENERATION CONTINUE DES ENNEMIS ---
        enemies.forEach((enemy, index) => {
            if (enemy.position.z > window.playerBike.position.z + 50) { // si l'ennemi est derrière la moto, on l'envoie plus loin devant
                enemy.position.z = window.playerBike.position.z - 200 - Math.random() * 100;
                enemy.position.x = (Math.random() - 0.5) * 40;
            }
        });

        if (!hasWon && window.playerBike && (Date.now() - startTime >= winningTime)) {
            hasWon = true;
            showVictoryScreen();
        }

    }

    renderer.render(scene, camera);
}





createPlayer();
createCity();
// createCitySegments();
animate();




