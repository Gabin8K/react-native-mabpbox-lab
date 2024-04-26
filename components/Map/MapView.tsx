import useStyle from "@/theme/useStyle";
import createStyleSheet from "@/utils/createStyleSheet";
import { MaterialIcons } from "@expo/vector-icons";
import Mapbox, { Camera, MarkerView } from "@rnmapbox/maps";
import { memo } from "react";
import GeoJsonView from "./GeoJsonView";
import { Position } from "@/utils/type";

type Props = {
  location?: Position;
}

export default memo<Props>(function (props) {
  const { style, value } = useStyle(styles);

  if (!props.location) return null;

  return (
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
        defaultSettings={{
          zoomLevel: 18,
          centerCoordinate: [props.location.lng, props.location.lat],
          pitch: 70,
        }}
        animationMode={'flyTo'}
      />
      <GeoJsonView
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
  )
});


const styles = createStyleSheet(({ space }) => ({
  map: {
    flex: 1,
    zIndex: 1,
    width: space.width
  },
}));
