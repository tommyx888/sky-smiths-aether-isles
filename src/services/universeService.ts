
import { supabase } from "@/integrations/supabase/client";
import { MapLocation, UniverseMapData, MapCoordinates, LocationType } from "@/types/universe";
import { v4 as uuidv4 } from "uuid";
import { ResourceAmount } from "@/types/game";

// Fetch the universe map
export const fetchUniverseMap = async (): Promise<UniverseMapData> => {
  // Using any type to bypass TypeScript errors with Supabase tables
  const { data: mapData, error: mapError } = await (supabase as any)
    .from('universe_maps')
    .select('*')
    .single();
    
  if (mapError) {
    console.error("Error fetching universe map:", mapError);
    
    // If no map exists, create one
    if (mapError.code === 'PGRST116') {
      return await createUniverseMap();
    }
    
    throw mapError;
  }
  
  // Fetch locations for this map
  const { data: locations, error: locationsError } = await (supabase as any)
    .from('map_locations')
    .select('*')
    .eq('map_id', mapData.id);
    
  if (locationsError) {
    console.error("Error fetching map locations:", locationsError);
    throw locationsError;
  }
  
  // Convert database model to application model
  return {
    width: mapData.width,
    height: mapData.height,
    locations: locations.map((loc: any) => ({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      coordinates: { x: loc.position_x, y: loc.position_y },
      resources: loc.resources ? {
        steam: loc.resources.steam || 0,
        ore: loc.resources.ore || 0,
        aether: loc.resources.aether || 0
      } : undefined,
      difficulty: loc.difficulty,
      owner: loc.owner,
      discovered: loc.discovered
    })),
    playerPosition: mapData.player_position_x !== null ? {
      x: mapData.player_position_x,
      y: mapData.player_position_y
    } : undefined
  };
};

// Create a new universe map
export const createUniverseMap = async (): Promise<UniverseMapData> => {
  const mapWidth = 20;
  const mapHeight = 20;
  
  // Create the map record
  const { data: map, error: mapError } = await (supabase as any)
    .from('universe_maps')
    .insert({
      width: mapWidth,
      height: mapHeight,
      player_position_x: 10,
      player_position_y: 10
    })
    .select()
    .single();
    
  if (mapError) {
    console.error("Error creating universe map:", mapError);
    throw mapError;
  }
  
  // Generate random locations on the map
  const locations: Omit<MapLocation, 'id'>[] = generateRandomLocations(mapWidth, mapHeight, map.id);
  
  // Add player's starting city
  locations.push({
    name: "Home City",
    type: "player_city",
    coordinates: { x: 10, y: 10 },
    owner: "player",
    discovered: true
  });
  
  // Insert all locations
  const locationsToInsert = locations.map(loc => ({
    map_id: map.id,
    name: loc.name,
    type: loc.type,
    position_x: loc.coordinates.x,
    position_y: loc.coordinates.y,
    resources: loc.resources ? {
      steam: loc.resources.steam,
      ore: loc.resources.ore,
      aether: loc.resources.aether
    } : null,
    difficulty: loc.difficulty || null,
    owner: loc.owner || null,
    discovered: loc.discovered
  }));
  
  const { data: createdLocations, error: locationsError } = await (supabase as any)
    .from('map_locations')
    .insert(locationsToInsert)
    .select();
    
  if (locationsError) {
    console.error("Error creating map locations:", locationsError);
    throw locationsError;
  }
  
  return {
    width: mapWidth,
    height: mapHeight,
    locations: createdLocations.map((loc: any) => ({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      coordinates: { x: loc.position_x, y: loc.position_y },
      resources: loc.resources ? {
        steam: loc.resources.steam || 0,
        ore: loc.resources.ore || 0,
        aether: loc.resources.aether || 0
      } : undefined,
      difficulty: loc.difficulty,
      owner: loc.owner,
      discovered: loc.discovered
    })),
    playerPosition: { x: 10, y: 10 }
  };
};

// Move player on the universe map
export const movePlayerOnMap = async (mapId: string, newPosition: MapCoordinates): Promise<void> => {
  const { error } = await (supabase as any)
    .from('universe_maps')
    .update({
      player_position_x: newPosition.x,
      player_position_y: newPosition.y
    })
    .eq('id', mapId);
    
  if (error) {
    console.error("Error moving player on map:", error);
    throw error;
  }
};

