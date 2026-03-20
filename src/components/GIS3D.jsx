// import { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import GISModelUrl from '../assets/models/motoko_kusanagi.glb?url';
// import { loadModel, CACHE_KEYS } from '../utils/modelLoader';

// export default function GIS3D({ mode = 'hero', onReady, onLoadingProgress }) {
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         const width  = container.clientWidth;
//         const height = container.clientHeight;

//         const scene  = new THREE.Scene();
//         scene.background = null;

//         const fov    = mode === 'immersion' ? 35 : 45;
//         const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

//         const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//         renderer.setSize(width, height);
//         // ✅ Optimisation: Ajuster le pixelRatio pour mobile (max 2)
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//         renderer.outputColorSpace = THREE.SRGBColorSpace;
//         container.appendChild(renderer.domElement);

//         scene.add(new THREE.AmbientLight(0xffffff, 2));
//         const dir = new THREE.DirectionalLight(0xffffff, 4);
//         dir.position.set(5, 10, 7);
//         scene.add(dir);
//         const fill = new THREE.DirectionalLight(0xff00ff, 2);
//         fill.position.set(-5, 2, -3);
//         scene.add(fill);
//         const rim = new THREE.PointLight(0x00d4ff, 2, 20);
//         rim.position.set(0, -2, 3);
//         scene.add(rim);

//         let model  = null;
//         let animId = null;

//         // ✅ Utiliser le loader global avec timeout de 8s
//         loadModel(GISModelUrl, CACHE_KEYS.GIS, onLoadingProgress, 8000)
//             .then((modelScene) => {
//                 model = modelScene;

//                 const box    = new THREE.Box3().setFromObject(model);
//                 const center = box.getCenter(new THREE.Vector3());
//                 const size   = box.getSize(new THREE.Vector3());
//                 model.position.sub(center);

//                 const maxDim   = Math.max(size.x, size.y, size.z);
//                 const fovRad   = camera.fov * (Math.PI / 180);
//                 const mult     = mode === 'immersion' ? 0.8 : 1.2;
//                 const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * mult;
//                 const posY     = mode === 'immersion' ? size.y * 0.25 : 0;

//                 camera.position.set(0, posY, initialZ);
//                 camera.lookAt(0, 0, 0);
//                 scene.add(model);

//                 // onReady appelé ici — initialZ est garanti calculé
//                 if (onReady) onReady({ camera, initialZ });
//             })
//             .catch((err) => {
//                 console.error('[GIS3D] Model loading error:', err);
//                 // Fallback camera position
//                 camera.position.set(0, 0, 15);
//                 camera.lookAt(0, 0, 0);
//                 if (onReady) onReady({ camera, initialZ: 15 });
//             });

//         function animate() {
//             animId = requestAnimationFrame(animate);
//             // if (model) model.rotation.y += mode === 'immersion' ? 0.003 : 0.01;
//             renderer.render(scene, camera);
//         }
//         animate();

//         const onResize = () => {
//             const w = container.clientWidth;
//             const h = container.clientHeight;
//             camera.aspect = w / h;
//             camera.updateProjectionMatrix();
//             renderer.setSize(w, h);
//         };
//         window.addEventListener('resize', onResize);

//         return () => {
//             cancelAnimationFrame(animId);
//             window.removeEventListener('resize', onResize);
//             renderer.dispose();
//             if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
//         };
//     }, [mode, onReady, onLoadingProgress]);

//     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// }

// GIS3D.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gisModelUrl from '../assets/models/motoko_kusanagi.glb?url';

export default function GIS3D({ mode = 'hero', onReady, sharedCam }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Mode immersion : pas de nouveau contexte WebGL
        if (mode === 'immersion') return;

        const width  = container.clientWidth  || window.innerWidth / 2;
        const height = container.clientHeight || window.innerHeight;

        const scene  = new THREE.Scene();
        scene.background = null;

        const fov    = 45;
        const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

        let animId = null;

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
                const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.2;
                const posY     = 0;

                camera.position.set(0, posY, initialZ);
                camera.lookAt(0, 0, 0);
                scene.add(model);

                console.log('GIS onReady called with model:', model); // ← ajoute ça

                if (onReady) onReady({ camera, initialZ, model }); // ← ajoute model
            },
            undefined,
            (err) => {
                console.error('[GIS3D] load error:', err);
                camera.position.set(0, 0, 15);
                camera.lookAt(0, 0, 0);
                if (onReady) onReady({ camera, initialZ: 15 });
            }
        );

        function animate() {
            animId = requestAnimationFrame(animate);
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
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [mode, onReady]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
