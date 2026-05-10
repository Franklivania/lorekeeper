import type { WorldId } from "./constants";

export type WorldTheme = {
  id: WorldId;
  label: string;
  primary: string;
  secondary: string;
  glow: string;
  background: string;
  text: string;
};

export const WORLDS: Record<WorldId, WorldTheme> = {
  aethon: {
    id: "aethon",
    label: "Aethon",
    primary: "#3C3489",
    secondary: "#AFA9EC",
    glow: "#7F77DD44",
    background: "#12101E",
    text: "#CECBF6",
  },
  mechara: {
    id: "mechara",
    label: "Mechara",
    primary: "#185FA5",
    secondary: "#85B7EB",
    glow: "#378ADD33",
    background: "#0D1420",
    text: "#B5D4F4",
  },
  khoras: {
    id: "khoras",
    label: "Khoras",
    primary: "#993C1D",
    secondary: "#F0997B",
    glow: "#D85A3033",
    background: "#140C08",
    text: "#F5C4B3",
  },
  mirren: {
    id: "mirren",
    label: "Mirren",
    primary: "#3B6D11",
    secondary: "#97C459",
    glow: "#63992233",
    background: "#0C1209",
    text: "#C0DD97",
  },
  vael: {
    id: "vael",
    label: "Vael",
    primary: "#7B4397",
    secondary: "#E7C8FF",
    glow: "#B56FFF33",
    background: "#110B14",
    text: "#EAD9FB",
  },
};

export function getWorldTheme(world: string): WorldTheme {
  const key = world as WorldId;
  return WORLDS[key] ?? WORLDS.aethon;
}
