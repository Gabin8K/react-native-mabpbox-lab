import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Position } from "@/utils/type";

export default function useLocation() {
  const [location, setLocation] = useState<Position>();

  useEffect(() => {
    (async () => {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: .5,
      });
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        alt: position.coords.altitude,
      })
    })()
  }, []);

  return location;
}