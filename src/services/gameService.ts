
import { supabase } from "@/integrations/supabase/client";
import { IslandData, Building, Airship, ResourceAmount } from "@/types/game";

export interface PlayerIsland {
  id: string;
  name: string;
  level: number;
  grid_width: number;
  grid_height: number;
  steam: number;
  ore: number;
  aether: number;
}

export interface DatabaseBuilding {
  id: string;
  island_id: string;
  type: string;
  level: number;
  position_x: number;
  position_y: number;
}

// Fetch player's island data
export const fetchPlayerIsland = async () => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data: islands, error } = await (supabase as any)
    .from('player_islands')
    .select('*')
    .limit(1)
    .single();
    
  if (error) {
    console.error("Error fetching island:", error);
    throw error;
  }
  
  return islands as PlayerIsland;
};

// Fetch buildings on player's island
export const fetchIslandBuildings = async (islandId: string) => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data, error } = await (supabase as any)
    .from('buildings')
    .select('*')
    .eq('island_id', islandId);
    
  if (error) {
    console.error("Error fetching buildings:", error);
    throw error;
  }
  
  return data as DatabaseBuilding[];
};

// Convert database models to game models
export const mapToGameModels = (
  islandData: PlayerIsland, 
  buildingsData: DatabaseBuilding[]
): IslandData => {
  const buildings: Building[] = buildingsData.map(building => ({
    id: building.id,
    type: building.type as any,
    level: building.level,
    position: { x: building.position_x, y: building.position_y },
    size: { width: 1, height: 1 }, // We'll get this from the config
  }));
  
  const resources: ResourceAmount = {
    steam: islandData.steam,
    ore: islandData.ore,
    aether: islandData.aether
  };
  
  return {
    id: islandData.id,
    name: islandData.name,
    level: islandData.level,
    buildings: buildings,
    resources: resources,
    gridSize: { width: islandData.grid_width, height: islandData.grid_height }
  };
};

// Add a new building
export const addBuildingToIsland = async (
  islandId: string,
  buildingType: string,
  position: { x: number, y: number }
) => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data, error } = await (supabase as any)
    .from('buildings')
    .insert({
      island_id: islandId,
      type: buildingType,
      level: 1,
      position_x: position.x,
      position_y: position.y
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error adding building:", error);
    throw error;
  }
  
  return data;
};

// Remove a building
export const removeIslandBuilding = async (buildingId: string) => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { error } = await (supabase as any)
    .from('buildings')
    .delete()
    .eq('id', buildingId);
    
  if (error) {
    console.error("Error removing building:", error);
    throw error;
  }
};

// Upgrade a building
export const upgradeIslandBuilding = async (buildingId: string, newLevel: number) => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data, error } = await (supabase as any)
    .from('buildings')
    .update({ level: newLevel })
    .eq('id', buildingId)
    .select()
    .single();
    
  if (error) {
    console.error("Error upgrading building:", error);
    throw error;
  }
  
  return data;
};

// Update island resources
export const updateIslandResources = async (
  islandId: string, 
  resources: ResourceAmount
) => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data, error } = await (supabase as any)
    .from('player_islands')
    .update({
      steam: resources.steam,
      ore: resources.ore,
      aether: resources.aether
    })
    .eq('id', islandId)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating resources:", error);
    throw error;
  }
  
  return data;
};

// Rename island
export const renameIsland = async (islandId: string, name: string) => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data, error } = await (supabase as any)
    .from('player_islands')
    .update({ name })
    .eq('id', islandId)
    .select()
    .single();
    
  if (error) {
    console.error("Error renaming island:", error);
    throw error;
  }
  
  return data;
};
