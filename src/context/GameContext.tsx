
import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayerData, IslandData, Building, BuildingType, ResourceAmount } from "@/types/game";
import { BUILDINGS_CONFIG } from "@/config/gameConfig";
import * as gameService from "@/services/gameService";

// Initial state
const initialState: { player: PlayerData } = {
  player: {
    id: "",
    name: "",
    island: {
      id: "",
      name: "Island",
      level: 1,
      buildings: [],
      resources: { steam: 200, ore: 150, aether: 100 },
      gridSize: { width: 10, height: 10 }
    },
    airships: [],
    alliance: undefined
  }
};

// Action types
type GameAction =
  | { type: "SET_PLAYER_DATA"; payload: PlayerData }
  | { type: "ADD_BUILDING"; payload: Building }
  | { type: "REMOVE_BUILDING"; payload: string }
  | { type: "UPGRADE_BUILDING"; payload: { id: string; level: number } }
  | { type: "UPDATE_RESOURCES"; payload: ResourceAmount }
  | { type: "RENAME_ISLAND"; payload: string };

// Reducer
const gameReducer = (state: typeof initialState, action: GameAction) => {
  switch (action.type) {
    case "SET_PLAYER_DATA":
      return {
        ...state,
        player: action.payload
      };
    case "ADD_BUILDING":
      return {
        ...state,
        player: {
          ...state.player,
          island: {
            ...state.player.island,
            buildings: [...state.player.island.buildings, action.payload]
          }
        }
      };
    case "REMOVE_BUILDING":
      return {
        ...state,
        player: {
          ...state.player,
          island: {
            ...state.player.island,
            buildings: state.player.island.buildings.filter(
              building => building.id !== action.payload
            )
          }
        }
      };
    case "UPGRADE_BUILDING":
      return {
        ...state,
        player: {
          ...state.player,
          island: {
            ...state.player.island,
            buildings: state.player.island.buildings.map(building =>
              building.id === action.payload.id
                ? { ...building, level: action.payload.level }
                : building
            )
          }
        }
      };
    case "UPDATE_RESOURCES":
      return {
        ...state,
        player: {
          ...state.player,
          island: {
            ...state.player.island,
            resources: action.payload
          }
        }
      };
    case "RENAME_ISLAND":
      return {
        ...state,
        player: {
          ...state.player,
          island: {
            ...state.player.island,
            name: action.payload
          }
        }
      };
    default:
      return state;
  }
};

// Context
type GameContextType = {
  state: typeof initialState;
  addBuilding: (building: Building) => void;
  removeBuilding: (id: string) => void;
  upgradeBuilding: (id: string) => void;
  renameIsland: (name: string) => void;
  canAfford: (cost: ResourceAmount) => boolean;
  isLoading: boolean;
};

const GameContext = createContext<GameContextType>({
  state: initialState,
  addBuilding: () => {},
  removeBuilding: () => {},
  upgradeBuilding: () => {},
  renameIsland: () => {},
  canAfford: () => false,
  isLoading: true,
});

export const useGame = () => useContext(GameContext);

