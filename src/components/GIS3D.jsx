import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import GISModelUrl from '../assets/models/motoko_kusanagi.glb?url';

export default function GIS3D({ mode = 'hero', onReady }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width  = container.clientWidth;
        const height = container.clientHeight;

        const scene  = new THREE.Scene();
        scene.background = null;

        const fov    = mode === 'immersion' ? 35 : 45;
        const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

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

        let model  = null;
        let animId = null;

        const loader = new GLTFLoader();
        loader.load(GISModelUrl, (gltf) => {
            model = gltf.scene;

            const box    = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size   = box.getSize(new THREE.Vector3());
            model.position.sub(center);

            const maxDim   = Math.max(size.x, size.y, size.z);
            const fovRad   = camera.fov * (Math.PI / 180);
            const mult     = mode === 'immersion' ? 0.8 : 1.2;
            const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * mult;
            const posY     = mode === 'immersion' ? size.y * 0.25 : 0;

            camera.position.set(0, posY, initialZ);
            camera.lookAt(0, 0, 0);
            scene.add(model);

            // onReady appelé ici — initialZ est garanti calculé
            if (onReady) onReady({ camera, initialZ });

        }, undefined, (err) => console.error('[GIS3D]', err));

        function animate() {
            animId = requestAnimationFrame(animate);
            // if (model) model.rotation.y += mode === 'immersion' ? 0.003 : 0.01;
            renderer.render(scene, camera);
        }
        animate();

        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
    }, [mode]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
