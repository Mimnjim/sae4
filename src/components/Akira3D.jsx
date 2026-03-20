// // // // import { useEffect, useRef } from 'react';
// // // // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// // // // import * as THREE from 'three';
// // // // import akiraModelUrl from '../assets/models/akira_tetsuo_first_3d_model.glb?url';

// // // // export default function Akira3D({ mode = 'hero', onReady }) {
// // // //     const containerRef = useRef(null);

// // // //     useEffect(() => {
// // // //         const container = containerRef.current;
// // // //         if (!container) return;

// // // //         const width  = container.clientWidth;
// // // //         const height = container.clientHeight;

// // // //         const scene  = new THREE.Scene();
// // // //         scene.background = null;

// // // //         const fov    = mode === 'immersion' ? 35 : 80;
// // // //         const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

// // // //         const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// // // //         renderer.setSize(width, height);
// // // //         renderer.setPixelRatio(window.devicePixelRatio);
// // // //         renderer.outputColorSpace = THREE.SRGBColorSpace;
// // // //         container.appendChild(renderer.domElement);

// // // //         scene.add(new THREE.AmbientLight(0xffffff, 2));
// // // //         const dir = new THREE.DirectionalLight(0xffffff, 4);
// // // //         dir.position.set(5, 10, 7);
// // // //         scene.add(dir);
// // // //         const fill = new THREE.DirectionalLight(0x00d4ff, 2);
// // // //         fill.position.set(-5, 2, -3);
// // // //         scene.add(fill);
// // // //         const rim = new THREE.PointLight(0xff003c, 2, 20);
// // // //         rim.position.set(0, -2, 3);
// // // //         scene.add(rim);

// // // //         let model      = null;
// // // //         let animId     = null;

// // // //         const loader = new GLTFLoader();
// // // //         loader.load(akiraModelUrl, (gltf) => {
// // // //             model = gltf.scene;

// // // //             const box    = new THREE.Box3().setFromObject(model);
// // // //             const center = box.getCenter(new THREE.Vector3());
// // // //             const size   = box.getSize(new THREE.Vector3());
// // // //             model.position.sub(center);

// // // //             const maxDim   = Math.max(size.x, size.y, size.z);
// // // //             const fovRad   = camera.fov * (Math.PI / 180);
// // // //             const mult     = mode === 'immersion' ? 0.8 : 1.3;
// // // //             const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * mult;
// // // //             const posY     = mode === 'immersion' ? size.y * 0.25 : 10;

// // // //             camera.position.set(0, posY, initialZ);
// // // //             camera.lookAt(0, 0, 0);
// // // //             scene.add(model);

// // // //             console.log('Akira onReady called with model:', model); // ← ajoute ça

// // // //             // onReady appelé ici — initialZ est garanti calculé
// // // //             if (onReady) onReady({ camera, initialZ, model }); // ← ajoute model

// // // //         }, undefined, (err) => console.error('[Akira3D]', err));

// // // //         function animate() {
// // // //             animId = requestAnimationFrame(animate);
// // // //             // if (model) model.rotation.y += mode === 'immersion' ? 0.003 : 0.01;
// // // //             renderer.render(scene, camera);
// // // //         }
// // // //         animate();

// // // //         const onResize = () => {
// // // //             const w = container.clientWidth;
// // // //             const h = container.clientHeight;
// // // //             camera.aspect = w / h;
// // // //             camera.updateProjectionMatrix();
// // // //             renderer.setSize(w, h);
// // // //         };
// // // //         window.addEventListener('resize', onResize);

// // // //         return () => {
// // // //             cancelAnimationFrame(animId);
// // // //             window.removeEventListener('resize', onResize);
// // // //             renderer.dispose();
// // // //             if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
// // // //         };
// // // //     }, [mode]);

// // // //     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// // // // }

// // // import { useEffect, useRef } from 'react';
// // // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// // // import * as THREE from 'three';
// // // import akiraModelUrl from '../assets/models/akira_tetsuo_first_3d_model.glb?url';

// // // export default function Akira3D({ mode = 'hero', onReady }) {
// // //     const containerRef = useRef(null);
// // //     // Stabilise onReady dans une ref pour éviter que le useEffect se relance
// // //     const onReadyRef = useRef(onReady);
// // //     useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

// // //     useEffect(() => {
// // //         const container = containerRef.current;
// // //         if (!container) return;

// // //         const width  = container.clientWidth  || window.innerWidth / 2;
// // //         const height = container.clientHeight || window.innerHeight;

// // //         const scene  = new THREE.Scene();
// // //         scene.background = null;

// // //         const fov    = 80;
// // //         const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

// // //         const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// // //         renderer.setSize(width, height);
// // //         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// // //         renderer.outputColorSpace = THREE.SRGBColorSpace;
// // //         container.appendChild(renderer.domElement);

