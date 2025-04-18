
import { supabase } from "@/integrations/supabase/client";
import { IslandData, Building, Airship, ResourceAmount } from "@/types/game";

export interface PlayerIsland {
  id: string;
  user_id: string;
  name: string;
  level: number;
  grid_width: number;
  grid_height: number;
  steam: number;
  ore: number;
  aether: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBuilding {
  id: string;
  island_id: string;
  type: string;
  level: number;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

// Fetch player's island data or create one if it doesn't exist
export const fetchPlayerIsland = async (): Promise<PlayerIsland> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("No authenticated user found");
  }

  // Using any type to bypass TypeScript errors with Supabase tables
  const { data: islands, error } = await (supabase as any)
    .from('player_islands')
    .select('*')
    .eq('user_id', user.id)
    .limit(1);
    
  if (error) {
    console.error("Error fetching islands:", error);
    throw error;
  }

  // If no island exists, create one
  if (!islands || islands.length === 0) {
    const newIsland = await createPlayerIsland(user.id);
    return newIsland;
  }
  
  return islands[0] as PlayerIsland;
};

// Create a new island for the player
export const createPlayerIsland = async (userId: string): Promise<PlayerIsland> => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data: island, error } = await (supabase as any)
    .from('player_islands')
    .insert({
      user_id: userId,
      name: 'Sky Haven',
      level: 1,
      grid_width: 10,
      grid_height: 10,
      steam: 100,
      ore: 50,
      aether: 25
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error creating island:", error);
    throw error;
  }
  
  return island as PlayerIsland;
};

// Fetch buildings on player's island
export const fetchIslandBuildings = async (islandId: string): Promise<DatabaseBuilding[]> => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data, error } = await (supabase as any)
    .from('buildings')
    .select('*')
    .eq('island_id', islandId);
    
  if (error) {
    console.error("Error fetching buildings:", error);
    throw error;
  }
  
  return (data || []) as DatabaseBuilding[];
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
  position: { x: number; y: number }
): Promise<DatabaseBuilding> => {
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
  
  return data as DatabaseBuilding;
};

// Remove a building
export const removeIslandBuilding = async (buildingId: string): Promise<void> => {
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
export const upgradeIslandBuilding = async (buildingId: string, newLevel: number): Promise<DatabaseBuilding> => {
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
  
  return data as DatabaseBuilding;
};

// Update island resources
export const updateIslandResources = async (
  islandId: string, 
  resources: ResourceAmount
): Promise<PlayerIsland> => {
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
  
  return data as PlayerIsland;
};

// Rename island
export const renameIsland = async (islandId: string, name: string): Promise<PlayerIsland> => {
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
  
  return data as PlayerIsland;
};
