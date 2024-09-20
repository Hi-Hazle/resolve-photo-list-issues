import { create } from 'zustand';

interface Store {
  value1: string;
  value2: string;
  value3: string;
}

interface StoreAction {
  setValue1: (value: string) => void;
  setValue2: (value: string) => void;
  setValue3: (value: string) => void;
  reset: () => void;
}

const initialStore: Store = {
  value1: '',
  value2: '',
  value3: '',
};

export const useStore = create<Store & StoreAction>((set) => ({
  ...initialStore,
  setValue1: (value) =>
    set((state) => {
      return {
        ...state,
        value1: value,
      };
    }),
  setValue2: (value) =>
    set((state) => {
      return {
        ...state,
        value2: value,
      };
    }),
  setValue3: (value) =>
    set((state) => {
      return {
        ...state,
        value3: value,
      };
    }),
  reset: () => {
    set(initialStore);
  },
}));
