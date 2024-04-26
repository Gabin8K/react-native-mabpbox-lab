export type Config = {
  locationPermission: boolean;
}

export type Position = {
  lat: number;
  lng: number;
  alt?: number | null;
}

export type Point = readonly [number, number];

export type SearchItem = {
  id: string;
  name?: string;
  address?: string;
  distance?: number;
  time?: number;
}

export type Toast = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  clear: () => void;
}

