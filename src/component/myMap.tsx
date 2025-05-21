import { MapMouseEvent, Map, MapProps } from "@vis.gl/react-google-maps";
import { ReactElement, useCallback, useState } from "react";
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
