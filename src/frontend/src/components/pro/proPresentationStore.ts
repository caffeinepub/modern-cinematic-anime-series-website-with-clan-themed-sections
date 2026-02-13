import { create } from 'zustand';
import { ProBlock } from './proPresentationTypes';

interface ProPresentationStore {
  blocks: ProBlock[];
  setBlocks: (blocks: ProBlock[]) => void;
  addBlock: () => void;
  updateBlock: (id: string, updates: Partial<Omit<ProBlock, 'id'>>) => void;
  removeBlock: (id: string) => void;
  ensureAtLeastOneBlock: () => void;
}

export const useProPresentationStore = create<ProPresentationStore>((set) => ({
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
  addBlock: () =>
    set((state) => ({
      blocks: [
        ...state.blocks,
        {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: '',
          body: '',
        },
      ],
    })),
  updateBlock: (id, updates) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    })),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
  ensureAtLeastOneBlock: () =>
    set((state) => {
      if (state.blocks.length === 0) {
        return {
          blocks: [
            {
              id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: '',
              body: '',
            },
          ],
        };
      }
      return state;
    }),
}));