// // //         scene.add(new THREE.AmbientLight(0xffffff, 2));
// // //         const dir = new THREE.DirectionalLight(0xffffff, 4);
// // //         dir.position.set(5, 10, 7);
// // //         scene.add(dir);
// // //         const fill = new THREE.DirectionalLight(0x00d4ff, 2);
// // //         fill.position.set(-5, 2, -3);
// // //         scene.add(fill);
// // //         const rim = new THREE.PointLight(0xff003c, 2, 20);
// // //         rim.position.set(0, -2, 3);
// // //         scene.add(rim);

// // //         let animId = null;
// // //         let model = null;

// // //         const loader = new GLTFLoader();
// // //         loader.load(akiraModelUrl, (gltf) => {
// // //             const model = gltf.scene;
// // //     console.log('model chargé:', model); // ← est-ce que ça s'affiche ?

// // //             const box    = new THREE.Box3().setFromObject(model);
// // //             const center = box.getCenter(new THREE.Vector3());
// // //             const size   = box.getSize(new THREE.Vector3());
// // //             model.position.sub(center);

// // //             const maxDim   = Math.max(size.x, size.y, size.z);
// // //             const fovRad   = camera.fov * (Math.PI / 180);
// // //             const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.3;
// // //             const posY     = 10;

// // //             camera.position.set(0, posY, initialZ);
// // //             camera.lookAt(0, 0, 0);
// // //             scene.add(model);

// // //             if (onReadyRef.current) onReadyRef.current({ camera, initialZ, model });

// // //         }, undefined, (err) => console.error('[Akira3D]', err));

// // //         function animate() {
// // //             animId = requestAnimationFrame(animate);
// // //             console.log('model in animate:', model); // ← est-ce null ou Group ?
// // //             if (model) model.rotation.y += 0.01;

// // //             renderer.render(scene, camera);
// // //         }
// // //         animate();

// // //         const onResize = () => {
// // //             const w = container.clientWidth;
// // //             const h = container.clientHeight;
// // //             camera.aspect = w / h;
// // //             camera.updateProjectionMatrix();
// // //             renderer.setSize(w, h);
// // //         };
// // //         window.addEventListener('resize', onResize);

// // //         return () => {
// // //             cancelAnimationFrame(animId);
// // //             window.removeEventListener('resize', onResize);
// // //             renderer.dispose();
// // //             if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
// // //         };
// // //     }, []); // ← deps vide : monte une seule fois

// // //     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// // // }


// // import { useEffect, useRef } from 'react';
// // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// // import * as THREE from 'three';
// // import akiraModelUrl from '../assets/models/akira_tetsuo_first_3d_model.glb?url';

// // export default function Akira3D({ onReady }) {
// //     const containerRef = useRef(null);
// //     const onReadyRef   = useRef(onReady);
// //     useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

// //     useEffect(() => {
// //         const container = containerRef.current;
// //         if (!container) return;

// //         const width  = container.clientWidth  || window.innerWidth / 2;
// //         const height = container.clientHeight || window.innerHeight;

// //         const scene  = new THREE.Scene();
// //         scene.background = null;

// //         const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);

// //         const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// //         renderer.setSize(width, height);
// //         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// //         renderer.outputColorSpace = THREE.SRGBColorSpace;
// //         container.appendChild(renderer.domElement);

// //         scene.add(new THREE.AmbientLight(0xffffff, 2));
// //         const dir = new THREE.DirectionalLight(0xffffff, 4);
// //         dir.position.set(5, 10, 7);
// //         scene.add(dir);
// //         const fill = new THREE.DirectionalLight(0x00d4ff, 2);
// //         fill.position.set(-5, 2, -3);
// //         scene.add(fill);
// //         const rim = new THREE.PointLight(0xff003c, 2, 20);
// //         rim.position.set(0, -2, 3);
// //         scene.add(rim);

// //         let animId = null;
// //         let model  = null; // ← déclaré ici dans le scope useEffect

// //         const loader = new GLTFLoader();
// //         loader.load(akiraModelUrl, (gltf) => {
// //             model = gltf.scene; // ← assigne sans "const" — modifie le let du scope

// //             const box    = new THREE.Box3().setFromObject(model);
// //             const center = box.getCenter(new THREE.Vector3());
// //             const size   = box.getSize(new THREE.Vector3());
// //             model.position.sub(center);

// //             const maxDim   = Math.max(size.x, size.y, size.z);
// //             const fovRad   = camera.fov * (Math.PI / 180);
// //             const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.3;
// //             const posY     = 10;

// //             camera.position.set(0, posY, initialZ);
// //             camera.lookAt(0, 0, 0);
// //             scene.add(model);

