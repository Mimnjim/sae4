import { useEffect, useRef } from "react";
import * as THREE from "three";
import { loadGLTFWithProperPaths } from '../../../utils/gltfLoader.js';

export default function Akira3D({ onReady }) {
  const containerRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const akiraModelUrl = '/models/Tetsuo.glb';

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let renderStarted = false;
    let cleanupRenderer = null;

    // OPTIMISATION: Intersection Observer pour lazy load le modèle
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !renderStarted && !destroyed) {
          renderStarted = true;
          cleanupRenderer = initializeScene();
        }
      },
      { rootMargin: '200px' } // Charger 200px avant d'être visible
    );
    intersectionObserver.observe(container);

    const initializeScene = () => {
      // Mesures initiales
      let width = container.clientWidth || window.innerWidth / 2;
      let height = container.clientHeight || window.innerHeight;

      // Scene
      const scene = new THREE.Scene();
      scene.background = null;

      // Camera
      const camera = new THREE.PerspectiveCamera(80, width / height, 0.01, 250);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        precision: "highp",
        stencil: false,
        depth: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

      let animId = null;

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
      loadGLTFWithProperPaths(akiraModelUrl)
          .then((gltf) => {
              if (destroyed) return;
              const model = gltf.scene;

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const upwardOffset = 0;

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 6 / maxDim;
          model.scale.setScalar(scale);

          model.position.x -= center.x;
          model.position.y -= center.y;
          model.position.z -= center.z;
          
          const initialZ = 7;
          camera.position.set(0, 1.2 + upwardOffset, initialZ);
          camera.lookAt(0, upwardOffset, 0);
          model.rotation.x = Math.PI / 9;
          camera.updateMatrixWorld();
          scene.add(model);

          onResize();
          if (onReadyRef.current) {
              onReadyRef.current({ camera, initialZ, model });
          }
          })
          .catch((err) => console.error("ERREUR CHARGEMENT :", err));

      // Animation LOOP
      function animate() {
        if (destroyed) return;
        animId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener("resize", onResize);

      // Retourner la fonction de cleanup
      return () => {
        clearTimeout(resizeTimer);
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        
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
    };

    return () => {
      destroyed = true;
      intersectionObserver.disconnect();
      // Appeler le cleanup du renderer s'il a été initialisé
      if (cleanupRenderer) {
        cleanupRenderer();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
}
