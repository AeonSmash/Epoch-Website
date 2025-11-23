import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let animationId: number | null = null;
let orb: THREE.Mesh | null = null;

export function initThreeScene(container: HTMLElement): () => void {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  // Try to load GLB model
  const loader = new GLTFLoader();
  const modelPath = '/models/oracle_chamber.glb';

  loader.load(
    modelPath,
    (gltf) => {
      console.log('[ThreeScene] GLB model loaded successfully');
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      scene?.add(model);
    },
    (progress) => {
      console.log('[ThreeScene] Loading progress:', progress);
    },
    (error) => {
      console.warn('[ThreeScene] Failed to load GLB, using fallback orb:', error);
      createFallbackOrb();
    }
  );

  // Fallback: Create glowing orb if GLB fails
  function createFallbackOrb() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5,
    });
    orb = new THREE.Mesh(geometry, material);
    scene?.add(orb);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene?.add(glow);
  }

  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate);

    // Rotate orb if fallback is used
    if (orb) {
      orb.rotation.y += 0.01;
    }

    // Rotate camera slightly for dynamic feel
    if (camera) {
      const time = Date.now() * 0.0005;
      camera.position.x = Math.sin(time) * 0.5;
      camera.position.y = 2 + Math.cos(time * 0.7) * 0.3;
      camera.lookAt(0, 0, 0);
    }

    renderer?.render(scene!, camera!);
  }

  animate();

  // Handle window resize
  const handleResize = () => {
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', handleResize);

  // Cleanup function
  return () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', handleResize);
    if (renderer) {
      container.removeChild(renderer.domElement);
      renderer.dispose();
    }
    scene = null;
    camera = null;
    renderer = null;
    orb = null;
  };
}

