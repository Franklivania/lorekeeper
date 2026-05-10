import { create } from "zustand";

export type CharacterSummary = {
  id: string;
  name: string;
  world: string;
};

type CharacterState = {
  characters: CharacterSummary[];
  setCharacters: (items: CharacterSummary[]) => void;
};

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  setCharacters: (characters) => set({ characters }),
}));
