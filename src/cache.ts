import { defineStore } from "pinia";
import { Result } from "./characters-root";
import axios from "axios";
import { Root } from "./character-details";

interface Cache {
  characters: Record<string, Result>;
}

export const useCacheStore = defineStore("cache", {
  state: () => ({ characters: {} as Record<string, Result>, } as Cache),
  actions: {
    async fetchCharacter(url: string): Promise<Result> {
      const id = new URL(url).pathname.split("/").at(-1) as string;

      if (!Object.hasOwn(this.characters, id)) {
        const res = await axios.get<Root>(url)
        this.characters[id] = res.data;
      }

      return this.characters[id];
    },
    addCharacter(character: Result) {
      this.characters[character.id] = character;
    }
  }
}
);
