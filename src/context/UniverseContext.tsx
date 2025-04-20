
import { createContext, useContext, useReducer, ReactNode } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { UniverseMapData, MapLocation, MapCoordinates, CombatResult } from "@/types/universe";
import * as universeService from "@/services/universeService";

// Initial state
const initialState: {
  map: UniverseMapData;
  selectedLocation: MapLocation | null;
  inCombat: boolean;
  combatLog: string[];
} = {
  map: {
    width: 0,
    height: 0,
    locations: [],
  },
  selectedLocation: null,
  inCombat: false,
  combatLog: []
};

// Action types
type UniverseAction =
  | { type: "SET_MAP_DATA"; payload: UniverseMapData }
  | { type: "SELECT_LOCATION"; payload: MapLocation | null }
  | { type: "MOVE_PLAYER"; payload: MapCoordinates }
  | { type: "DISCOVER_LOCATION"; payload: string }
  | { type: "START_COMBAT" }
  | { type: "END_COMBAT"; payload: { victory: boolean; locationId: string } }
  | { type: "ADD_COMBAT_LOG"; payload: string }
  | { type: "CLEAR_COMBAT_LOG" };

// Reducer
const universeReducer = (state: typeof initialState, action: UniverseAction) => {
  switch (action.type) {
    case "SET_MAP_DATA":
      return {
        ...state,
        map: action.payload
      };
      
    case "SELECT_LOCATION":
      return {
        ...state,
        selectedLocation: action.payload
      };
      
    case "MOVE_PLAYER":
      return {
        ...state,
        map: {
          ...state.map,
          playerPosition: action.payload
        }
      };
      
    case "DISCOVER_LOCATION":
      return {
        ...state,
        map: {
          ...state.map,
          locations: state.map.locations.map(loc => 
            loc.id === action.payload ? { ...loc, discovered: true } : loc
          )
        }
      };
      
    case "START_COMBAT":
      return {
        ...state,
        inCombat: true,
        combatLog: ["Combat initiated..."]
      };
      
    case "END_COMBAT":
      return {
        ...state,
        inCombat: false,
        map: {
          ...state.map,
          locations: state.map.locations.map(loc => 
            loc.id === action.payload.locationId && action.payload.victory 
              ? { ...loc, owner: "player" as "player" | "ai" | null } 
              : loc
          )
        },
        combatLog: [
          ...state.combatLog,
          action.payload.victory ? "Victory!" : "Defeat..."
        ]
      };
      
    case "ADD_COMBAT_LOG":
      return {
        ...state,
        combatLog: [...state.combatLog, action.payload]
      };
      
    case "CLEAR_COMBAT_LOG":
      return {
        ...state,
        combatLog: []
      };
      
    default:
      return state;
  }
};

// Context type
type UniverseContextType = {
  state: typeof initialState;
  selectLocation: (location: MapLocation | null) => void;
  moveToLocation: (locationId: string) => void;
  startBattle: (locationId: string) => void;
  isLoading: boolean;
};

// Create context
const UniverseContext = createContext<UniverseContextType>({
  state: initialState,
  selectLocation: () => {},
  moveToLocation: () => {},
  startBattle: () => {},
  isLoading: true
});

// Hook to use the universe context
export const useUniverse = () => useContext(UniverseContext);

// Provider component
export const UniverseProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(universeReducer, initialState);
  const { state: gameState } = useGame();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch universe map data
  const { isLoading } = useQuery({
    queryKey: ["universeMap"],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        const mapData = await universeService.fetchUniverseMap();
        
        if (mapData) {
          dispatch({ type: "SET_MAP_DATA", payload: mapData });
        }
        
        return mapData;
      } catch (error) {
        console.error("Error fetching universe map:", error);
        toast.error("Failed to load universe map");
        return null;
      }
    },
    enabled: !!user,
  });
  
  // Move player mutation
  const movePlayerMutation = useMutation({
    mutationFn: async (locationId: string) => {
      // Find the location in our map data
      const location = state.map.locations.find(loc => loc.id === locationId);
      if (!location) {
        throw new Error("Location not found");
      }
      
      // Move player to this location
      if (state.map.id) {
        await universeService.movePlayerOnMap(state.map.id, location.coordinates);
      } else {
        throw new Error("Map ID is missing");
      }
      
      // If location not discovered, discover it
      if (!location.discovered) {
        await universeService.discoverLocation(locationId);
      }
      
      return location.coordinates;
    },
    onSuccess: (coordinates) => {
      dispatch({ type: "MOVE_PLAYER", payload: coordinates });
      toast.success("Moved to new location");
    },
    onError: (error) => {
      console.error("Error moving to location:", error);
      toast.error("Failed to move to location");
    }
  });
  
  // Battle mutation
  const battleMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const location = state.map.locations.find(loc => loc.id === locationId);
      if (!location) {
        throw new Error("Location not found");
      }
      
      // Start combat
      dispatch({ type: "START_COMBAT" });
      
      // Simulate combat
      dispatch({ type: "ADD_COMBAT_LOG", payload: `Engaging combat at ${location.name}...` });
      
      // Short delay for immersion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simplified combat resolution - todo: implement real combat system
      const victory = Math.random() > 0.4; // 60% chance of victory for now
      
      if (victory) {
        dispatch({ type: "ADD_COMBAT_LOG", payload: "Your forces have prevailed!" });
        
        // If it's an AI city, conquer it
        if (location.type === "ai_city" && location.owner === "ai") {
          dispatch({ type: "ADD_COMBAT_LOG", payload: "You have conquered the city!" });
        }
        
        // Update ownership in the database
        await universeService.battleAtLocation(locationId, true);
      } else {
        dispatch({ type: "ADD_COMBAT_LOG", payload: "Your forces were defeated!" });
      }
      
      return { victory, locationId };
    },
    onSuccess: (result) => {
      dispatch({ 
        type: "END_COMBAT", 
        payload: { victory: result.victory, locationId: result.locationId } 
      });
      
      toast[result.victory ? "success" : "error"](
        result.victory ? "Battle won!" : "Battle lost!"
      );
    },
    onError: (error) => {
      console.error("Error during battle:", error);
      toast.error("Combat system malfunction");
      dispatch({ type: "END_COMBAT", payload: { victory: false, locationId: "" } });
    }
  });
  
  // Actions
  const selectLocation = (location: MapLocation | null) => {
    dispatch({ type: "SELECT_LOCATION", payload: location });
  };
  
  const moveToLocation = (locationId: string) => {
    movePlayerMutation.mutate(locationId);
  };
  
  const startBattle = (locationId: string) => {
    battleMutation.mutate(locationId);
  };
  
  return (
    <UniverseContext.Provider
      value={{
        state,
        selectLocation,
        moveToLocation,
        startBattle,
        isLoading
      }}
    >
      {children}
    </UniverseContext.Provider>
  );
};
