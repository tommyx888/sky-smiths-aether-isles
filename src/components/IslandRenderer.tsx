
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
      
      // Position clouds around the islands
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
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Make islands gently float with different phases
      animateIslands(scene, Date.now() * 0.001);
      
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

  // Create the main headquarters island
  const createMainHeadquarters = (scene: THREE.Scene) => {
    // Create the main island (slightly larger)
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

    // Create a simple headquarters building
    const hqGeometry = new THREE.CylinderGeometry(1.5, 2, 1.5, 8);
    const hqMaterial = new THREE.MeshLambertMaterial({ color: 0xc87f51 });
    const hq = new THREE.Mesh(hqGeometry, hqMaterial);
    hq.position.y = 0.8;
    hq.castShadow = true;
    hq.receiveShadow = true;
    hq.userData = { type: "building", buildingType: "headquarters", id: "headquarters", isMainHq: true };
    scene.add(hq);

    // Add a small dome on top
    const domeGeometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshLambertMaterial({ color: 0x5da5e8 });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 1.7;
    dome.castShadow = true;
    dome.receiveShadow = true;
    dome.userData = { parentId: "headquarters" };
    scene.add(dome);
  };

  // Function to animate islands with floating effect
  const animateIslands = (scene: THREE.Scene, time: number) => {
    scene.children.forEach((child) => {
      if (child.userData && child.userData.type === "island") {
        const offset = child.userData.floatOffset || 0;
        child.position.y = -0.6 + Math.sin(time * 0.5 + offset) * 0.1;
        
        // Also animate any child elements tied to this island
        const islandId = child.userData.id;
        scene.children.forEach((possibleChild) => {
          if (possibleChild.userData && possibleChild.userData.parentId === islandId) {
            possibleChild.position.y = child.position.y + 0.6; // Maintain relative position
          }
          
          if (possibleChild.userData && possibleChild.userData.buildingId === islandId) {
            possibleChild.position.y = child.position.y + 1.4; // Position building on top
          }
        });
      }
    });
  };

  // Create connection between islands (a bridge)
  const createConnection = (scene: THREE.Scene, start: THREE.Vector3, end: THREE.Vector3) => {
    const direction = new THREE.Vector3().subVectors(end, start);
    const distance = direction.length();
    direction.normalize();
    
    const bridgeGeometry = new THREE.BoxGeometry(distance, 0.1, 0.3);
    const bridgeMaterial = new THREE.MeshLambertMaterial({ color: 0xd6a757 });
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    
    // Position bridge at midpoint
    const midpoint = new THREE.Vector3().addVectors(
      start, 
      new THREE.Vector3().copy(direction).multiplyScalar(distance / 2)
    );
    bridge.position.copy(midpoint);
    
    // Rotate bridge to connect islands
    bridge.lookAt(end);
    bridge.rotateY(Math.PI / 2);
    
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    bridge.userData = { type: "bridge" };
    
    scene.add(bridge);
    
    // Add decorative ropes/cables
    const ropeGeometry = new THREE.CylinderGeometry(0.03, 0.03, distance + 0.2, 8);
    const ropeMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    // Left rope
    const leftRope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    leftRope.position.copy(midpoint);
    leftRope.position.y += 0.15;
    leftRope.position.z += 0.2;
    leftRope.lookAt(end);
    leftRope.rotateX(Math.PI / 2);
    scene.add(leftRope);
    
    // Right rope
    const rightRope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rightRope.position.copy(midpoint);
    rightRope.position.y += 0.15;
    rightRope.position.z -= 0.2;
    rightRope.lookAt(end);
    rightRope.rotateX(Math.PI / 2);
    scene.add(rightRope);
  };

  // Update buildings when state changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    
    // Remove old building islands and bridges
    const objectsToRemove = [];
    scene.children.forEach((child) => {
      if ((child.userData && child.userData.type === "building" && !child.userData.isMainHq) || 
          (child.userData && child.userData.type === "island" && child.userData.id !== "headquarters") ||
          (child.userData && child.userData.type === "bridge")) {
        objectsToRemove.push(child);
      }
    });
    
    // Remove all objects in a separate loop to avoid issues with scene children being modified during iteration
    objectsToRemove.forEach(obj => scene.remove(obj));
    
    // Add building islands from state
    state.player.island.buildings.forEach((building) => {
      // Skip if this is the headquarters (which we handle separately)
      if (building.position.x === 5 && building.position.y === 5) return;
      
      const buildingInfo = BUILDINGS_CONFIG[building.type];
      
      // Calculate position on circular arrangement around HQ
      // We convert grid coordinates to 3D space
      const gridToWorldScale = 5; // Increase this value to space buildings further apart
      const centerX = 5;
      const centerZ = 5;
      
      // Direct mapping from grid to world space
      const x = (building.position.x - centerX) * gridToWorldScale;
      const z = (building.position.y - centerZ) * gridToWorldScale;
      
      console.log(`Placing building at grid (${building.position.x}, ${building.position.y}) -> world (${x}, ${z})`);
      
      // Create a small island for this building
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

      // Create grass top layer
      const grassGeometry = new THREE.CylinderGeometry(islandSize - 0.1, islandSize, 0.2, 32);
      const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x567d46 });
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.set(x, 0, z);
      grass.receiveShadow = true;
      grass.userData = { parentId: building.id };
      scene.add(grass);
      
      // Create the building model
      let geometry, material, color;
      
      switch (building.type) {
        case "steam_generator":
          geometry = new THREE.CylinderGeometry(0.7, 0.8, 1.5, 8);
          color = 0xd6a757; // brass
          break;
        case "ore_mine":
          geometry = new THREE.BoxGeometry(1.2, 1.0, 1.2);
          color = 0x8B4513; // brown
          break;
        case "aether_collector":
          geometry = new THREE.SphereGeometry(0.8, 12, 12);
          color = 0xa67de8; // aether purple
          break;
        case "workshop":
          geometry = new THREE.BoxGeometry(1.5, 1.2, 1.5);
          color = 0xc87f51; // copper
          break;
        case "barracks":
          geometry = new THREE.BoxGeometry(1.5, 1.0, 1.2);
          color = 0x7d7d7d; // gray
          break;
        case "sky_forge":
          geometry = new THREE.BoxGeometry(1.5, 1.4, 1.5);
          color = 0xff5555; // reddish
          break;
        case "sky_dock":
          geometry = new THREE.BoxGeometry(1.8, 0.7, 1.2);
          color = 0x5da5e8; // blue
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
      
      // Create bridge to the headquarters (center) for buildings directly adjacent to HQ
      const isAdjacentToHQ = 
        (Math.abs(building.position.x - 5) === 1 && building.position.y === 5) || 
        (Math.abs(building.position.y - 5) === 1 && building.position.x === 5);
      
      if (isAdjacentToHQ) {
        createConnection(
          scene, 
          new THREE.Vector3(x, 0, z), 
          new THREE.Vector3(0, 0, 0)  // HQ is at center (0,0,0) in world coords
        );
      } else {
        // Find an existing adjacent building to connect to
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
  
  // Function to find an adjacent building
  const findAdjacentBuilding = (building: any, buildings: any[]) => {
    // Check all 4 adjacent positions
    const directions = [
      { dx: 1, dy: 0 },  // right
      { dx: -1, dy: 0 }, // left
      { dx: 0, dy: 1 },  // down
      { dx: 0, dy: -1 }, // up
    ];
    
    // First, check for headquarters at position (5,5)
    for (const dir of directions) {
      const adjX = building.position.x + dir.dx;
      const adjY = building.position.y + dir.dy;
      
      if (adjX === 5 && adjY === 5) {
        // Return a mock object representing HQ
        return { position: { x: 5, y: 5 } };
      }
    }
    
    // Then check for other buildings
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
