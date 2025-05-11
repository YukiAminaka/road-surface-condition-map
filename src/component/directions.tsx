import { useEffect, useState } from "react";
import {
  Map,
  MapMouseEvent,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { saveAs } from "file-saver";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {
  originMarkerPosition: google.maps.LatLngLiteral | null;
  setOriginMarkerPosition: (position: google.maps.LatLngLiteral | null) => void;
  destinationMarkerPosition: google.maps.LatLngLiteral | null;
  setDestinationMarkerPosition: (
    position: google.maps.LatLngLiteral | null
  ) => void;
};

export function Directions({
  originMarkerPosition,
  setOriginMarkerPosition,
  destinationMarkerPosition,
  setDestinationMarkerPosition,
}: Props) {
  const map = useMap(); //useMap フックを使用して、地図のインスタンスを取得
  const routesLibrary = useMapsLibrary("routes"); //useMapsLibrary フックを使用して、ルートライブラリを取得
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>(); //ルート計算を行うためのGoogle Maps APIの DirectionsService インスタンスを管理
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>(); //計算されたルートを地図上に描画するための DirectionsRenderer インスタンスを管理。
  const [updatedRoute, setUpdatedRoute] =
    useState<google.maps.DirectionsRoute | null>(null);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]); //計算されたルートを管理

  useEffect(() => {
    if (!routesLibrary || !map) return; //routesLibrary または map が存在する場合のみ、初期化を行う
    //DirectionsService インスタンスと DirectionsRenderer インスタンスを作成し、状態にセット。
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({ map, draggable: true })
    );
  }, [routesLibrary, map]);

  // useEffect(() => {
  //   if (!directionsService || !directionsRenderer) return; //directionsService または directionsRenderer が存在する場合のみ、ルート計算を行う

  //   //ドラッグイベントを監視;
  //   directionsRenderer.addListener("directions_changed", () => {
  //     const updatedDirections = directionsRenderer.getDirections();
  //     if (updatedDirections) {
  //       const newRoute = updatedDirections.routes[0]; // 更新されたルートを取得
  //       // setUpdatedRoute(newRoute); // 状態に保存
  //       setRoutes([newRoute]); // 状態に保存
  //     }
  //   });

  //   // return () => directionsRenderer.setMap(null); //コンポーネントがアンマウントされるときに、DirectionsRenderer を地図から削除
  // }, [directionsService, directionsRenderer]);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    if (!directionsService) {
      setDirectionsService(new routesLibrary.DirectionsService());
    }

    if (!directionsRenderer) {
      const newRenderer = new routesLibrary.DirectionsRenderer({
        map,
        draggable: true,
      });
      setDirectionsRenderer(newRenderer);

      // Renderer のイベントリスナーを追加
      newRenderer.addListener("directions_changed", () => {
        const updatedDirections = newRenderer.getDirections();
        if (updatedDirections) {
          const newRoute = updatedDirections.routes[0];
          setRoutes([newRoute]);
        }
      });
    }

    return () => {
      directionsRenderer?.setMap(null); // クリーンアップ
    };
  }, [routesLibrary, map, directionsService, directionsRenderer]);

  // GPXファイルとしてルートを保存
  const saveRoutesAsGPX = () => {
    if (routes.length === 0) {
      alert("No routes available to save!");
      return;
    }

    const selectedRoute = routes[0]; // 最初のルートを使用
    const trackPoints = selectedRoute.overview_path.map(
      (point) => `<trkpt lat="${point.lat()}" lon="${point.lng()}"></trkpt>`
    );

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="YourAppName" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Route</name>
  </metadata>
  <trk>
    <name>${selectedRoute.summary}</name>
    <trkseg>
      ${trackPoints.join("\n")}
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
    saveAs(blob, "route.gpx");
  };

  type Inputs = {
    origin: string;
    destination: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { origin: "", destination: "" } });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    if (!directionsService || !directionsRenderer) return; //directionsService または directionsRenderer が存在する場合のみ、ルート計算を行う

    directionsService
      .route({
        origin: data.origin,
        destination: data.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true, //複数のルートを提供するかどうかを指定
      })
      .then((response) => {
        directionsRenderer.setDirections(response); //計算結果を地図上に描画
        setRoutes(response.routes); //計算結果を状態にセット
      });
  };

  useEffect(() => {
    if (!originMarkerPosition && !destinationMarkerPosition) return;
    reset({
      origin: originMarkerPosition
        ? originMarkerPosition?.lat + ", " + originMarkerPosition?.lng
        : "",
      destination: destinationMarkerPosition
        ? destinationMarkerPosition?.lat + ", " + destinationMarkerPosition?.lng
        : "",
    });
    if (originMarkerPosition && destinationMarkerPosition) {
      if (!directionsService || !directionsRenderer) return;
      console.log("route render");
      directionsService
        .route({
          origin: originMarkerPosition,
          destination: destinationMarkerPosition,
          travelMode: google.maps.TravelMode.BICYCLING,
          provideRouteAlternatives: true, //複数のルートを提供するかどうかを指定
        })
        .then((response) => {
          directionsRenderer.setDirections(response); //計算結果を地図上に描画
          setRoutes(response.routes); //計算結果を状態にセット
        });
      setOriginMarkerPosition(null);
      setDestinationMarkerPosition(null);
    }
  }, [originMarkerPosition, destinationMarkerPosition]);

  // const clear = () => {
  //   setOriginMarkerPosition(null);
  //   setDestinationMarkerPosition(null);
  //   directionsRenderer?.setMap(null);
  //   reset({ origin: "", destination: "" });
  // };
  const clear = () => {
    setOriginMarkerPosition(null);
    setDestinationMarkerPosition(null);
    reset({ origin: "", destination: "" });

    if (directionsRenderer) {
      directionsRenderer.setMap(null); // マップから削除
      setDirectionsRenderer(undefined);
    }

    if (directionsService && map && routesLibrary) {
      // 新しい DirectionsRenderer を作成してバインド
      const newRenderer = new routesLibrary.DirectionsRenderer({
        map,
        draggable: true,
      });
      setDirectionsRenderer(newRenderer);
    }
  };

  return (
    <>
      <div className="directions">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="origin" {...register("origin")} />
          <input placeholder="destination" {...register("destination")} />
          <button type="submit">search</button>
        </form>
        <button onClick={clear}>clear</button>
        <button onClick={saveRoutesAsGPX} className="save-button">
          Save as GPX
        </button>
      </div>
      {originMarkerPosition && (
        <Marker
          draggable
          position={originMarkerPosition}
          label={{ text: "A", color: "white" }}
        />
      )}
      {destinationMarkerPosition && (
        <Marker
          draggable
          position={destinationMarkerPosition}
          label={{ text: "B", color: "white" }}
        />
      )}
    </>
  );
}
