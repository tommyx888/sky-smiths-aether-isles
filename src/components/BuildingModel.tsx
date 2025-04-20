
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BuildingType } from '@/types/game';

interface BuildingModelProps {
  type: BuildingType;
  position: { x: number; y: number; z: number };
  scale?: number;
  isMainHq?: boolean;
}

const BuildingModel = ({ type, position, scale = 1, isMainHq = false }: BuildingModelProps) => {
  // Load headquarters model if it's the main HQ
  if (isMainHq) {
    const gltf = useLoader(GLTFLoader, '/models/headquarters.glb');
    return (
      <primitive 
        object={gltf.scene} 
        position={[position.x, position.y, position.z]}
        scale={[scale, scale, scale]}
      />
    );
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
    default:
      return <boxGeometry args={[1.2 * scale, 0.8 * scale, 1.2 * scale]} />;
  }
};

export default BuildingModel;
