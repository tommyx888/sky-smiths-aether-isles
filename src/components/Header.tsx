
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Compass, LogOut } from "lucide-react";
import ResourceDisplay from "./ResourceDisplay";

const Header = () => {
  const { user, signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
  };
  
  return (
    <header className="border-b border-border/40 bg-header/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-brass gear-icon" />
          <span className="text-xl font-bold text-brass">SkyPort Haven</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ResourceDisplay />
          
          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
