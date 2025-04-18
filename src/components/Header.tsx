
import { CloudSun } from "lucide-react";
import ResourceDisplay from "./ResourceDisplay";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-brass-light to-copper-light p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <CloudSun className="h-8 w-8 text-brass-dark mr-2" />
          <h1 className="text-2xl font-bold text-brass-dark">
            SkySmith's Floating Isles
          </h1>
        </div>
        <ResourceDisplay />
      </div>
    </header>
  );
};

export default Header;
