import React, { memo, PropsWithChildren, useEffect, useState } from 'react'
import useToast from '@/hooks/useToast';
import * as Location from 'expo-location';
import { Config } from '@/utils/type';
import useTheme from '@/hooks/useTheme';
import { useFonts } from 'expo-font';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';
import { StatusBar } from 'expo-status-bar';


const initialConfig: Config = {
  locationPermission: false,
}

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!!);


export const ConfigContext = React.createContext<Config>(initialConfig);


export default memo(function ({ children }: PropsWithChildren) {
  const toast = useToast();

  const { value } = useTheme();
  const [config, setConfig] = useState<Config>(initialConfig);
  const [loaded, error] = useFonts({
    TwEB: require('../assets/fonts/TwEB.ttf'),
    TwB: require('../assets/fonts/TwB.ttf'),
    TwSB: require('../assets/fonts/TwSB.ttf'),
    TwN: require('../assets/fonts/TwN.ttf'),
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        await NavigationBar.setBackgroundColorAsync('transparent');
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setConfig(conf => ({ ...conf, locationPermission: true }))
        return;
      } else {
        toast.error('Location permission is required to use the app');
      }
    })();
  }, [])


  if (!loaded || error) {
    return null;
  }

  return (
    <ConfigContext.Provider
      value={config}
    >
      <StatusBar
        style={'auto'}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: value.colors.background
        }}
      >
        {children}
      </SafeAreaView>
    </ConfigContext.Provider>
  )
});