import { Point } from "@/utils/type";
import { create } from "zustand";

type MapStore = {
  address?: string;
  name?: string;
  query?: string;
  centerCoordinate?: Point;
  steps:string[];
  mode: 'driving' | 'walking' | 'cycling';
}


type MapStoreActions = {
  setAddress: (address: string) => void;
  setName: (name: string) => void;
  setQuery: (query: string) => void;
  setMode: (mode: 'driving' | 'walking' | 'cycling') => void;
  setSteps: (steps: string[]) => void;
  setCenterCoordinate: (centerCoordinate: Point) => void;
}


const useMapStore = create<MapStore & MapStoreActions>((set) => ({
  location: { lat: 0, lng: 0 },
  address: '',
  query: '',
  mode: 'driving',
  steps: [],
  setName: (name) => set({ name }),
  setAddress: (address) => set({ address }),
  setQuery: (query) => set({ query }),
  setMode: (mode) => set({ mode }),
  setSteps: (steps) => set({ steps }),
  setCenterCoordinate: (centerCoordinate) => set({ centerCoordinate }),
}));

export default useMapStore;