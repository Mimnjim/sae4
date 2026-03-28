// import { useEffect, useRef } from 'react';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import * as THREE from 'three';
// import gisModelUrl from '/models/motoko_kusanagi.glb?url';

// export default function GIS3D({ onReady }) {
//     const containerRef = useRef(null);
//     const onReadyRef   = useRef(onReady);
    
//     useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         // Mesures initiales (sécurité si le container est à 0)
//         let width  = container.clientWidth  || window.innerWidth / 2;
//         let height = container.clientHeight || window.innerHeight;

//         // Scene
//         const scene = new THREE.Scene();
//         scene.background = null;

//         // Camera
//         const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//         renderer.setSize(width, height);
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//         renderer.outputColorSpace = THREE.SRGBColorSpace;
//         container.appendChild(renderer.domElement);

//         // Lights
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

//         let animId    = null;
//         let destroyed = false;

//         // --- FONCTION RESIZE (Fix Anti-Crop) ---
//         const onResize = () => {
//             if (!container || destroyed) return;
//             const w = container.clientWidth;
//             const h = container.clientHeight;
//             camera.aspect = w / h;
//             camera.updateProjectionMatrix();
//             renderer.setSize(w, h);
//         };

//         // Fix : Force le recalcul 150ms après le montage pour laisser le layout se stabiliser
//         const resizeTimer = setTimeout(onResize, 150);

//         // Load model
//         const loader = new GLTFLoader();
//         loader.load(
//             gisModelUrl,
//             (gltf) => {
//                 if (destroyed) return;
//                 const model = gltf.scene;

//                 const box    = new THREE.Box3().setFromObject(model);
//                 const center = box.getCenter(new THREE.Vector3());
//                 const size   = box.getSize(new THREE.Vector3());
//                 model.position.sub(center);

//                 const maxDim   = Math.max(size.x-4, size.y-4, size.z-4);
//                 const fovRad   = camera.fov * (Math.PI / 180);
//                 const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.2;
//                 // const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.1;
//                 const posY     = -1.11;

//                 camera.position.set(0, posY, initialZ);
//                 camera.lookAt(0, 0, 0);
//                 camera.updateMatrixWorld();
//                 scene.add(model);

//                 // On force le resize immédiatement après l'ajout du modèle
//                 onResize();

//                 if (onReadyRef.current) {
//                     onReadyRef.current({ camera, initialZ, model });
//                 }
//             },
//             undefined,
//             (err) => console.error('[GIS3D] load error:', err)
//         );

//         // Render loop
//         function animate() {
//             if (destroyed) return;
//             animId = requestAnimationFrame(animate);
//             renderer.render(scene, camera);
//         }
//         animate();

//         window.addEventListener('resize', onResize);

//         return () => {
//             destroyed = true;
//             clearTimeout(resizeTimer);
//             cancelAnimationFrame(animId);
//             window.removeEventListener('resize', onResize);
//             renderer.dispose();
//             if (container.contains(renderer.domElement)) {
//                 container.removeChild(renderer.domElement);
//             }
//         };
//     }, []);

//     return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
// }


import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import gisModelUrl from '../../../assets/models/Motoko_gltf/ProjectName.gltf?url';

export default function GIS3D({ onReady }) {
    const containerRef = useRef(null);
    const onReadyRef   = useRef(onReady);
    
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

        // Camera (75 comme dans le HTML qui fonctionne)
        const camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 10000);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // Lights - adaptées du HTML qui fonctionne
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

        // Load model
        const loader = new GLTFLoader();
        loader.load(
            gisModelUrl,
            (gltf) => {
                if (destroyed) return;
                const model = gltf.scene;

                // 🔥 CALCUL BOUNDING BOX (comme le HTML qui fonctionne)
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // 🔥 RECENTRAGE
                model.position.x -= center.x;
                model.position.y -= center.y;
                model.position.z -= center.z;

                // 🔥 REMONTÉE DU MODÈLE (pour éviter le cropping des jambes)
                const upwardOffset = 4;
                model.position.y += upwardOffset;

                // 🔥 SCALE AUTO (CRUCIAL) - comme le HTML qui fonctionne
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 6 / maxDim;
                model.scale.setScalar(scale);

                // 🔥 CAMERA AJUSTÉE - comme le HTML qui fonctionne
                // Pour agrandir le modèle sans changer le visuel : augmenter scale ET initialZ proportionnellement
                const initialZ = 5; // 3 est un facteur de distance de base, ajusté par le scale
                camera.position.set(0, 1.2 + upwardOffset, initialZ);

                camera.lookAt(0, upwardOffset, 0);
                camera.updateMatrixWorld();
                scene.add(model);

                // On force le resize immédiatement après l'ajout du modèle
                onResize();

                if (onReadyRef.current) {
                    onReadyRef.current({ camera, initialZ, model });
                }
            },
            undefined,
            (err) => console.error('[GIS3D] load error:', err)
        );

        // Render loop
        function animate() {
            if (destroyed) return;
            animId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', onResize);

        return () => {
            destroyed = true;
            clearTimeout(resizeTimer);
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
}
