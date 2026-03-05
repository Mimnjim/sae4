import * as THREE from "three";
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// ==========================
// --- DIFFICULTÉ ---
// ==========================
const params = new URLSearchParams(window.location.search);
const difficulty = parseInt(params.get("difficulty")) || 1;

let bikeSpeed = 0.2;
let bikeSpeedLateral = 0.2;
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
        city2.rotation.y = Math.PI/2;

        city1.position.set(-20, 10, -cityLength/2);
        city2.position.set(-20, 10, city1.position.z - cityLength);

        scene.add(city1, city2);
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
// --- ENNEMIS ---
// ==========================
const enemies = [];
const enemySpacing = 50;

function createEnemy(zOffset) {
    const geometry = new THREE.BoxGeometry(2,2,2);
    const material = new THREE.MeshPhongMaterial({color:0xff0000});
    const enemy = new THREE.Mesh(geometry, material);

    // Distribuer les ennemis aléatoirement le long de toute la route
    let zPos = -Math.random() * lengthOfRoad;
    
    enemy.position.set(
        (Math.random()-0.5)*40,
        5,             
        zPos                            
    );

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
        bike.position.set(0,11,20);
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
const cameraOffset = new THREE.Vector3(0,8,25);

const defaultOffset = new THREE.Vector3(0, 8, 25);
const boostOffset = new THREE.Vector3(0, 12, 40);
const brakeOffset = new THREE.Vector3(0, 6, 18);

let currentOffset = defaultOffset.clone();
let targetOffset = defaultOffset.clone();


function animate(){
    requestAnimationFrame(animate);
    if(window.playerBike && isGameReady){
        let speed = bikeSpeed;

        if(keysPressed['ArrowUp']) { 
            speed += 0.2; 
        }

        if(keysPressed['ArrowDown']) {
            speed -= 0.2;
        }

        window.playerBike.position.z -= speed;

        if(keysPressed['ArrowLeft'] && window.playerBike.position.x>-20) {
            // window.playerBike.position.x -= 0.2;
            window.playerBike.position.x -= bikeSpeedLateral;
        }
        if(keysPressed['ArrowRight'] && window.playerBike.position.x<28) {
            // window.playerBike.position.x += 0.2;
            window.playerBike.position.x += bikeSpeedLateral;
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
        else {
            targetOffset.copy(defaultOffset);
        }

        // LERP : Linear Interpolation : va progressivement de current vers target (0.05 = vitesse de transition)
        currentOffset.lerp(targetOffset, 0.08);
        
        camera.position.copy(window.playerBike.position).add(currentOffset);
        camera.lookAt(window.playerBike.position);

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
                    enemy.position.x = (Math.random() - 0.5) * 40;
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
