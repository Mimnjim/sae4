import * as THREE from 'three';
import { scene } from './scene.js';

export const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
export const sunLight     = new THREE.DirectionalLight(0xffffff, 2.5);
export const frontLight   = new THREE.DirectionalLight(0xffffff, 2.0);
export const leftLight    = new THREE.DirectionalLight(0x6699ff, 1.0);
export const rightLight   = new THREE.DirectionalLight(0x6699ff, 1.0);

sunLight.position.set(0, 100, 0);
frontLight.position.set(0, 50, -100);
leftLight.position.set(-50, 30, 0);
rightLight.position.set(50, 30, 0);

scene.add(ambientLight, sunLight, frontLight, leftLight, rightLight);
