
import { ResourceAmount } from "./game";

export interface MapCoordinates {
  x: number;
  y: number;
}

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  coordinates: MapCoordinates;
  resources?: ResourceAmount;
  difficulty?: number; // 1-10 scale for combat difficulty
  owner?: "player" | "ai" | null;
  discovered: boolean;
}

export type LocationType = 
  | "empty" 
  | "asteroid_field" 
  | "nebula" 
  | "spaceport" 
  | "ai_city" 
  | "player_city" 
  | "trading_post" 
  | "pirate_hideout";

export interface UniverseMapData {
  id?: string; // Adding optional id property
  width: number;
  height: number;
  locations: MapLocation[];
  playerPosition?: MapCoordinates;
}

export interface CombatResult {
  victory: boolean;
  rewards?: ResourceAmount;
  damageTaken?: number;
  log: string[];
}