// Discover a location
export const discoverLocation = async (locationId: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('map_locations')
    .update({ discovered: true })
    .eq('id', locationId);
    
  if (error) {
    console.error("Error discovering location:", error);
    throw error;
  }
};

// Battle at a location
export const battleAtLocation = async (locationId: string, result: boolean): Promise<void> => {
  if (result) {
    const { error } = await (supabase as any)
      .from('map_locations')
      .update({ owner: 'player' })
      .eq('id', locationId);
      
    if (error) {
      console.error("Error updating location ownership:", error);
      throw error;
    }
  }
};

// Helper function to generate random locations
const generateRandomLocations = (
  width: number,
  height: number,
  mapId: string
): Omit<MapLocation, 'id'>[] => {
  const locations: Omit<MapLocation, 'id'>[] = [];
  const locationTypes: LocationType[] = [
    "asteroid_field", 
    "nebula", 
    "spaceport", 
    "ai_city", 
    "trading_post", 
    "pirate_hideout"
  ];
  
  // Generate some random locations
  const numLocations = Math.floor(width * height * 0.2); // 20% of grid filled
  
  const occupiedSpots = new Set();
  occupiedSpots.add("10,10"); // Reserve player starting position
  
  for (let i = 0; i < numLocations; i++) {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    let key = `${x},${y}`;
    
    // Ensure no overlap
    while (occupiedSpots.has(key)) {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);
      key = `${x},${y}`;
    }
    
    occupiedSpots.add(key);
    
    const locationType = locationTypes[Math.floor(Math.random() * locationTypes.length)];
    
    // Generate a name based on type
    let name = "";
    switch (locationType) {
      case "asteroid_field":
        name = `${getRandomPrefix()} Asteroid Belt`;
        break;
      case "nebula":
        name = `${getRandomPrefix()} Nebula`;
        break;
      case "spaceport":
        name = `${getRandomPrefix()} Spaceport`;
        break;
      case "ai_city":
        name = `${getRandomPrefix()} Haven`;
        break;
      case "trading_post":
        name = `${getRandomPrefix()} Trading Post`;
        break;
      case "pirate_hideout":
        name = `${getRandomPrefix()} Pirate Hideout`;
        break;
      default:
        name = `Unknown Location ${i}`;
    }
    
    // Generate appropriate resources based on type
    let resources: ResourceAmount | undefined;
    let difficulty: number | undefined;
    
    if (locationType === "asteroid_field") {
      resources = {
        steam: 0,
        ore: 50 + Math.floor(Math.random() * 200),
        aether: Math.floor(Math.random() * 50)
      };
      difficulty = 2 + Math.floor(Math.random() * 4);
    } else if (locationType === "nebula") {
      resources = {
        steam: Math.floor(Math.random() * 50),
        ore: Math.floor(Math.random() * 50),
        aether: 50 + Math.floor(Math.random() * 200)
      };
      difficulty = 3 + Math.floor(Math.random() * 5);
    } else if (locationType === "pirate_hideout") {
      resources = {
        steam: 50 + Math.floor(Math.random() * 100),
        ore: 50 + Math.floor(Math.random() * 100),
        aether: 50 + Math.floor(Math.random() * 100)
      };
      difficulty = 5 + Math.floor(Math.random() * 5);
    } else if (locationType === "ai_city") {
      resources = {
        steam: 100 + Math.floor(Math.random() * 200),
        ore: 100 + Math.floor(Math.random() * 200),
        aether: 100 + Math.floor(Math.random() * 100)
      };
      difficulty = 4 + Math.floor(Math.random() * 6);
    }
    
    locations.push({
      name,
      type: locationType,
      coordinates: { x, y },
      resources,
      difficulty,
      owner: locationType === "ai_city" ? "ai" : null,
      discovered: Math.random() < 0.3 // 30% chance of being discovered initially
    });
  }
  
  return locations;
};

// Helper for random name generation
const getRandomPrefix = (): string => {
  const prefixes = [
    "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", 
    "Nova", "Pulsar", "Quasar", "Stellar", "Cosmic", "Nebular", "Astral",
    "Crimson", "Azure", "Emerald", "Golden", "Silver", "Obsidian", "Crystal",
    "Mystic", "Phantom", "Shadow", "Radiant", "Luminous", "Spectral", "Void"
  ];
  
  return prefixes[Math.floor(Math.random() * prefixes.length)];
};
