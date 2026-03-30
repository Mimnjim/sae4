import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { loadGLTFWithProperPaths } from '../../../utils/gltfLoader.js';

export default function GIS3D({ onReady }) {
    const containerRef = useRef(null);
    const onReadyRef = useRef(onReady);
    const gisModelUrl = '/models/Motoko_gltf/Motoko.glb';

    useEffect(() => {
        onReadyRef.current = onReady;
    }, [onReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let destroyed = false;
        let renderStarted = false;
        let cleanupRenderer = null;

        const initializeScene = () => {
            let width = container.clientWidth || window.innerWidth / 2;
            let height = container.clientHeight || window.innerHeight;

            const scene = new THREE.Scene();
            scene.background = null;

            const camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 1000);

            const isMobile = window.innerWidth < 768;
            const renderer = new THREE.WebGLRenderer({ 
                antialias: !isMobile,
                alpha: true,
                powerPreference: 'high-performance',
                precision: 'highp',
                stencil: false,
                depth: true
            });
            renderer.setSize(width, height);
            const maxPixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
            renderer.setPixelRatio(maxPixelRatio);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.domElement.style.display = 'block';
            container.appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 1));
            const dir = new THREE.DirectionalLight(0xffffff, 1);
            dir.position.set(5, 5, 5);
            scene.add(dir);

            let animId = null;

            const onResize = () => {
                if (!container || destroyed) return;
                const w = container.clientWidth;
                const h = container.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            };

            const resizeTimer = setTimeout(onResize, 150);

            // Démarrer l'animation immédiatement (avec ou sans modèle)
            function animate() {
                if (destroyed) return;
                animId = requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', onResize);

            // Charger le modèle EN ARRIÈRE-PLAN avec timeout (15 secondes)
            // Le modèle aura le temps de se charger sans bloquer l'UI
            loadGLTFWithProperPaths(gisModelUrl, { dracoSupport: true, timeout: 15000 })
                .then((gltf) => {
                    if (destroyed) return;
                    const model = gltf.scene;

                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    model.position.x -= center.x;
                    model.position.y -= center.y;
                    model.position.y -= 0.5;
                    model.position.z -= center.z;

                    const upwardOffset = 0;
                    model.position.y += upwardOffset;

                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 6 / maxDim;
                    model.scale.setScalar(scale);

                    const initialZ = 6;
                    camera.position.set(0, 1.2 + upwardOffset, initialZ);
                    camera.lookAt(0, upwardOffset, 0);
                    camera.updateMatrixWorld();
                    scene.add(model);

                    onResize();

                    if (onReadyRef.current) {
                        onReadyRef.current({ camera, initialZ, model });
                    }
                    console.log('✅ GIS3D chargé');
                })
                .catch((err) => console.warn("⚠️ GIS3D load failed (timeout ok):", err.message));

            function animate() {
                if (destroyed) return;
                animId = requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', onResize);

            return () => {
                clearTimeout(resizeTimer);
                cancelAnimationFrame(animId);
                window.removeEventListener('resize', onResize);
                
                scene.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(mat => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                    if (object.texture) {
                        object.texture.dispose();
                    }
                });

                renderer.dispose();
                if (container && container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            };
        };

        const startupTimer = setTimeout(() => {
            if (!renderStarted && !destroyed) {
                renderStarted = true;
                cleanupRenderer = initializeScene();
            }
        }, 50);

        return () => {
            clearTimeout(startupTimer);
            destroyed = true;
            if (cleanupRenderer && typeof cleanupRenderer === 'function') {
                cleanupRenderer();
            }
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
