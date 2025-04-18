
import { BuildingInfo } from "@/types/game";

export const BUILDINGS_CONFIG: Record<string, BuildingInfo> = {
  steam_generator: {
    type: "steam_generator",
    name: "Steam Generator",
    description: "Produces steam power for your island and airships.",
    cost: { steam: 0, ore: 50, aether: 0 },
    production: { steam: 10 },
    size: { width: 1, height: 1 },
    buildTime: 60,
    icon: "steam",
    model: "steam_generator"
  },
  ore_mine: {
    type: "ore_mine",
    name: "Ore Mine",
    description: "Extracts valuable ore from your floating island.",
    cost: { steam: 100, ore: 0, aether: 0 },
    production: { ore: 8 },
    size: { width: 1, height: 1 },
    buildTime: 120,
    icon: "pick",
    model: "ore_mine"
  },
  aether_collector: {
    type: "aether_collector",
    name: "Aether Collector",
    description: "Collects rare aether energy from the sky.",
    cost: { steam: 200, ore: 100, aether: 0 },
    production: { aether: 3 },
    size: { width: 1, height: 1 },
    buildTime: 300,
    icon: "flask",
    model: "aether_collector"
  },
  workshop: {
    type: "workshop",
    name: "Workshop",
    description: "Build and upgrade airships.",
    cost: { steam: 150, ore: 200, aether: 10 },
    size: { width: 2, height: 2 },
    buildTime: 300,
    icon: "wrench",
    model: "workshop"
  },
  barracks: {
    type: "barracks",
    name: "Barracks",
    description: "Train crew for your airships.",
    cost: { steam: 100, ore: 150, aether: 5 },
    size: { width: 2, height: 1 },
    buildTime: 240,
    icon: "users",
    model: "barracks"
  },
  sky_forge: {
    type: "sky_forge",
    name: "Sky Forge",
    description: "Craft defenses for your island.",
    cost: { steam: 200, ore: 300, aether: 20 },
    size: { width: 2, height: 2 },
    buildTime: 600,
    icon: "shield",
    model: "sky_forge"
  },
  sky_dock: {
    type: "sky_dock",
    name: "Sky Dock",
    description: "Store and launch airships.",
    cost: { steam: 300, ore: 250, aether: 15 },
    size: { width: 2, height: 1 },
    buildTime: 480,
    icon: "anchor",
    model: "sky_dock"
  }
};

export const INITIAL_RESOURCES: { steam: number; ore: number; aether: number } = {
  steam: 500,
  ore: 250,
  aether: 50
};

export const GRID_SIZE = {
  width: 10,
  height: 10
};

export const RESOURCE_PRODUCTION_INTERVAL = 10; // in seconds
