import { Point, Position, SearchItem } from "@/utils/type";
import uuid4 from "@/utils/uuid4";

const session_token = uuid4();

async function getDirection(origin: Point, query: string, mode: string) {
  const destination = await getGeoCoding(query);

  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${mode}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?` +
    new URLSearchParams({
      geometries: 'geojson',
      access_token: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!!,
      language: 'fr',
      steps: 'true'
    })
  );
  const data = await response.json()

  const distance = data.routes[0].distance;
  const centerCoordinate = data.routes[0].geometry.coordinates[0] as Point;
  const steps = data.routes[0].legs[0].steps.map((step: any) => step.maneuver.instruction);

  const geoJSON: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: data?.routes[0]?.geometry,
      },
    ]
  }
  return {
    steps,
    geoJSON,
    distance,
    destination,
    centerCoordinate,
  }
}


async function search(query: string, location: Position, navigation_profile: string): Promise<SearchItem[]> {
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?` +
    new URLSearchParams({
      q: query,
      session_token,
      access_token: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!!,
      proximity: `${location.lng},${location.lat}`,
      origin: `${location.lng},${location.lat}`,
      navigation_profile,
      eta_type: 'navigation',
      limit: '10',
    })
  );
  const data = await response.json();
  return data.suggestions.map((suggestion: any, id: number) => ({
    id,
    name: suggestion.name,
    address: suggestion.full_address,
    distance: suggestion.distance,
    time: suggestion.eta,
  }));
}


async function getGeoCoding(query: string) {
  const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
  const data = await response.json();
  return data.features[0].center as Point;
}

const MapboxApi = {
  getDirection,
  getGeoCoding,
  search
}

export default MapboxApi;