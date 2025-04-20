
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Building, Map, Ship } from "lucide-react";

const NavMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={location.pathname === "/" ? "bg-accent/50" : ""}
          >
            <Building className="w-4 h-4 mr-2" />
            City
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brass/50 to-brass-dark/40 p-6 no-underline outline-none focus:shadow-md"
                    onClick={() => navigate('/')}
                  >
                    <Building className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      City Management
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Manage your city, construct buildings, and gather resources.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={location.pathname === "/universe" ? "bg-accent/50" : ""}
          >
            <Map className="w-4 h-4 mr-2" />
            Universe
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-sky-dark/50 to-sky/40 p-6 no-underline outline-none focus:shadow-md"
                    onClick={() => navigate('/universe')}
                  >
                    <Map className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Universe Map
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Explore the universe, discover new locations, and conquer enemy cities.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger disabled>
            <Ship className="w-4 h-4 mr-2" />
            Fleet
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li className="row-span-3">
                <div className="p-4">
                  <div className="text-lg font-medium">Fleet Management</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Coming soon: Build and manage your airship fleet.
                  </p>
                </div>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
