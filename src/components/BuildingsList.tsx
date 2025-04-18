
import { useGame } from "@/context/GameContext";
import { Building } from "@/types/game";
import { BUILDINGS_CONFIG } from "@/config/gameConfig";
import { Button } from "@/components/ui/button";
import {
  Droplets,
  Pickaxe,
  Flask,
  Wrench,
  Users,
  Shield,
  Anchor,
  ArrowUpCircle,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

const BuildingsList = () => {
  const { state, removeBuilding, upgradeBuilding } = useGame();
  const { buildings } = state.player.island;
  
  const getBuildingIcon = (type: string) => {
    switch (type) {
      case "steam_generator":
        return <Droplets className="h-4 w-4" />;
      case "ore_mine":
        return <Pickaxe className="h-4 w-4" />;
      case "aether_collector":
        return <Flask className="h-4 w-4" />;
      case "workshop":
        return <Wrench className="h-4 w-4" />;
      case "barracks":
        return <Users className="h-4 w-4" />;
      case "sky_forge":
        return <Shield className="h-4 w-4" />;
      case "sky_dock":
        return <Anchor className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const handleUpgrade = (building: Building) => {
    const buildingInfo = BUILDINGS_CONFIG[building.type];
    const upgradeCost = {
      steam: buildingInfo.cost.steam * (building.level + 1),
      ore: buildingInfo.cost.ore * (building.level + 1),
      aether: buildingInfo.cost.aether * (building.level + 1)
    };
    
    if (
      state.player.island.resources.steam >= upgradeCost.steam &&
      state.player.island.resources.ore >= upgradeCost.ore &&
      state.player.island.resources.aether >= upgradeCost.aether
    ) {
      upgradeBuilding(building.id);
      toast.success(`${buildingInfo.name} upgraded to level ${building.level + 1}!`);
    } else {
      toast.error("Not enough resources for upgrade!");
    }
  };
  
  const handleRemove = (building: Building) => {
    const buildingInfo = BUILDINGS_CONFIG[building.type];
    removeBuilding(building.id);
    toast.success(`${buildingInfo.name} demolished!`);
  };
  
  const getProductionInfo = (building: Building) => {
    const buildingInfo = BUILDINGS_CONFIG[building.type];
    if (!buildingInfo.production) return null;
    
    const elements = [];
    
    if (buildingInfo.production.steam) {
      elements.push(
        <div key="steam" className="flex items-center text-xs">
          <Droplets className="h-3 w-3 mr-1 text-sky" />
          +{buildingInfo.production.steam * building.level}/tick
        </div>
      );
    }
    
    if (buildingInfo.production.ore) {
      elements.push(
        <div key="ore" className="flex items-center text-xs">
          <Pickaxe className="h-3 w-3 mr-1 text-copper" />
          +{buildingInfo.production.ore * building.level}/tick
        </div>
      );
    }
    
    if (buildingInfo.production.aether) {
      elements.push(
        <div key="aether" className="flex items-center text-xs">
          <Flask className="h-3 w-3 mr-1 text-aether" />
          +{buildingInfo.production.aether * building.level}/tick
        </div>
      );
    }
    
    return <div className="flex flex-col gap-1">{elements}</div>;
  };
  
  return (
    <div className="steampunk-panel">
      <h2 className="text-xl font-bold mb-4 text-brass-dark">Buildings</h2>
      
      {buildings.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No buildings constructed yet
        </div>
      ) : (
        <div className="space-y-3">
          {buildings.map((building) => {
            const buildingInfo = BUILDINGS_CONFIG[building.type];
            return (
              <div
                key={building.id}
                className="border border-brass/40 rounded-md p-3 bg-card/70"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brass/20 flex items-center justify-center mr-3">
                      {getBuildingIcon(building.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{buildingInfo.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Level {building.level}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => handleUpgrade(building)}
                    >
                      <ArrowUpCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleRemove(building)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  {getProductionInfo(building)}
                  <div className="text-xs text-muted-foreground mt-1">
                    Position: ({building.position.x}, {building.position.y})
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuildingsList;
