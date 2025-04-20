
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import ResourceDisplay from "@/components/ResourceDisplay";
import NavMenu from "@/components/NavMenu";

const Header = () => {
  const { signOut } = useAuth();
  const { state } = useGame();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <header className="bg-glass-gradient backdrop-blur-lg border-b border-white/10 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gradient">Sky Empires</h1>
          <NavMenu />
        </div>
        
        <div className="flex items-center gap-4">
          <ResourceDisplay />
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
