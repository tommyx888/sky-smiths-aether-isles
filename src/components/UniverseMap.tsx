
import { useState, useEffect } from 'react';
import { useUniverse } from '@/context/UniverseContext';
import { MapLocation } from '@/types/universe';
import { Building } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UniverseMap = () => {
  const { state, selectLocation, moveToLocation, startBattle, isLoading } = useUniverse();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Handle selecting a location
  const handleLocationClick = (location: MapLocation) => {
    selectLocation(location);
    setDialogOpen(true);
  };
  
  // Handle moving to a location
  const handleMoveToLocation = () => {
    if (state.selectedLocation) {
      moveToLocation(state.selectedLocation.id);
      setDialogOpen(false);
    }
  };
  
  // Handle starting a battle
  const handleStartBattle = () => {
    if (state.selectedLocation) {
      startBattle(state.selectedLocation.id);
      setDialogOpen(false);
    }
  };
  
  // Calculate if a location is adjacent to player's position
  const isAdjacentToPlayer = (location: MapLocation) => {
    if (!state.map.playerPosition) return false;
    
    const playerX = state.map.playerPosition.x;
    const playerY = state.map.playerPosition.y;
    const locationX = location.coordinates.x;
    const locationY = location.coordinates.y;
    
    // Adjacent means within 1 square in any direction (including diagonals)
    return Math.abs(playerX - locationX) <= 1 && Math.abs(playerY - locationY) <= 1;
  };
  
  // Get color for location type
  const getLocationColor = (type: string): string => {
    switch (type) {
      case 'player_city':
        return 'bg-gradient-to-br from-brass-light to-brass-dark border-brass';
      case 'ai_city':
        return 'bg-gradient-to-br from-red-400 to-red-600 border-red-500';
      case 'asteroid_field':
        return 'bg-gradient-to-br from-stone-400 to-stone-600 border-stone-500';
      case 'nebula':
        return 'bg-gradient-to-br from-aether-light to-aether-dark border-aether';
      case 'spaceport':
        return 'bg-gradient-to-br from-sky-light to-sky-dark border-sky';
      case 'trading_post':
        return 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-500';
      case 'pirate_hideout':
        return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-700';
      default:
        return 'bg-gradient-to-br from-gray-200 to-gray-400 border-gray-300';
    }
  };
  
  // Get icon for location type
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'player_city':
      case 'ai_city':
        return <Building className="w-5 h-5" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl font-medium">Loading universe map...</div>
      </div>
    );
  }
  
  return (
    <div className="steampunk-panel w-full overflow-hidden">
      <h2 className="text-xl font-bold mb-4 text-gradient">Universe Map</h2>
      
      <div className="relative bg-gray-800/30 rounded-lg p-2 h-[600px] overflow-auto">
        <div 
          className="relative grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${state.map.width}, minmax(0, 1fr))`,
            width: `${state.map.width * 50}px`
          }}
        >
          {/* Map grid cells */}
          {Array.from({ length: state.map.width * state.map.height }).map((_, index) => {
            const x = index % state.map.width;
            const y = Math.floor(index / state.map.width);
            
            // Find if there's a location at these coordinates
            const location = state.map.locations.find(
              loc => loc.coordinates.x === x && loc.coordinates.y === y
            );
            
            // Check if this is the player's position
            const isPlayerPosition = state.map.playerPosition?.x === x && 
                                     state.map.playerPosition?.y === y;
            
            const isAdjacent = location ? isAdjacentToPlayer(location) : false;
            const isDiscovered = location?.discovered || false;
            
            return (
              <div 
                key={`cell-${x}-${y}`}
                className={`
                  w-12 h-12 relative border 
                  ${isPlayerPosition ? 'border-yellow-400 border-2' : 'border-gray-700'}
                  ${isAdjacent ? 'ring-2 ring-yellow-300/50' : ''}
                  rounded-md flex items-center justify-center
                  transition-all duration-300
                `}
                onClick={() => location && (isDiscovered || isAdjacent) && handleLocationClick(location)}
              >
                {location && (isDiscovered || isAdjacent) ? (
                  <div 
                    className={`
                      w-10 h-10 rounded border-2 
                      ${getLocationColor(location.type)}
                      flex items-center justify-center
                      hover:scale-105 transition-transform cursor-pointer
                      ${location.owner === 'player' ? 'ring-2 ring-yellow-400' : ''}
                    `}
                    title={location.name}
                  >
                    {getLocationIcon(location.type)}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Fog of war or empty space */}
                    {!isDiscovered && !isAdjacent && (
                      <div className="w-8 h-8 rounded-full bg-gray-700/50 backdrop-blur-sm" />
                    )}
                  </div>
                )}
                
                {/* Player indicator */}
                {isPlayerPosition && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse z-10" />
                  </div>
                )}
                
                {/* Coordinates for debugging */}
                <span className="absolute bottom-0 right-0 text-[8px] text-gray-400 opacity-50">
                  {x},{y}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Location details dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="steampunk-panel border-brass">
          {state.selectedLocation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gradient">{state.selectedLocation.name}</DialogTitle>
                <DialogDescription>
                  {state.selectedLocation.discovered ? (
                    <div className="space-y-2 py-2">
                      <p>Type: {state.selectedLocation.type.replace('_', ' ')}</p>
                      
                      {state.selectedLocation.owner && (
                        <p>Controlled by: {state.selectedLocation.owner === "player" ? "You" : "AI"}</p>
                      )}
                      
                      {state.selectedLocation.resources && (
                        <div>
                          <p className="font-semibold">Available Resources:</p>
                          <div className="grid grid-cols-3 gap-2 mt-1">
                            <div className="resource-counter">
                              <span>Steam:</span> 
                              <span>{state.selectedLocation.resources.steam}</span>
                            </div>
                            <div className="resource-counter">
                              <span>Ore:</span> 
                              <span>{state.selectedLocation.resources.ore}</span>
                            </div>
                            <div className="resource-counter">
                              <span>Aether:</span> 
                              <span>{state.selectedLocation.resources.aether}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {state.selectedLocation.difficulty && (
                        <p>Difficulty: {'★'.repeat(state.selectedLocation.difficulty)}</p>
                      )}
                    </div>
                  ) : (
                    <p className="py-2">This location has not been explored yet.</p>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleMoveToLocation}
                  disabled={!isAdjacentToPlayer(state.selectedLocation)}
                  className="w-full sm:w-auto"
                >
                  {isAdjacentToPlayer(state.selectedLocation) 
                    ? "Travel to Location" 
                    : "Too Far to Travel"}
                </Button>
                
                {state.selectedLocation.type === 'ai_city' && 
                 state.selectedLocation.owner !== 'player' && 
                 isAdjacentToPlayer(state.selectedLocation) && (
                  <Button 
                    onClick={handleStartBattle}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    Attack City
                  </Button>
                )}
                
                {(state.selectedLocation.type === 'asteroid_field' || 
                  state.selectedLocation.type === 'nebula' ||
                  state.selectedLocation.type === 'pirate_hideout') && 
                 isAdjacentToPlayer(state.selectedLocation) && (
                  <Button 
                    onClick={handleStartBattle}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    Battle for Resources
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
          
          {state.inCombat && (
            <div className="border border-brass p-4 rounded-md mt-4 bg-black/30">
              <h3 className="font-bold mb-2">Combat Log</h3>
              <ul className="space-y-1">
                {state.combatLog.map((log, index) => (
                  <li key={index} className="text-sm">{log}</li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniverseMap;
