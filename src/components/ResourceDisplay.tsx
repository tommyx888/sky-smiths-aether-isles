
import { Droplets, Pickaxe, Flask } from "lucide-react";
import { useGame } from "@/context/GameContext";

const ResourceDisplay = () => {
  const { state } = useGame();
  const { resources } = state.player.island;

  return (
    <div className="flex flex-wrap gap-2">
      <div className="resource-counter">
        <Droplets className="h-4 w-4 text-sky" />
        <span>{Math.floor(resources.steam)}</span>
        <span className="text-muted-foreground">Steam</span>
      </div>
      
      <div className="resource-counter">
        <Pickaxe className="h-4 w-4 text-copper" />
        <span>{Math.floor(resources.ore)}</span>
        <span className="text-muted-foreground">Ore</span>
      </div>
      
      <div className="resource-counter">
        <Flask className="h-4 w-4 text-aether" />
        <span>{Math.floor(resources.aether)}</span>
        <span className="text-muted-foreground">Aether</span>
      </div>
    </div>
  );
};

export default ResourceDisplay;
