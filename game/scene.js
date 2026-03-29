import * as THREE from 'three';
import Stats from 'stats.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3557);
// Reduce view distance a bit to improve performance and hide distant pop-in
scene.fog = new THREE.Fog(0x1d3557, 100, 450);

export const camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 1000);
camera.position.set(-2, 20, 50);
camera.lookAt(0, 0, 20);

export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.style.cssText = 'width:110%;height:110%;';

export const gameContainer = document.getElementById('game-container');
const statsParent = gameContainer || document.body;

if (gameContainer) gameContainer.appendChild(renderer.domElement);
else               document.body.appendChild(renderer.domElement);

export const stats = new Stats();
stats.showPanel(0);
stats.dom.style.cssText = 'position:absolute;top:12px;right:12px;';
statsParent.appendChild(stats.dom);

export function resizeRenderer() {
    const w  = gameContainer?.clientWidth  || window.innerWidth;
    const h  = gameContainer?.clientHeight || window.innerHeight;
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
