
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BuildingType } from '@/types/game';
import { useState, useEffect } from 'react';
import * as THREE from 'three';

interface BuildingModelProps {
  type: BuildingType;
  position: { x: number; y: number; z: number };
  scale?: number;
  isMainHq?: boolean;
  includesIsland?: boolean;
}

const BuildingModel = ({ type, position, scale = 1, isMainHq = false, includesIsland = false }: BuildingModelProps) => {
  const [modelError, setModelError] = useState(false);
  
  // Load headquarters model if it's the main HQ or type is headquarters
  if (isMainHq || type === "headquarters") {
    try {
      const gltf = useLoader(GLTFLoader, '/models/headquarters.glb');
      
      useEffect(() => {
        console.log('Headquarters model loaded successfully:', gltf);
        
        // Scale the model
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log('Found mesh in headquarters model:', child.name);
          }
        });
      }, [gltf]);
      
      // Position adjustment if the model already includes an island
      const yPosition = includesIsland ? position.y - 0.6 : position.y;
      
      return (
        <primitive 
          object={gltf.scene} 
          position={[position.x, yPosition, position.z]}
          scale={[scale, scale, scale]}
        />
      );
    } catch (error) {
      console.error('Error loading headquarters model:', error);
      setModelError(true);
      // If there's an error loading the model, we'll fall back to the placeholder
      return (
        <mesh position={[position.x, position.y, position.z]}>
          <meshLambertMaterial color={getBuildingColor("headquarters")} />
          <cylinderGeometry args={[1.5, 2, 1.5, 8]} />
        </mesh>
      );
    }
  }
  
  // For other buildings, use the existing placeholder geometry
  return (
    <mesh position={[position.x, position.y, position.z]}>
      <meshLambertMaterial color={getBuildingColor(type)} />
      {getPlaceholderGeometry(type, scale)}
    </mesh>
  );
};

const getBuildingColor = (type: BuildingType): string => {
  switch (type) {
    case "steam_generator":
      return "#d6a757";
    case "ore_mine":
      return "#8B4513";
    case "aether_collector":
      return "#a67de8";
    case "workshop":
      return "#c87f51";
    case "barracks":
      return "#7d7d7d";
    case "sky_forge":
      return "#ff5555";
    case "sky_dock":
      return "#5da5e8";
    case "headquarters":
      return "#4682B4"; // Steel blue color for headquarters
    default:
      return "#ffffff";
  }
};

const getPlaceholderGeometry = (type: BuildingType, scale: number) => {
  switch (type) {
    case "steam_generator":
      return <cylinderGeometry args={[0.7 * scale, 0.8 * scale, 1.5 * scale, 8]} />;
    case "ore_mine":
      return <boxGeometry args={[1.2 * scale, 1.0 * scale, 1.2 * scale]} />;
    case "aether_collector":
      return <sphereGeometry args={[0.8 * scale, 12, 12]} />;
    case "workshop":
      return <boxGeometry args={[1.5 * scale, 1.2 * scale, 1.5 * scale]} />;
    case "barracks":
      return <boxGeometry args={[1.5 * scale, 1.0 * scale, 1.2 * scale]} />;
    case "sky_forge":
      return <boxGeometry args={[1.5 * scale, 1.4 * scale, 1.5 * scale]} />;
    case "sky_dock":
      return <boxGeometry args={[1.8 * scale, 0.7 * scale, 1.2 * scale]} />;
    case "headquarters":
      return <cylinderGeometry args={[1.5 * scale, 2 * scale, 1.5 * scale, 8]} />;
    default:
      return <boxGeometry args={[1.2 * scale, 0.8 * scale, 1.2 * scale]} />;
  }
};

export default BuildingModel;
