import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import gisModelUrl from '../assets/models/motoko_kusanagi.glb?url';

export default function GIS3D({ onReady }) {
    const containerRef = useRef(null);
    const onReadyRef   = useRef(onReady);
    useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width  = container.clientWidth  || window.innerWidth / 2;
        const height = container.clientHeight || window.innerHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 2));
        const dir = new THREE.DirectionalLight(0xffffff, 4);
        dir.position.set(5, 10, 7);
        scene.add(dir);
        const fill = new THREE.DirectionalLight(0xff00ff, 2);
        fill.position.set(-5, 2, -3);
        scene.add(fill);
        const rim = new THREE.PointLight(0x00d4ff, 2, 20);
        rim.position.set(0, -2, 3);
        scene.add(rim);

        let animId    = null;
        let destroyed = false;

        // Load model
        const loader = new GLTFLoader();
        loader.load(
            gisModelUrl,
            (gltf) => {
                const model = gltf.scene;

                const box    = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size   = box.getSize(new THREE.Vector3());
                model.position.sub(center);

                const maxDim   = Math.max(size.x, size.y, size.z);
                const fovRad   = camera.fov * (Math.PI / 180);
                // const initialZ = Math.abs(maxDim / (4) / Math.tan(fovRad / 2)) * 1.1;
                const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.1;
                const posY     = -1;


                camera.position.set(0, posY, initialZ);
                camera.lookAt(0, 0, 0);
                camera.updateMatrixWorld();
                scene.add(model);

                if (onReadyRef.current) {
                    onReadyRef.current({ camera, initialZ, model });
                }
            },
            undefined,
            (err) => console.error('[GIS3D] load error:', err)
        );

        // Render loop — tourne toujours, Three.js voit chaque changement de caméra/modèle
        function animate() {
            if (destroyed) return;
            animId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        // Resize
        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        return () => {
            destroyed = true;
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
