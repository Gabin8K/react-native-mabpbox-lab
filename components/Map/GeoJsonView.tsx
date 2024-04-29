import { Fragment, memo, RefObject, useEffect, useState } from "react";
import useTheme from "@/hooks/useTheme";
import MapboxApi from "@/service/mapbox.api";
import Mapbox from "@rnmapbox/maps";
import { Point, Position } from "@/utils/type";
import useToast from "@/hooks/useToast";
import DestinationView from "./DestinationView";
import useMapStore from "@/stores/map.store";

type Props = {
  camera: RefObject<Mapbox.Camera>;
  location: Position;
}

type Direction = {
  geoJSON: GeoJSON.FeatureCollection;
  distance: number;
  destination: Point;
}

export default memo<Props>(function ({ location, camera }) {
  const { value } = useTheme();
  const toast = useToast();
  const store = useMapStore();

  const [direction, setDirection] = useState<Direction>();

  useEffect(() => {
    if (location && store.address) {
      MapboxApi.getDirection([location.lng, location.lat], store.address, store.mode)
        .then(data => {
          setDirection(data);
          camera.current?.flyTo([...data.destination])
          store.setCenterCoordinate(data.centerCoordinate);
          store.setSteps(data.steps);
        })
        .catch(() => toast.error('Failed to get direction'));
    }
  }, [location, store.address, store.mode])

  if (!direction) return null;

  return (
    <Fragment>
      <Mapbox.ShapeSource
        id={'line1'}
        shape={direction.geoJSON}
      >
        <Mapbox.LineLayer
          id={'linelayer1'}
          style={{
            lineColor: value.colors.primary,
            lineWidth: 5,
          }}
        />
      </Mapbox.ShapeSource>
      <DestinationView
        point={direction.destination}
        distance={direction.distance}
      />
    </Fragment>
  )
});