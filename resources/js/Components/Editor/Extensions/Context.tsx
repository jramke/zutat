import { Cookbook } from "@/types"
import { Extension } from "@tiptap/react"

export interface ContextOptions {
    cookbook: Cookbook | null
};

export const Context = Extension.create<ContextOptions>({
    name: 'context',

    addOptions() {
        return {
            cookbook: null,
        }
    },
  
    addStorage() {
      return {
        ...this.options,
      }
    },
});
