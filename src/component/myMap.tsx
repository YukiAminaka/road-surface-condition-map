import {
  MapMouseEvent,
  Map,
  MapProps,
  useMapsLibrary,
  useMap,
  Marker,
} from "@vis.gl/react-google-maps";
import { Children, ReactElement, useCallback, useState } from "react";
import { saveAs } from "file-saver";
import { useForm, SubmitHandler } from "react-hook-form";
import { Directions } from "./directions";

interface MyMapProps extends MapProps {}
interface MyMapProps {
  children?: ReactElement | ReactElement[];
}

export const MyMap = ({ children, ...props }: MyMapProps) => {
  // マーカーの位置を管理する状態
  const [originMarkerPosition, setOriginMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [destinationMarkerPosition, setDestinationMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  const handleClick = useCallback(
    (ev: MapMouseEvent) => {
      const latLng = ev.detail.latLng; // クリック位置を取得
      if (!latLng) return;
      if (originMarkerPosition && destinationMarkerPosition) return;

      if (!originMarkerPosition) {
        setOriginMarkerPosition(latLng);
      }
      if (originMarkerPosition && !destinationMarkerPosition) {
        setDestinationMarkerPosition(latLng);
      }
      console.log("A", originMarkerPosition);
      console.log("B", destinationMarkerPosition);
    },
    [originMarkerPosition, destinationMarkerPosition]
  );

  return (
    <Map {...props} onClick={handleClick}>
      {children}
      <Directions
        originMarkerPosition={originMarkerPosition}
        setOriginMarkerPosition={setOriginMarkerPosition}
        destinationMarkerPosition={destinationMarkerPosition}
        setDestinationMarkerPosition={setDestinationMarkerPosition}
      />
    </Map>
  );
};
