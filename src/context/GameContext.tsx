
import { createContext, useContext, useEffect, useReducer } from "react";
import { IslandData, Building, ResourceAmount, PlayerData } from "@/types/game";
import { BUILDINGS_CONFIG, INITIAL_RESOURCES, GRID_SIZE, RESOURCE_PRODUCTION_INTERVAL } from "@/config/gameConfig";
import { v4 as uuidv4 } from "uuid";

// Action types
type GameAction =
  | { type: "ADD_BUILDING"; building: Building }
  | { type: "UPGRADE_BUILDING"; buildingId: string }
  | { type: "REMOVE_BUILDING"; buildingId: string }
  | { type: "UPDATE_RESOURCES"; resources: Partial<ResourceAmount> }
  | { type: "RENAME_ISLAND"; name: string };

// Game state
interface GameState {
  player: PlayerData;
  selectedBuilding: Building | null;
  buildMode: boolean;
}

// Initial state
const createInitialState = (): GameState => ({
  player: {
    id: uuidv4(),
    name: "SkySmith",
    island: {
      id: uuidv4(),
      name: "Novice Isle",
      level: 1,
      buildings: [],
      resources: INITIAL_RESOURCES,
      gridSize: GRID_SIZE
    },
    airships: []
  },
  selectedBuilding: null,
  buildMode: false
});

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "ADD_BUILDING":
      return {
        ...state,
        player: {
          ...state.player,
          island: {
            ...state.player.island,
            buildings: [...state.player.island.buildings, action.building]
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
            buildings: state.player.island.buildings.map((building) =>
              building.id === action.buildingId
                ? { ...building, level: building.level + 1 }
                : building
            )
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
              (building) => building.id !== action.buildingId
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
            resources: {
              steam: state.player.island.resources.steam + (action.resources.steam || 0),
              ore: state.player.island.resources.ore + (action.resources.ore || 0),
              aether: state.player.island.resources.aether + (action.resources.aether || 0)
            }
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
            name: action.name
          }
        }
      };

    default:
      return state;
  }
};

// Context
interface GameContextType {
  state: GameState;
  addBuilding: (building: Building) => void;
  upgradeBuilding: (buildingId: string) => void;
  removeBuilding: (buildingId: string) => void;
  updateResources: (resources: Partial<ResourceAmount>) => void;
  renameIsland: (name: string) => void;
  startBuildMode: (buildingType: string) => void;
  cancelBuildMode: () => void;
  canAfford: (cost: ResourceAmount) => boolean;
  isBuildingPositionValid: (position: { x: number; y: number }, size: { width: number; height: number }) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  const addBuilding = (building: Building) => {
    const buildingInfo = BUILDINGS_CONFIG[building.type];
    const { cost } = buildingInfo;
    
    if (canAfford(cost)) {
      // Deduct resources
      dispatch({
        type: "UPDATE_RESOURCES",
        resources: {
          steam: -cost.steam,
          ore: -cost.ore,
          aether: -cost.aether
        }
      });
      
      // Add building
      dispatch({ type: "ADD_BUILDING", building });
    }
  };

  const upgradeBuilding = (buildingId: string) => {
    const building = state.player.island.buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    const buildingInfo = BUILDINGS_CONFIG[building.type];
    const upgradeCost = {
      steam: buildingInfo.cost.steam * (building.level + 1),
      ore: buildingInfo.cost.ore * (building.level + 1),
      aether: buildingInfo.cost.aether * (building.level + 1)
    };
    
    if (canAfford(upgradeCost)) {
      // Deduct resources
      dispatch({
        type: "UPDATE_RESOURCES",
        resources: {
          steam: -upgradeCost.steam,
          ore: -upgradeCost.ore,
          aether: -upgradeCost.aether
        }
      });
      
      // Upgrade building
      dispatch({ type: "UPGRADE_BUILDING", buildingId });
    }
  };

  const removeBuilding = (buildingId: string) => {
    dispatch({ type: "REMOVE_BUILDING", buildingId });
  };

  const updateResources = (resources: Partial<ResourceAmount>) => {
    dispatch({ type: "UPDATE_RESOURCES", resources });
  };

  const renameIsland = (name: string) => {
    dispatch({ type: "RENAME_ISLAND", name });
  };

  const startBuildMode = (buildingType: string) => {
    const buildingInfo = BUILDINGS_CONFIG[buildingType];
    if (!buildingInfo) return;
    
    // Create a temporary building for placement preview
    const newBuilding: Building = {
      id: "temp-" + uuidv4(),
      type: buildingInfo.type,
      level: 1,
      position: { x: 0, y: 0 },
      size: buildingInfo.size
    };
    
    // Update state
    dispatch({ type: "UPDATE_RESOURCES", resources: {} }); // This is a hack to update state
  };

  const cancelBuildMode = () => {
    // Reset build mode
    dispatch({ type: "UPDATE_RESOURCES", resources: {} }); // This is a hack to update state
  };

  const canAfford = (cost: ResourceAmount) => {
    const { resources } = state.player.island;
    return (
      resources.steam >= cost.steam &&
      resources.ore >= cost.ore &&
      resources.aether >= cost.aether
    );
  };

  const isBuildingPositionValid = (position: { x: number; y: number }, size: { width: number; height: number }) => {
    // Check grid bounds
    const { width, height } = state.player.island.gridSize;
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x + size.width > width ||
      position.y + size.height > height
    ) {
      return false;
    }
    
    // Check for collision with other buildings
    for (const building of state.player.island.buildings) {
      if (
        position.x < building.position.x + building.size.width &&
        position.x + size.width > building.position.x &&
        position.y < building.position.y + building.size.height &&
        position.y + size.height > building.position.y
      ) {
        return false;
      }
    }
    
    return true;
  };

  // Resource production loop
  useEffect(() => {
    const produceResources = () => {
      const production: ResourceAmount = {
        steam: 0,
        ore: 0,
        aether: 0
      };
      
      // Calculate production from buildings
      state.player.island.buildings.forEach((building) => {
        const buildingInfo = BUILDINGS_CONFIG[building.type];
        if (buildingInfo.production) {
          if (buildingInfo.production.steam) {
            production.steam += buildingInfo.production.steam * building.level;
          }
          if (buildingInfo.production.ore) {
            production.ore += buildingInfo.production.ore * building.level;
          }
          if (buildingInfo.production.aether) {
            production.aether += buildingInfo.production.aether * building.level;
          }
        }
      });
      
      // Update resources
      if (production.steam > 0 || production.ore > 0 || production.aether > 0) {
        updateResources(production);
      }
    };
    
    const interval = setInterval(produceResources, RESOURCE_PRODUCTION_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [state.player.island.buildings]);

  return (
    <GameContext.Provider
      value={{
        state,
        addBuilding,
        upgradeBuilding,
        removeBuilding,
        updateResources,
        renameIsland,
        startBuildMode,
        cancelBuildMode,
        canAfford,
        isBuildingPositionValid
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
