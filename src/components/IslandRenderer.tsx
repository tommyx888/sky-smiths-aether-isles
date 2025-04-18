
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "@/context/GameContext";
import { BUILDINGS_CONFIG } from "@/config/gameConfig";

const IslandRenderer = () => {
  const { state } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 10, 10);
    camera.lookAt(5, 0, 5);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x89c4f4);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create skybox
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x89c4f4,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Add simple clouds
    for (let i = 0; i < 20; i++) {
      const cloudGeometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 8, 8);
      const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      
      // Position clouds around the island
      const distance = Math.random() * 30 + 20;
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 10 - 5;
      
      cloud.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );
      
      scene.add(cloud);
    }

    // Create floating island base
    const islandGeometry = new THREE.CylinderGeometry(7, 9, 2, 32);
    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.y = -1;
    island.castShadow = true;
    island.receiveShadow = true;
    scene.add(island);

    // Create grass top layer
    const grassGeometry = new THREE.CylinderGeometry(6.9, 7.1, 0.2, 32);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x567d46 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.y = 0;
    grass.receiveShadow = true;
    scene.add(grass);

    // Add grid for building placement
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Make the island gently float
      const time = Date.now() * 0.001;
      island.position.y = -1 + Math.sin(time * 0.5) * 0.1;
      grass.position.y = island.position.y + 1;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  // Update buildings when state changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Remove old building models
    sceneRef.current.children.forEach((child) => {
      if (child.userData && child.userData.type === "building") {
        sceneRef.current?.remove(child);
      }
    });
    
    // Add building models from state
    state.player.island.buildings.forEach((building) => {
      // Create placeholder building models
      const buildingInfo = BUILDINGS_CONFIG[building.type];
      
      // Calculate position on grid
      const gridSize = 1; // Each grid cell is 1x1 units
      const gridOffsetX = -5 + gridSize / 2; // Center grid at origin
      const gridOffsetZ = -5 + gridSize / 2;
      
      const x = gridOffsetX + building.position.x * gridSize;
      const z = gridOffsetZ + building.position.y * gridSize;
      
      // Create a simple box as a placeholder for actual 3D models
      let geometry, material, color;
      
      switch (building.type) {
        case "steam_generator":
          geometry = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 8);
          color = 0xd6a757; // brass
          break;
        case "ore_mine":
          geometry = new THREE.BoxGeometry(0.8, 0.5, 0.8);
          color = 0x8B4513; // brown
          break;
        case "aether_collector":
          geometry = new THREE.SphereGeometry(0.4, 8, 8);
          color = 0xa67de8; // aether purple
          break;
        case "workshop":
          geometry = new THREE.BoxGeometry(1.8, 0.8, 1.8);
          color = 0xc87f51; // copper
          break;
        case "barracks":
          geometry = new THREE.BoxGeometry(1.8, 0.7, 0.8);
          color = 0x7d7d7d; // gray
          break;
        case "sky_forge":
          geometry = new THREE.BoxGeometry(1.8, 1, 1.8);
          color = 0xff5555; // reddish
          break;
        case "sky_dock":
          geometry = new THREE.BoxGeometry(1.8, 0.4, 0.8);
          color = 0x5da5e8; // blue
          break;
        default:
          geometry = new THREE.BoxGeometry(0.8, 0.5, 0.8);
          color = 0xffffff;
      }
      
      material = new THREE.MeshLambertMaterial({ color });
      const model = new THREE.Mesh(geometry, material);
      
      model.position.set(x, 0.25 + building.level * 0.1, z);
      model.castShadow = true;
      model.receiveShadow = true;
      model.userData = { type: "building", id: building.id };
      
      sceneRef.current?.add(model);
    });
  }, [state.player.island.buildings]);

  return <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />;
};

export default IslandRenderer;
