import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { loadGLTFWithProperPaths } from '../../../utils/gltfLoader.js';

export default function GIS3D({ onReady }) {
    const containerRef = useRef(null);
    const onReadyRef   = useRef(onReady);
    const gisModelUrl = '/models/Motoko_gltf/ProjectName.gltf';
    
    useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Mesures initiales (sécurité si le container est à 0)
        let width  = container.clientWidth  || window.innerWidth / 2;
        let height = container.clientHeight || window.innerHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 10000);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
        });
        const isMobile = window.innerWidth < 768;
        const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
        renderer.setSize(width, height);
        renderer.setPixelRatio(pixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.style.display = 'block';
        container.appendChild(renderer.domElement);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 1));
        const dir = new THREE.DirectionalLight(0xffffff, 1);
        dir.position.set(5, 5, 5);
        scene.add(dir);

        let animId    = null;
        let destroyed = false;

        // --- FONCTION RESIZE (Fix Anti-Crop) ---
        const onResize = () => {
            if (!container || destroyed) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        // Fix : Force le recalcul 150ms après le montage pour laisser le layout se stabiliser
        const resizeTimer = setTimeout(onResize, 150);

        // Chargement du modèle avec résolution d'URL appropriée
        loadGLTFWithProperPaths(gisModelUrl)
            .then((gltf) => {
                if (destroyed) return;
                const model = gltf.scene;

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // RECENTRAGE
                model.position.x -= center.x;
                model.position.y -= center.y;
                model.position.z -= center.z;

                // Remontée du modèle (pour éviter le cropping des jambes)
                const upwardOffset = 4;
                model.position.y += upwardOffset;

                // SCALE AUTO
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 6 / maxDim;
                model.scale.setScalar(scale);

                // Pour agrandir le modèle sans changer le visuel
                const initialZ = 5; 
                camera.position.set(0, 1.2 + upwardOffset, initialZ);

                camera.lookAt(0, upwardOffset, 0);
                camera.updateMatrixWorld();
                scene.add(model);

                // On force le resize immédiatement après l'ajout du modèle
                onResize();

                if (onReadyRef.current) {
                    onReadyRef.current({ camera, initialZ, model });
                }
            })
            .catch((err) => console.error('[GIS3D] load error:', err));

        // Mobile optimization: pause rendering during scroll
        let scrollTimeout = null;
        let shouldPauseRender = false;
        
        if (isMobile) {
            window.addEventListener('scroll', () => {
                shouldPauseRender = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    shouldPauseRender = false;
                }, 100);
            }, { passive: true });
        }

        
        // Render loop
        function animate() {
            if (destroyed) return;
            animId = requestAnimationFrame(animate);
            
            // Skip rendering during scroll on mobile to prevent flicker
            if (!shouldPauseRender) {
                renderer.render(scene, camera);
            }
        }
        animate();

        window.addEventListener('resize', onResize);

        return () => {
            destroyed = true;
            clearTimeout(resizeTimer);
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            
            // Dispose all geometries, materials, and textures
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
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', background: 'transparent' }} />;
}
