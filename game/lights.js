import * as THREE from 'three';
import { scene } from './scene.js';

export const DYNAMIC_LIGHT_LAYER = 1;

export const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
export const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x444444, 0.25);

export const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);

sunLight.layers.set(DYNAMIC_LIGHT_LAYER);
sunLight.position.set(0, 100, 0);

scene.add(ambientLight, hemisphereLight, sunLight);