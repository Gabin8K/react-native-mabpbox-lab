import React from "react";
import { BackHandler } from "react-native";

export default function useBackHandler(handler: () => boolean, dependecies: any[]): void {
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => backHandler.remove();
  }, dependecies);
}