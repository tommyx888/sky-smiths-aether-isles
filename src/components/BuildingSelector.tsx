
import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { BuildingType, Building } from "@/types/game";
import { BUILDINGS_CONFIG } from "@/config/gameConfig";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Hammer,
  Droplets,
  Pickaxe,
  FlaskConical,
  Wrench,
  Users,
  Shield,
  Anchor
} from "lucide-react";

const BuildingSelector = () => {
  const { state, addBuilding, canAfford } = useGame();
  const [selectedType, setSelectedType] = useState<BuildingType | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const getBuildingIcon = (type: BuildingType) => {
    switch (type) {
      case "steam_generator":
        return <Droplets className="h-4 w-4" />;
      case "ore_mine":
        return <Pickaxe className="h-4 w-4" />;
      case "aether_collector":
        return <FlaskConical className="h-4 w-4" />;
      case "workshop":
        return <Wrench className="h-4 w-4" />;
      case "barracks":
        return <Users className="h-4 w-4" />;
      case "sky_forge":
        return <Shield className="h-4 w-4" />;
      case "sky_dock":
        return <Anchor className="h-4 w-4" />;
      default:
        return <Hammer className="h-4 w-4" />;
    }
  };
  
  const handlePositionChange = (x: number, y: number) => {
    setPosition({ x, y });
  };
  
  // Check if a cell is adjacent to any existing building
  const isAdjacentToExistingBuilding = (x: number, y: number): boolean => {
    // If this is the first building, allow placement at the center
    if (state.player.island.buildings.length === 0) {
      return x === 5 && y === 5;
    }
    
    // Find one adjacent existing building
    return state.player.island.buildings.some(building => {
      const dx = Math.abs(building.position.x - x);
      const dy = Math.abs(building.position.y - y);
      
      // Adjacent means sharing an edge, not diagonally
      return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    });
  };
  
  // Determine if a cell can be built on (is adjacent to existing building and not occupied)
  const canBuildOnCell = (x: number, y: number): boolean => {
    // Check if cell is occupied
    const isOccupied = state.player.island.buildings.some(
      building => building.position.x === x && building.position.y === y
    );
    
    if (isOccupied) return false;
    
    // Check if adjacent to existing building
    return isAdjacentToExistingBuilding(x, y);
  };
  
  const handleBuild = () => {
    if (!selectedType) return;
    
    const buildingConfig = BUILDINGS_CONFIG[selectedType];
    if (!buildingConfig) return;
    
    if (!canAfford(buildingConfig.cost)) {
      toast.error("Not enough resources!");
      return;
    }
    
    const { gridSize } = state.player.island;
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x + buildingConfig.size.width > gridSize.width ||
      position.y + buildingConfig.size.height > gridSize.height
    ) {
      toast.error("Building is outside the island!");
      return;
    }
    
    if (!isAdjacentToExistingBuilding(position.x, position.y)) {
      toast.error("New buildings must be placed adjacent to existing buildings!");
      return;
    }
    
    const isColliding = state.player.island.buildings.some((building) => {
      return (
        position.x < building.position.x + building.size.width &&
        position.x + buildingConfig.size.width > building.position.x &&
        position.y < building.position.y + building.size.height &&
        position.y + buildingConfig.size.height > building.position.y
      );
    });
    
    if (isColliding) {
      toast.error("Building collides with another structure!");
      return;
    }
    
    const newBuilding: Building = {
      id: uuidv4(),
      type: selectedType,
      level: 1,
      position: { ...position },
      size: { ...buildingConfig.size }
    };
    
    addBuilding(newBuilding);
    toast.success(`${buildingConfig.name} constructed!`);
    setSelectedType(null);
  };
  
  return (
    <div className="steampunk-panel">
      <h2 className="text-xl font-bold mb-4 text-brass-dark flex items-center">
        <Hammer className="mr-2 h-6 w-6 gear-icon" />
        Building Construction
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {Object.entries(BUILDINGS_CONFIG).map(([key, building]) => (
          <Button
            key={key}
            className={`p-2 h-auto flex flex-col items-center justify-center ${
              selectedType === key ? "bg-brass border-2 border-brass-dark" : ""
            }`}
            variant="outline"
            onClick={() => setSelectedType(key as BuildingType)}
          >
            <div className="flex items-center justify-center mb-1">
              {getBuildingIcon(key as BuildingType)}
            </div>
            <span className="text-xs">{building.name}</span>
            <div className="flex gap-1 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Droplets className="h-3 w-3 mr-1 text-sky" /> 
                {building.cost.steam}
              </span>
              <span className="flex items-center">
                <Pickaxe className="h-3 w-3 mr-1 text-copper" />
                {building.cost.ore}
              </span>
              <span className="flex items-center">
                <FlaskConical className="h-3 w-3 mr-1 text-aether" />
                {building.cost.aether}
              </span>
            </div>
          </Button>
        ))}
      </div>
      
      {selectedType && (
        <div className="mt-4">
          <div className="grid grid-cols-10 gap-1 mb-4">
            {Array.from({ length: 100 }).map((_, index) => {
              const x = index % 10;
              const y = Math.floor(index / 10);
              
              const isSelected =
                x >= position.x &&
                x < position.x + (BUILDINGS_CONFIG[selectedType]?.size.width || 1) &&
                y >= position.y &&
                y < position.y + (BUILDINGS_CONFIG[selectedType]?.size.height || 1);
              
              const canBuild = canBuildOnCell(x, y);
              
              return (
                <div
                  key={index}
                  className={`building-grid-cell cursor-pointer ${
                    isSelected ? "bg-brass/40 border-brass" : ""
                  } ${
                    canBuild ? "bg-green-100/20" : "bg-red-300/10 opacity-50"
                  }`}
                  onClick={() => canBuild && handlePositionChange(x, y)}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedType(null)}>
              Cancel
            </Button>
            <Button className="steampunk-button" onClick={handleBuild}>
              Build {BUILDINGS_CONFIG[selectedType].name}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingSelector;
