import React from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./marker";
import { useState } from "react";
import SingleMarker from "./singleMarker";
import { useEffect } from "react";
import { ILocationMarker } from "src/types/timebookTypes";

interface GoogleMapProps {
    markers?: ILocationMarker[];
    mark?: any;
    type?: "multi" | "single";
    activeIndex?: string | number;
    setActiveIndex?: (index: string | number) => void;
    zoom?: number;
    setFreeCoords?: any;
}

// Return map bounds based on list of markers
const getMapBounds = (map, maps, markers) => {
    const bounds = new maps.LatLngBounds();

    markers.forEach((marker) => {
        bounds.extend(new maps.LatLng(marker.coords.lat, marker.coords.lng));
    });
    return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
    maps.event.addDomListenerOnce(map, "idle", () => {
        maps.event.addDomListener(window, "resize", () => {
            map.fitBounds(bounds);
        });
    });
};

// Fit map to its bounds after the api is loaded
const apiIsLoaded = (map, maps, markers) => {
    // Get bounds by our markers
    const bounds = getMapBounds(map, maps, markers);
    // Fit map to bounds
    map.fitBounds(bounds);
    // Bind the resize listener
    bindResizeListener(map, maps, bounds);
};

const GoogleMap = ({
    markers,
    mark,
    type,
    activeIndex,
    setActiveIndex,
    zoom,
    setFreeCoords,
}: GoogleMapProps) => {
    const [alive, setAlive] = useState<boolean>(false);
    const JAPAN_CENTER_COORDS = {
        lat: 35.6762,
        lng: 139.6503,
    };

    function distanceToMouse({ x, y }, { x: mouseX, y: mouseY }) {
        return Math.sqrt(
            (x - mouseX) * (x - mouseX) + (y - mouseY) * (y - mouseY)
        );
    }

    const _onChildMouseEnter = (key, childProps) => {};

    const _onChildMouseLeave = () => {};

    const changeMarks = (markEvent: any) => {
        const { lat, lng } = markEvent;
        setFreeCoords({ lat, lng });
    };

    // useEffect(() => {
    //     // get users current location
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function (position) {});
    //     }
    // }, []);

    return (
        <>
            {type === "multi" && markers?.length !== 0 ? (
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyA-jsLh5KLSTf3n9GU8nLcfkr54vjj8KuU",
                        language: "ja",
                        region: "JP",
                    }}
                    defaultZoom={10}
                    defaultCenter={JAPAN_CENTER_COORDS}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                        apiIsLoaded(map, maps, markers)
                    }
                    onChildMouseEnter={_onChildMouseEnter}
                    onChildMouseLeave={_onChildMouseLeave}
                    distanceToMouse={distanceToMouse}
                    zoom={zoom}
                >
                    {type === "multi" &&
                        markers.map((marker) => (
                            <Marker
                                key={marker.id}
                                lat={marker.coords?.lat}
                                lng={marker.coords?.lng}
                                alive={alive}
                                setAlive={setAlive}
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex}
                                marker={marker}
                            />
                        ))}
                </GoogleMapReact>
            ) : type === "single" ? (
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyA-jsLh5KLSTf3n9GU8nLcfkr54vjj8KuU",
                        // key: "AIzaSyCrDx5Kk6kYplWgaI18NmXwn4FaWthA4uU",
                        language: "ja",
                        region: "JP",
                    }}
                    onClick={changeMarks}
                    defaultZoom={10}
                    defaultCenter={mark || JAPAN_CENTER_COORDS}
                    zoom={zoom}
                >
                    {mark && <SingleMarker lat={mark.lat} lng={mark.lng} />}
                </GoogleMapReact>
            ) : null}
        </>
    );
};

GoogleMap.defaultProps = {
    type: "single",
    activeIndex: -1,
};

export default GoogleMap;
