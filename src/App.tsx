import { useCallback, useEffect, useState } from "react";

import { fetchMap } from "@deck.gl/carto";
import { APIProvider } from "@vis.gl/react-google-maps";
import { MyMap } from "./component/myMap";

import { useQuery } from "@tanstack/react-query";
import { Layer } from "deck.gl";
import { DeckGlOverlay } from "./deckgl-overlay";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

// type RoadSurface = {
//   lat: number;
//   lon: number;
//   alt: number;
//   status: string;
// };

// const defineColor = (status: string): [number, number, number] => {
//   switch (status) {
//     case "SMOOTH":
//       return [0, 255, 0]; //green
//     case "MEDIUM":
//       return [255, 255, 0]; //yellow
//     case "ROUGH":
//       return [255, 0, 0]; //red
//     case "SPRINT":
//       return [0, 0, 255]; //blue
//     case "IDLE":
//       return [0, 255, 255]; //cyan
//     default:
//       return [0, 0, 0]; //black
//   }
// };

const App = () => {
  // const layer = new ScatterplotLayer<RoadSurface>({
  //   id: "ScatterplotLayer",
  //   data: "../../public/2024-12-27-16-01-15.json",

  //   stroked: false,
  //   getPosition: (d: RoadSurface) => [d.lon, d.lat],
  //   // getRadius: (d: BartStation) => Math.sqrt(d.exits),
  //   getRadius: 10,
  //   getFillColor: (d: RoadSurface) => defineColor(d.status),
  //   getLineColor: [0, 0, 0],
  //   getLineWidth: 2,
  //   radiusUnits: "meters",
  //   radiusScale: 3,
  //   pickable: true,
  // });

  /*carto map ----------------------------------------------- */
  const [layers, setLayers] = useState<Layer<{}>[]>([]);
  const cartoMapId = import.meta.env.VITE_CARTO_MAP_ID;
  const apiBaseUrl = import.meta.env.VITE_CARTO_API_BASE_URL;

  const fetchLayer = useCallback(async () => {
    const { layers } = await fetchMap({
      cartoMapId,
      apiBaseUrl,
    });
    return layers;
  }, []);

  const { data } = useQuery({
    queryKey: ["layer"],
    queryFn: fetchLayer,
  });

  useEffect(() => {
    if (data) {
      setLayers(data);
    }
  }, [data]);

  return (
    <APIProvider apiKey={API_KEY}>
      <MyMap
        defaultCenter={{ lat: 35.6894, lng: 139.6917 }}
        defaultZoom={11}
        mapId={"4f6dde3310be51d7"}
        // mapId={"8eff1379908be55a"}
        gestureHandling={"greedy"}
      >
        <DeckGlOverlay layers={layers} />
      </MyMap>

      {/* サンプルのjsonデータを表示する場合上のMyMapをコメントアウトしてここのコメントアウトを外す */}
      {/* <MyMap
        defaultCenter={{ lat: 35.6894, lng: 139.6917 }}
        defaultZoom={11}
        mapId={"4f6dde3310be51d7"}
        gestureHandling={"greedy"}
      >
        <DeckGlOverlay layers={[layer]} />
      </MyMap> */}
    </APIProvider>
  );
};

// function getDeckGlLayers(data: GeoJSON | null) {
//   if (!data) return [];

//   return [
//     new GeoJsonLayer({
//       id: "geojson-layer",
//       data,
//       stroked: false,
//       filled: true,
//       extruded: true,
//       pointType: "circle",
//       lineWidthScale: 20,
//       lineWidthMinPixels: 4,
//       getFillColor: [160, 160, 180, 200],
//       getLineColor: (f: Feature) => {
//         const hex = f?.properties?.color;

//         if (!hex) return [0, 0, 0];

//         return hex.match(/[0-9a-f]{2}/g)!.map((x: string) => parseInt(x, 16));
//       },
//       getPointRadius: 200,
//       getLineWidth: 1,
//       getElevation: 30,
//     }),
//   ];
// }

export default App;
