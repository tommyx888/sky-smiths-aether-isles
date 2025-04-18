
import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Island, Home } from "lucide-react";

const IslandInfo = () => {
  const { state, renameIsland } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(state.player.island.name);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    renameIsland(newName);
    setIsEditing(false);
  };
  
  return (
    <div className="steampunk-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Island className="h-6 w-6 mr-2 text-copper" />
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                className="text-lg font-bold"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="sm">Save</Button>
            </form>
          ) : (
            <div className="flex items-center">
              <h2 className="text-xl font-bold mr-2">
                {state.player.island.name}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0"
              >
                ✏️
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-brass" />
          <span className="font-medium">Level {state.player.island.level}</span>
        </div>
      </div>
    </div>
  );
};

export default IslandInfo;
