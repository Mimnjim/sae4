import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import akiraModelUrl from '/models/akira_tetsuo_first_3d_model.glb?url';

export default function Akira3D({ onReady }) {
    const containerRef = useRef(null);
    const onReadyRef   = useRef(onReady);
    
    useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Mesures initiales
        let width  = container.clientWidth  || window.innerWidth / 2;
        let height = container.clientHeight || window.innerHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(80, width / height, 0.01, 10000);

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
        scene.add(new THREE.AmbientLight(0xffffff, 2));
        const dir = new THREE.DirectionalLight(0xffffff, 4);
        dir.position.set(5, 10, 7);
        scene.add(dir);
        
        const fill = new THREE.DirectionalLight(0x00d4ff, 2);
        fill.position.set(-5, 2, -3);
        scene.add(fill);
        
        const rim = new THREE.PointLight(0xff003c, 2, 20);
        rim.position.set(0, -2, 3);
        scene.add(rim);

        let animId   = null;
        let destroyed = false;

        // --- FONCTION RESIZE (Anti-Crop) ---
        const onResize = () => {
            if (!container || destroyed) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        // Forcer le resize après un court délai pour laisser le CSS se stabiliser
        const resizeTimer = setTimeout(onResize, 150);

        // Chargement du modèle 3D
        const loader = new GLTFLoader();
        loader.load(
            akiraModelUrl,
            (gltf) => {
                if (destroyed) return;
                const model = gltf.scene;

                const box    = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size   = box.getSize(new THREE.Vector3());
                model.position.sub(center);

                const maxDim   = Math.max(size.x, size.y, size.z);
                const fovRad   = camera.fov * (Math.PI / 180);
                const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.6;
                const posY     = -10;

                camera.position.set(0, posY, initialZ);
                camera.lookAt(0, 10, 0);
                camera.updateMatrixWorld();
                scene.add(model);

                // On déclenche un resize juste après le chargement du modèle aussi
                onResize();

                if (onReadyRef.current) {
                    onReadyRef.current({ camera, initialZ, model });
                }
            },
            undefined,
            (err) => console.error('[Akira3D] load error:', err)
        );

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

        // Animation LOOP 
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
