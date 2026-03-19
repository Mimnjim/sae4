import { useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default function Akira3D() {
    const containerRef = useRef(null);
    const [status, setStatus] = useState('Initialisation...');

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        console.log('[Akira3D] container size:', width, height);
        setStatus(`Container: ${width}x${height}`);

        if (width === 0 || height === 0) {
            setStatus('❌ Container a une taille de 0 — vérifie le CSS');
            return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // Lumières
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

        // Cube de test — s'il apparaît, Three.js fonctionne
        const testCube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x00d4ff })
        );
        scene.add(testCube);

        let model = null;
        let animationId = null;

        // Chemins à tester dans l'ordre
        const paths = [
            'assets/tetsuo_akira_1988/scene.gltf',
            '/assets/tetsuo_akira_1988/scene.gltf',
            './assets/tetsuo_akira_1988/scene.gltf',
            'public/assets/tetsuo_akira_1988/scene.gltf',
        ];

        let pathIndex = 0;

        function tryLoad() {
            if (pathIndex >= paths.length) {
                setStatus('❌ Modèle introuvable — cube bleu = Three.js OK. Vérifie le chemin du .gltf dans la console.');
                return;
            }

            const path = paths[pathIndex];
            console.log(`[Akira3D] Tentative chargement: ${path}`);
            setStatus(`Chargement: ${path}`);

            const loader = new GLTFLoader();
            loader.load(
                path,
                (gltf) => {
                    console.log('[Akira3D] ✅ Modèle chargé depuis:', path);
                    setStatus(`✅ Modèle chargé: ${path}`);

                    scene.remove(testCube);
                    model = gltf.scene;

                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    console.log('[Akira3D] Taille du modèle:', size);

                    model.position.sub(center);

                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = camera.fov * (Math.PI / 180);
                    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 2;
                    camera.position.set(0, 0, cameraZ);
                    camera.lookAt(0, 0, 0);

                    scene.add(model);
                },
                (progress) => {
                    if (progress.total > 0) {
                        const pct = Math.round((progress.loaded / progress.total) * 100);
                        setStatus(`Chargement ${path}: ${pct}%`);
                    }
                },
                (error) => {
                    console.warn(`[Akira3D] ❌ Échec ${path}:`, error);
                    pathIndex++;
                    tryLoad();
                }
            );
        }

        tryLoad();

        function animate() {
            animationId = requestAnimationFrame(animate);
            testCube.rotation.y += 0.01;
            if (model) model.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();

        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            <div style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                color: 'white',
                fontSize: '11px',
                background: 'rgba(0,0,0,0.6)',
                padding: '4px 8px',
                borderRadius: 4,
                pointerEvents: 'none',
                zIndex: 10,
            }}>
                {status}
            </div>
        </div>
    );
}
