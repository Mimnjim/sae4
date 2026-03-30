import * as THREE from 'three';
import { difficulty } from './config.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3557);
scene.fog = new THREE.Fog(0x1d3557, 100, 450);

// OPTIMISATION : far plane réduit à 450
export const camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 450);
camera.position.set(-2, 20, 50);
camera.lookAt(0, 0, 20);
camera.layers.enable(1);

// OPTIMISATION : antialiasing désactivé
export const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
// OPTIMISATION : pixel ratio bloqué à 1
renderer.setPixelRatio(1);
renderer.domElement.style.cssText = 'width:110%;height:110%;';

export const gameContainer = document.getElementById('game-container');
const statsParent = gameContainer || document.body;

if (gameContainer) gameContainer.appendChild(renderer.domElement);
else               document.body.appendChild(renderer.domElement);

// OPTIMISATION: Stats charger depuis script global
const StatsClass = typeof window !== 'undefined' ? window.Stats : null;
export const stats = StatsClass ? new StatsClass() : null;
if (stats) {
  stats.showPanel(0);
  stats.dom.style.cssText = 'position:absolute;top:12px;right:12px;display:none;'; /* FPS cachés */
  statsParent.appendChild(stats.dom);
}

export function resizeRenderer() {
    const w  = gameContainer?.clientWidth  || window.innerWidth;
    const h  = gameContainer?.clientHeight || window.innerHeight;
    if (renderer.domElement.width !== w || renderer.domElement.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
}
window.addEventListener('resize', resizeRenderer);
resizeRenderer();