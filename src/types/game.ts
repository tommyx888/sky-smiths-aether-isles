
export type ResourceType = "steam" | "ore" | "aether";

export interface ResourceAmount {
  steam: number;
  ore: number;
  aether: number;
}

export type BuildingType = 
  | "steam_generator" 
  | "ore_mine" 
  | "aether_collector" 
  | "workshop" 
  | "barracks" 
  | "sky_forge" 
  | "sky_dock";

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface IslandData {
  id: string;
  name: string;
  level: number;
  buildings: Building[];
  resources: ResourceAmount;
  gridSize: { width: number; height: number };
}

export type AirshipType = "scout" | "fighter" | "bomber" | "tanker";

export interface Airship {
  id: string;
  type: AirshipType;
  name: string;
  level: number;
  health: number;
  damage: number;
  speed: number;
}

export interface PlayerData {
  id: string;
  name: string;
  island: IslandData;
  airships: Airship[];
  alliance?: string;
}

export interface BuildingInfo {
  type: BuildingType;
  name: string;
  description: string;
  cost: ResourceAmount;
  production?: Partial<ResourceAmount>;
  size: { width: number; height: number };
  buildTime: number; // in seconds
  icon: string;
  model: string; // path to 3D model
}