// //             if (onReadyRef.current) onReadyRef.current({ camera, initialZ, model });

// //         }, undefined, (err) => console.error('[Akira3D]', err));

// //         function animate() {
// //             animId = requestAnimationFrame(animate);
// //             renderer.render(scene, camera);
// //         }
// //         animate();

// //         const onResize = () => {
// //             const w = container.clientWidth;
// //             const h = container.clientHeight;
// //             camera.aspect = w / h;
// //             camera.updateProjectionMatrix();
// //             renderer.setSize(w, h);
// //         };
// //         window.addEventListener('resize', onResize);

// //         return () => {
// //             cancelAnimationFrame(animId);
// //             window.removeEventListener('resize', onResize);
// //             renderer.dispose();
// //             if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
// //         };
// //     }, []);

// //     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// // }

// import { useEffect, useRef } from 'react';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import * as THREE from 'three';
// import akiraModelUrl from '../assets/models/akira_tetsuo_first_3d_model.glb?url';

// export default function Akira3D({ onReady }) {
//     const containerRef = useRef(null);
//     const onReadyRef   = useRef(onReady);
//     useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         const width  = container.clientWidth  || window.innerWidth / 2;
//         const height = container.clientHeight || window.innerHeight;

//         // Scene
//         const scene = new THREE.Scene();
//         scene.background = null;

//         // Camera
//         const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);

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
//         const fill = new THREE.DirectionalLight(0x00d4ff, 2);
//         fill.position.set(-5, 2, -3);
//         scene.add(fill);
//         const rim = new THREE.PointLight(0xff003c, 2, 20);
//         rim.position.set(0, -2, 3);
//         scene.add(rim);

//         let animId   = null;
//         let destroyed = false;

//         // Load model
//         const loader = new GLTFLoader();
//         loader.load(
//             akiraModelUrl,
//             (gltf) => {
//                 const model = gltf.scene;

//                 const box    = new THREE.Box3().setFromObject(model);
//                 const center = box.getCenter(new THREE.Vector3());
//                 const size   = box.getSize(new THREE.Vector3());
//                 model.position.sub(center);

//                 const maxDim   = Math.max(size.x, size.y, size.z);
//                 const fovRad   = camera.fov * (Math.PI / 180);
//                 const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.3;
//                 const posY     = 10;

//                 camera.position.set(0, posY, initialZ);
//                 camera.lookAt(0, 0, 0);
//                 camera.updateMatrixWorld();
//                 scene.add(model);

//                 if (onReadyRef.current) {
//                     onReadyRef.current({ camera, initialZ, model });
//                 }
//             },
//             undefined,
//             (err) => console.error('[Akira3D] load error:', err)
//         );

//         // Render loop — tourne toujours, Three.js voit chaque changement de caméra/modèle
//         function animate() {
//             if (destroyed) return;
//             animId = requestAnimationFrame(animate);
//             renderer.render(scene, camera);
//         }
//         animate();

//         // Resize
//         const onResize = () => {
//             const w = container.clientWidth;
//             const h = container.clientHeight;
//             camera.aspect = w / h;
//             camera.updateProjectionMatrix();
//             renderer.setSize(w, h);
//         };
//         window.addEventListener('resize', onResize);

//         return () => {
//             destroyed = true;
//             cancelAnimationFrame(animId);
//             window.removeEventListener('resize', onResize);
//             renderer.dispose();
//             if (container.contains(renderer.domElement)) {
//                 container.removeChild(renderer.domElement);
//             }
//         };
//     }, []);

//     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// }

import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import akiraModelUrl from '../assets/models/akira_tetsuo_first_3d_model.glb?url';

export default function Akira3D({ onReady }) {
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
        const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);

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
        const fill = new THREE.DirectionalLight(0x00d4ff, 2);
        fill.position.set(-5, 2, -3);
        scene.add(fill);
        const rim = new THREE.PointLight(0xff003c, 2, 20);
        rim.position.set(0, -2, 3);
        scene.add(rim);

        let animId   = null;
        let destroyed = false;

        // Load model
        const loader = new GLTFLoader();
        loader.load(
            akiraModelUrl,
            (gltf) => {
                const model = gltf.scene;

                const box    = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size   = box.getSize(new THREE.Vector3());
                model.position.sub(center);

                const maxDim   = Math.max(size.x, size.y, size.z);
                const fovRad   = camera.fov * (Math.PI / 180);
                const initialZ = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.3;
                const posY     = 10;

                camera.position.set(0, posY, initialZ);
                camera.lookAt(0, 0, 0);
                camera.updateMatrixWorld();
                scene.add(model);

                if (onReadyRef.current) {
                    onReadyRef.current({ camera, initialZ, model });
                }
            },
            undefined,
            (err) => console.error('[Akira3D] load error:', err)
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