// Provider
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch initial game data
  const { isLoading, refetch } = useQuery({
    queryKey: ["gameData", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        // Fetch island data
        const islandData = await gameService.fetchPlayerIsland();
        
        if (!islandData) {
          throw new Error("No island found for player");
        }
        
        // Fetch buildings
        const buildings = await gameService.fetchIslandBuildings(islandData.id);
        
        // Map to game models
        const gameData = gameService.mapToGameModels(islandData, buildings);
        
        // Create player data
        const playerData: PlayerData = {
          id: user.id,
          name: user.user_metadata?.username || "Captain",
          island: gameData,
          airships: [],
          alliance: undefined
        };
        
        // Update state
        dispatch({ type: "SET_PLAYER_DATA", payload: playerData });
        
        return playerData;
      } catch (error) {
        console.error("Error fetching game data:", error);
        toast.error("Failed to load game data");
        return null;
      }
    },
    enabled: !!user,
  });
  
  // Resource production timer
  useEffect(() => {
    if (!state.player.island.id || isLoading) return;
    
    const productionInterval = setInterval(() => {
      const newResources = { ...state.player.island.resources };
      
      state.player.island.buildings.forEach(building => {
        const buildingInfo = BUILDINGS_CONFIG[building.type];
        if (!buildingInfo.production) return;
        
        if (buildingInfo.production.steam) {
          newResources.steam += buildingInfo.production.steam * building.level;
        }
        if (buildingInfo.production.ore) {
          newResources.ore += buildingInfo.production.ore * building.level;
        }
        if (buildingInfo.production.aether) {
          newResources.aether += buildingInfo.production.aether * building.level;
        }
      });
      
      dispatch({ type: "UPDATE_RESOURCES", payload: newResources });
      
      // Save resources to database every minute
      gameService.updateIslandResources(state.player.island.id, newResources)
        .catch(error => {
          console.error("Error saving resources:", error);
        });
    }, 10000); // Production tick every 10 seconds
    
    return () => clearInterval(productionInterval);
  }, [state.player.island.id, state.player.island.buildings, isLoading]);
  
  // Add building mutation
  const addBuildingMutation = useMutation({
    mutationFn: async (building: Building) => {
      if (!state.player.island.id) throw new Error("No island found");
      
      // Subtract resources
      const buildingInfo = BUILDINGS_CONFIG[building.type];
      const newResources = { ...state.player.island.resources };
      newResources.steam -= buildingInfo.cost.steam;
      newResources.ore -= buildingInfo.cost.ore;
      newResources.aether -= buildingInfo.cost.aether;
      
      // Update resources in state
      dispatch({ type: "UPDATE_RESOURCES", payload: newResources });
      
      // Save building to database
      const savedBuilding = await gameService.addBuildingToIsland(
        state.player.island.id,
        building.type,
        { x: building.position.x, y: building.position.y }
      );
      
      // Update resources in database
      await gameService.updateIslandResources(
        state.player.island.id,
        newResources
      );
      
      return savedBuilding;
    },
    onSuccess: (_, variables) => {
      // Add building to state
      dispatch({ type: "ADD_BUILDING", payload: variables });
    },
    onError: (error) => {
      console.error("Error adding building:", error);
      toast.error("Failed to add building");
      
      // Refetch data to ensure consistency
      refetch();
    }
  });
  
  // Remove building mutation
  const removeBuildingMutation = useMutation({
    mutationFn: async (buildingId: string) => {
      await gameService.removeIslandBuilding(buildingId);
      return buildingId;
    },
    onSuccess: (buildingId) => {
      dispatch({ type: "REMOVE_BUILDING", payload: buildingId });
    },
    onError: (error) => {
      console.error("Error removing building:", error);
      toast.error("Failed to remove building");
      refetch();
    }
  });
  
  // Upgrade building mutation
  const upgradeBuildingMutation = useMutation({
    mutationFn: async (buildingId: string) => {
      // Find the building
      const building = state.player.island.buildings.find(b => b.id === buildingId);
      if (!building) throw new Error("Building not found");
      
      // Get upgrade cost
      const buildingInfo = BUILDINGS_CONFIG[building.type];
      const upgradeCost = {
        steam: buildingInfo.cost.steam * (building.level + 1),
        ore: buildingInfo.cost.ore * (building.level + 1),
        aether: buildingInfo.cost.aether * (building.level + 1)
      };
      
      // Check if player can afford the upgrade
      const resources = state.player.island.resources;
      if (
        resources.steam < upgradeCost.steam ||
        resources.ore < upgradeCost.ore ||
        resources.aether < upgradeCost.aether
      ) {
        throw new Error("Not enough resources");
      }
      
      // Update resources
      const newResources = { ...resources };
      newResources.steam -= upgradeCost.steam;
      newResources.ore -= upgradeCost.ore;
      newResources.aether -= upgradeCost.aether;
      
      // Update resources in state
      dispatch({ type: "UPDATE_RESOURCES", payload: newResources });
      
      // Update building in database
      await gameService.upgradeIslandBuilding(buildingId, building.level + 1);
      
      // Update resources in database
      if (state.player.island.id) {
        await gameService.updateIslandResources(
          state.player.island.id,
          newResources
        );
      }
      
      return { id: buildingId, level: building.level + 1 };
    },
    onSuccess: (data) => {
      dispatch({ 
        type: "UPGRADE_BUILDING", 
        payload: { id: data.id, level: data.level } 
      });
    },
    onError: (error, buildingId) => {
      console.error("Error upgrading building:", error);
      
      if (error instanceof Error && error.message === "Not enough resources") {
        toast.error("Not enough resources for upgrade!");
      } else {
        toast.error("Failed to upgrade building");
      }
      
      refetch();
    }
  });
  
  // Rename island mutation
  const renameIslandMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!state.player.island.id) throw new Error("No island found");
      
      await gameService.renameIsland(state.player.island.id, name);
      return name;
    },
    onSuccess: (name) => {
      dispatch({ type: "RENAME_ISLAND", payload: name });
    },
    onError: (error) => {
      console.error("Error renaming island:", error);
      toast.error("Failed to rename island");
    }
  });
  
  // Check if player can afford a cost
  const canAfford = (cost: ResourceAmount) => {
    const { resources } = state.player.island;
    return (
      resources.steam >= cost.steam &&
      resources.ore >= cost.ore &&
      resources.aether >= cost.aether
    );
  };
  
  // Action handlers
  const addBuilding = (building: Building) => {
    addBuildingMutation.mutate(building);
  };
  
  const removeBuilding = (id: string) => {
    removeBuildingMutation.mutate(id);
  };
  
  const upgradeBuilding = (id: string) => {
    upgradeBuildingMutation.mutate(id);
  };
  
  const renameIsland = (name: string) => {
    renameIslandMutation.mutate(name);
  };
  
  return (
    <GameContext.Provider
      value={{
        state,
        addBuilding,
        removeBuilding,
        upgradeBuilding,
        renameIsland,
        canAfford,
        isLoading
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
