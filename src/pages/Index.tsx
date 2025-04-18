
import { GameProvider } from "@/context/GameContext";
import Header from "@/components/Header";
import GameDashboard from "@/components/GameDashboard";

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-sky-gradient">
        <Header />
        <GameDashboard />
      </div>
    </GameProvider>
  );
};

export default Index;
