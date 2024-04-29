import useStyle from "@/theme/useStyle";
import createStyleSheet from "@/utils/createStyleSheet";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Mapbox, { Camera, MarkerView } from "@rnmapbox/maps";
import { memo, useCallback, useRef, useState } from "react";
import GeoJsonView from "./GeoJsonView";
import { Position } from "@/utils/type";
import Animated, { SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Text from "../ui/Text";
import { Pressable } from "react-native";
import useMapStore from "@/stores/map.store";
import * as Speech from 'expo-speech';

type Props = {
  location?: Position;
}

const AnmatedPressable = Animated.createAnimatedComponent(Pressable);

export default memo<Props>(function (props) {
  const { style, value } = useStyle(styles);
  const scale = useSharedValue(1);
  const store = useMapStore();

  const camera = useRef<Camera>(null);
  const [start, setStart] = useState(false);

  const uas = useAnimatedStyle(() => ({
    zIndex: 2,
    transform: [{ scale: scale.value }]
  }), [])

  const onPress = useCallback(() => {
    if (store.centerCoordinate) {
      camera.current?.setCamera({
        centerCoordinate: [...store.centerCoordinate],
        zoomLevel: 19,
        heading: -58,
        animationDuration: 2000,
      });
      setStart(true);
      if (store.steps.length > 0) {
        Speech.speak(store.steps[0], {
          language: 'fr-FR',
          pitch: 1,
        });
      }
    }
  }, [store.centerCoordinate, store.steps]);


  if (!props.location) return null;

  return (
    <>
      <Mapbox.MapView
        zoomEnabled
        rotateEnabled
        styleURL={process.env.EXPO_PUBLIC_MAPBOX_STYLE_URL}
        style={style.map}
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
      >
        <Camera
          ref={camera}
          defaultSettings={{
            zoomLevel: 18,
            centerCoordinate: [props.location.lng, props.location.lat],
            pitch: 70,
          }}
          animationMode={'linearTo'}
        />
        <GeoJsonView
          camera={camera}
          location={props.location}
        />
        <MarkerView
          coordinate={[props.location.lng, props.location.lat]}
        >
          <MaterialIcons
            name={'location-pin'}
            color={value.colors.primary}
            size={24}
          />
        </MarkerView>
      </Mapbox.MapView>
      {store.centerCoordinate && !start ?
        <AnmatedPressable
          onPress={onPress}
          style={[style.text, uas]}
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown.duration(500)}
          onPressIn={() => (scale.value = withTiming(1.3))}
          onPressOut={() => (scale.value = withTiming(1))}
        >
          <Text
            bold
            size={40}
          >
            GO
          </Text>
        </AnmatedPressable> :
        start ?
          <Animated.View
            entering={SlideInDown.duration(500)}
            exiting={SlideOutDown.duration(500)}
            style={style.icon}
          >
            <MaterialCommunityIcons
              name={'navigation'}
              size={50}
              color={value.colors.primary}
              onPress={onPress}
            />
          </Animated.View> :
          null
      }
    </>
  )
});


const styles = createStyleSheet(({ space, colors }) => ({
  map: {
    flex: 1,
    zIndex: 1,
    width: space.width
  },
  text: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 80,
    bottom: 10,
    borderRadius: 40,
    elevation: 4,
    backgroundColor: colors.background,
  },
  icon: {
    position: 'absolute',
    bottom: 10,
    zIndex: 2,
  }
}));
