import { create } from "zustand";

type MapStore = {
  address?: string;
  name?: string;
  query?: string;
  mode: 'driving' | 'walking' | 'cycling';
}


type MapStoreActions = {
  setAddress: (address: string) => void;
  setName: (name: string) => void;
  setQuery: (query: string) => void;
  setMode: (mode: 'driving' | 'walking' | 'cycling') => void;
}


const useMapStore = create<MapStore & MapStoreActions>((set) => ({
  location: { lat: 0, lng: 0 },
  address: '',
  query: '',
  mode: 'driving',
  setName: (name) => set({ name }),
  setAddress: (address) => set({ address }),
  setQuery: (query) => set({ query }),
  setMode: (mode) => set({ mode })
}));

export default useMapStore;