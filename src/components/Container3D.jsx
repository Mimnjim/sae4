import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const Container3D = ({ label }) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Vérifier que le conteneur a des dimensions
        if (width === 0 || height === 0) {
            console.warn('Container dimensions are 0');
            return;
        }

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Post-processing
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.5,
            0.4,
            0.85
        );
        composer.addPass(bloomPass);

        // Couleurs
        const cyan = 0x00d4ff;
        const magenta = 0xff00ff;
        const violet = 0x8000ff;
        const pink = 0xff0080;

        // Geometry & Materials
        const geometry = new THREE.BoxGeometry(3, 4, 0.5);
        const materials = [
            new THREE.MeshPhongMaterial({ color: cyan, emissive: cyan, emissiveIntensity: 0.8, shininess: 120 }),
            new THREE.MeshPhongMaterial({ color: magenta, emissive: magenta, emissiveIntensity: 0.8, shininess: 120 }),
            new THREE.MeshPhongMaterial({ color: violet, emissive: violet, emissiveIntensity: 0.7, shininess: 120 }),
            new THREE.MeshPhongMaterial({ color: pink, emissive: pink, emissiveIntensity: 0.7, shininess: 120 }),
            new THREE.MeshPhongMaterial({ color: cyan, emissive: cyan, emissiveIntensity: 0.8, shininess: 120 }),
            new THREE.MeshPhongMaterial({ color: magenta, emissive: magenta, emissiveIntensity: 0.8, shininess: 120 })
        ];

        const box = new THREE.Mesh(geometry, materials);
        scene.add(box);

        // Wireframe
        const wireframeGeometry = new THREE.BoxGeometry(3, 4, 0.5);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: cyan,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        wireframe.position.z = 0.02;
        box.add(wireframe);

        // Lighting
        const cyanLight = new THREE.PointLight(cyan, 1.5, 50);
        cyanLight.position.set(8, 5, 8);
        scene.add(cyanLight);

        const magentaLight = new THREE.PointLight(magenta, 1.5, 50);
        magentaLight.position.set(-8, -5, 8);
        scene.add(magentaLight);

        const violetLight = new THREE.PointLight(violet, 1, 40);
        violetLight.position.set(0, 8, -5);
        scene.add(violetLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Animation
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            box.rotation.x += 0.002;
            box.rotation.y += 0.004;
            box.position.y = Math.sin(Date.now() * 0.0008) * 0.3;
            box.position.x = Math.cos(Date.now() * 0.0006) * 0.2;
            
            cyanLight.intensity = 1.5 + Math.sin(Date.now() * 0.002) * 0.5;
            magentaLight.intensity = 1.5 + Math.cos(Date.now() * 0.0025) * 0.5;
            violetLight.intensity = 1 + Math.sin(Date.now() * 0.0015) * 0.3;

            composer.render();
        };
        animate();

        // Resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            wireframeGeometry.dispose();
            materials.forEach(m => m.dispose());
            wireframeMaterial.dispose();
            renderer.dispose();
            composer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="container-3d" />;
};

export default Container3D;