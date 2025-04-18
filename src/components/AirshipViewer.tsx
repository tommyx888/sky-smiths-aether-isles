
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Airship } from "@/types/game";

const AirshipViewer = ({ airship }: { airship?: Airship }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a placeholder airship model
    // This is just a simple airship-like shape
    const createAirshipModel = (type: string = "scout") => {
      // Remove any existing airship
      scene.children.forEach((child) => {
        if (child.userData && child.userData.type === "airship") {
          scene.remove(child);
        }
      });
      
      // Create airship group
      const airshipGroup = new THREE.Group();
      airshipGroup.userData = { type: "airship" };
      
      // Create different models based on type
      let bodyGeometry, bodyMaterial, bodyColor;
      
      switch (type) {
        case "scout":
          bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
          bodyColor = 0xd6a757; // brass
          break;
        case "fighter":
          bodyGeometry = new THREE.CylinderGeometry(0.4, 0.6, 2.2, 8);
          bodyColor = 0xc87f51; // copper
          break;
        case "bomber":
          bodyGeometry = new THREE.CylinderGeometry(0.5, 0.8, 2.5, 8);
          bodyColor = 0x7d7d7d; // gray
          break;
        case "tanker":
          bodyGeometry = new THREE.CylinderGeometry(0.6, 0.9, 3, 8);
          bodyColor = 0x5da5e8; // blue
          break;
        default:
          bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
          bodyColor = 0xd6a757;
      }
      
      bodyMaterial = new THREE.MeshPhongMaterial({ color: bodyColor });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      airshipGroup.add(body);
      
      // Add cabin
      const cabinGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.5);
      const cabinMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.y = -0.3;
      airshipGroup.add(cabin);
      
      // Add propellers
      const propellerGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.05);
      const propellerMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
      
      const propeller1 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller1.position.set(-1, 0, 0);
      propeller1.userData = { rotate: true };
      airshipGroup.add(propeller1);
      
      const propeller2 = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller2.position.set(1, 0, 0);
      propeller2.userData = { rotate: true };
      airshipGroup.add(propeller2);
      
      // Add fins
      const finGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.3);
      const finMaterial = new THREE.MeshPhongMaterial({ color: bodyColor });
      
      const topFin = new THREE.Mesh(finGeometry, finMaterial);
      topFin.position.set(0, 0.5, -0.5);
      airshipGroup.add(topFin);
      
      const bottomFin = new THREE.Mesh(finGeometry, finMaterial);
      bottomFin.position.set(0, -0.5, -0.5);
      airshipGroup.add(bottomFin);
      
      // Add the airship to the scene
      scene.add(airshipGroup);
      
      return airshipGroup;
    };
    
    // Create default airship or the specified one
    const airshipModel = createAirshipModel(airship?.type || "scout");
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the airship slightly
      if (airshipModel) {
        airshipModel.rotation.y += 0.005;
        
        // Rotate propellers
        airshipModel.children.forEach((child) => {
          if (child.userData && child.userData.rotate) {
            child.rotation.y += 0.1;
          }
        });
      }
      
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
  }, [airship]);
  
  return (
    <div ref={containerRef} className="w-full h-64 rounded-lg overflow-hidden" />
  );
};

export default AirshipViewer;
