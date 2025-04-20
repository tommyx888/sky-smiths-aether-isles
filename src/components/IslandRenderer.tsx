import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useGame } from "@/context/GameContext";
import { BUILDINGS_CONFIG } from "@/config/gameConfig";
import BuildingModel from "./BuildingModel";
import { Canvas } from "@react-three/fiber";

const IslandRenderer = () => {
  const { state } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const [buildings, setBuildings] = useState(state.player.island.buildings);
  
  useEffect(() => {
    setBuildings(state.player.island.buildings);
  }, [state.player.island.buildings]);

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
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x89c4f4);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

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

    // Create main headquarters in the center
    createMainHeadquarters(scene);
    
    const animate = () => {
      requestAnimationFrame(animate);
      animateIslands(scene, Date.now() * 0.001);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const createMainHeadquarters = (scene: THREE.Scene) => {
    // Check if we want to create the island platform or if the GLB model already includes it
    const hqIncludesIsland = true; // Set this to true if your GLB model includes the island
    
    if (!hqIncludesIsland) {
      // Create the main island (slightly larger) only if the model doesn't include it
      const islandGeometry = new THREE.CylinderGeometry(3, 3.5, 1.2, 32);
      const islandMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const island = new THREE.Mesh(islandGeometry, islandMaterial);
      island.position.y = -0.6;
      island.castShadow = true;
      island.receiveShadow = true;
      island.userData = { type: "island", id: "headquarters", floatOffset: Math.random() * Math.PI * 2 };
      scene.add(island);

      // Create grass top layer
      const grassGeometry = new THREE.CylinderGeometry(2.9, 3, 0.2, 32);
      const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x567d46 });
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.y = 0;
      grass.receiveShadow = true;
      grass.userData = { parentId: "headquarters" };
      scene.add(grass);
    }

    // Use our building model component by creating a custom element
    // We'll just create a placeholder mesh here and our React component will render the model
    const hqGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const hqMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const hqPlaceholder = new THREE.Mesh(hqGeometry, hqMaterial);
    hqPlaceholder.position.y = hqIncludesIsland ? 0 : 0.8; // Adjust position based on whether model includes island
    hqPlaceholder.userData = { 
      type: "building", 
      buildingType: "headquarters", 
      id: "headquarters", 
      isMainHq: true,
      includesIsland: hqIncludesIsland
    };
    scene.add(hqPlaceholder);
    
    // Log to confirm we're creating the main HQ
    console.log("Created main HQ placeholder for GLB model");
  };

  const animateIslands = (scene: THREE.Scene, time: number) => {
    scene.children.forEach((child) => {
      if (child.userData && child.userData.type === "island") {
        const offset = child.userData.floatOffset || 0;
        child.position.y = -0.6 + Math.sin(time * 0.5 + offset) * 0.1;
        
        const islandId = child.userData.id;
        scene.children.forEach((possibleChild) => {
          if (possibleChild.userData && possibleChild.userData.parentId === islandId) {
            possibleChild.position.y = child.position.y + 0.6;
          }
          
          if (possibleChild.userData && possibleChild.userData.buildingId === islandId) {
            possibleChild.position.y = child.position.y + 1.4;
          }
        });
      }
    });
  };

  const createConnection = (scene: THREE.Scene, start: THREE.Vector3, end: THREE.Vector3) => {
    const direction = new THREE.Vector3().subVectors(end, start);
    const distance = direction.length();
    direction.normalize();
    
    const bridgeGeometry = new THREE.BoxGeometry(distance, 0.1, 0.3);
    const bridgeMaterial = new THREE.MeshLambertMaterial({ color: 0xd6a757 });
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    
    const midpoint = new THREE.Vector3().addVectors(
      start, 
      new THREE.Vector3().copy(direction).multiplyScalar(distance / 2)
    );
    bridge.position.copy(midpoint);
    
    bridge.lookAt(end);
    bridge.rotateY(Math.PI / 2);
    
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    bridge.userData = { type: "bridge" };
    
    scene.add(bridge);
    
    const ropeGeometry = new THREE.CylinderGeometry(0.03, 0.03, distance + 0.2, 8);
    const ropeMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    const leftRope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    leftRope.position.copy(midpoint);
    leftRope.position.y += 0.15;
    leftRope.position.z += 0.2;
    leftRope.lookAt(end);
    leftRope.rotateX(Math.PI / 2);
    scene.add(leftRope);
    
    const rightRope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rightRope.position.copy(midpoint);
    rightRope.position.y += 0.15;
    rightRope.position.z -= 0.2;
    rightRope.lookAt(end);
    rightRope.rotateX(Math.PI / 2);
    scene.add(rightRope);
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    
    const objectsToRemove = [];
    scene.children.forEach((child) => {
      if ((child.userData && child.userData.type === "building" && !child.userData.isMainHq) || 
          (child.userData && child.userData.type === "island" && child.userData.id !== "headquarters") ||
          (child.userData && child.userData.type === "bridge")) {
        objectsToRemove.push(child);
      }
    });
    
    objectsToRemove.forEach(obj => scene.remove(obj));
    
    state.player.island.buildings.forEach((building) => {
      if (building.position.x === 5 && building.position.y === 5) return;
      
      const buildingInfo = BUILDINGS_CONFIG[building.type];
      
      const gridToWorldScale = 5;
      const centerX = 5;
      const centerZ = 5;
      
      const x = (building.position.x - centerX) * gridToWorldScale;
      const z = (building.position.y - centerZ) * gridToWorldScale;
      
      console.log(`Placing building at grid (${building.position.x}, ${building.position.y}) -> world (${x}, ${z})`);
      
      const islandSize = 1.5 + building.level * 0.2;
      const islandGeometry = new THREE.CylinderGeometry(islandSize, islandSize + 0.3, 0.8, 32);
      const islandMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const island = new THREE.Mesh(islandGeometry, islandMaterial);
      island.position.set(x, -0.5, z);
      island.castShadow = true;
      island.receiveShadow = true;
      island.userData = { 
        type: "island", 
        id: building.id,
        floatOffset: Math.random() * Math.PI * 2
      };
      scene.add(island);

      const grassGeometry = new THREE.CylinderGeometry(islandSize - 0.1, islandSize, 0.2, 32);
      const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x567d46 });
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.set(x, 0, z);
      grass.receiveShadow = true;
      grass.userData = { parentId: building.id };
      scene.add(grass);
      
      let geometry, material, color;
      
      switch (building.type) {
        case "steam_generator":
          geometry = new THREE.CylinderGeometry(0.7, 0.8, 1.5, 8);
          color = 0xd6a757;
          break;
        case "ore_mine":
          geometry = new THREE.BoxGeometry(1.2, 1.0, 1.2);
          color = 0x8B4513;
          break;
        case "aether_collector":
          geometry = new THREE.SphereGeometry(0.8, 12, 12);
          color = 0xa67de8;
          break;
        case "workshop":
          geometry = new THREE.BoxGeometry(1.5, 1.2, 1.5);
          color = 0xc87f51;
          break;
        case "barracks":
          geometry = new THREE.BoxGeometry(1.5, 1.0, 1.2);
          color = 0x7d7d7d;
          break;
        case "sky_forge":
          geometry = new THREE.BoxGeometry(1.5, 1.4, 1.5);
          color = 0xff5555;
          break;
        case "sky_dock":
          geometry = new THREE.BoxGeometry(1.8, 0.7, 1.2);
          color = 0x5da5e8;
          break;
        default:
          geometry = new THREE.BoxGeometry(1.2, 0.8, 1.2);
          color = 0xffffff;
      }
      
      material = new THREE.MeshLambertMaterial({ color });
      const model = new THREE.Mesh(geometry, material);
      
      model.position.set(x, 0.6 + building.level * 0.1, z);
      model.castShadow = true;
      model.receiveShadow = true;
      model.userData = { 
        type: "building",
        buildingType: building.type,
        id: building.id, 
        buildingId: building.id 
      };
      
      scene.add(model);
      
      const isAdjacentToHQ = 
        (Math.abs(building.position.x - 5) === 1 && building.position.y === 5) || 
        (Math.abs(building.position.y - 5) === 1 && building.position.x === 5);
      
      if (isAdjacentToHQ) {
        createConnection(
          scene, 
          new THREE.Vector3(x, 0, z), 
          new THREE.Vector3(0, 0, 0)
        );
      } else {
        const adjacentBuilding = findAdjacentBuilding(building, state.player.island.buildings);
        
        if (adjacentBuilding) {
          const adjX = (adjacentBuilding.position.x - centerX) * gridToWorldScale;
          const adjZ = (adjacentBuilding.position.y - centerZ) * gridToWorldScale;
          
          createConnection(
            scene, 
            new THREE.Vector3(x, 0, z), 
            new THREE.Vector3(adjX, 0, adjZ)
          );
        }
      }
    });
  }, [state.player.island.buildings]);
  
  const findAdjacentBuilding = (building: any, buildings: any[]) => {
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];
    
    for (const dir of directions) {
      const adjX = building.position.x + dir.dx;
      const adjY = building.position.y + dir.dy;
      
      if (adjX === 5 && adjY === 5) {
        return { position: { x: 5, y: 5 } };
      }
    }
    
    for (const dir of directions) {
      const adjX = building.position.x + dir.dx;
      const adjY = building.position.y + dir.dy;
      
      const adjacentBuilding = buildings.find(b => 
        b.id !== building.id && 
        b.position.x === adjX && 
        b.position.y === adjY
      );
      
      if (adjacentBuilding) {
        return adjacentBuilding;
      }
    }
    
    return null;
  };

  return <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />;
};

export default IslandRenderer;
