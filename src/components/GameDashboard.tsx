
import { useGame } from "@/context/GameContext";
import { Loader2 } from "lucide-react";
import IslandRenderer from "./IslandRenderer";
import BuildingSelector from "./BuildingSelector";
import IslandInfo from "./IslandInfo";
import BuildingsList from "./BuildingsList";
import AirshipViewer from "./AirshipViewer";
import { Compass, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GameDashboard = () => {
  const { isLoading } = useGame();
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-brass" />
          <p className="text-muted-foreground">Loading your islands...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <IslandInfo />
          
          <Alert className="bg-sky-light border-brass">
            <Info className="h-4 w-4" />
            <AlertTitle>Floating Islands Network</AlertTitle>
            <AlertDescription>
              Your sky empire consists of multiple floating islands. Each building is constructed on its own island, 
              connected by sky bridges. New islands can only be built adjacent to existing ones.
            </AlertDescription>
          </Alert>
          
          <BuildingsList />
        </div>
        
        {/* Middle column - Island View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="steampunk-panel h-[400px]">
            <IslandRenderer />
          </div>
          
          <BuildingSelector />
          
          <div className="steampunk-panel">
            <h2 className="text-xl font-bold mb-4 text-brass-dark flex items-center">
              <Compass className="mr-2 h-6 w-6 gear-icon" />
              Airship Hangar
            </h2>
            <p className="text-muted-foreground mb-4">
              Your airship fleet is empty. Build a Workshop and Sky Dock to construct airships.
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <AirshipViewer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
