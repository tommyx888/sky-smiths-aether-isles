
import { UniverseProvider } from "@/context/UniverseContext";
import Header from "@/components/Header";
import UniverseMap from "@/components/UniverseMap";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Universe = () => {
  const navigate = useNavigate();
  
  return (
    <UniverseProvider>
      <div className="min-h-screen bg-sky-gradient">
        <Header />
        
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gradient">Universe Navigation</h1>
            <Button onClick={() => navigate('/')}>Return to City</Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <UniverseMap />
          </div>
        </main>
      </div>
    </UniverseProvider>
  );
};

export default Universe;
