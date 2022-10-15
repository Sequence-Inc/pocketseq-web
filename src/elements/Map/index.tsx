import React from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./marker";
import { useState } from "react";
import SingleMarker from "./singleMarker";
import { ILocationMarker } from "src/types/timebookTypes";

interface GoogleMapProps {
    markers?: ILocationMarker[];
    mark?: any;
    type?: "multi" | "single";
    activeIndex?: string | number;
    setActiveIndex?: (index: string | number) => void;
    zoom?: number;
    setFreeCoords?: any;
    onChange?: any;
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

const defaultZoom = 5;

const GoogleMap = ({
    markers,
    mark,
    type,
    activeIndex,
    setActiveIndex,
    zoom,
    setFreeCoords,
    onChange,
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

    const _onChange = (props) => {
        onChange && onChange(props);
    };

    const changeMarks = (markEvent: any) => {
        const { lat, lng } = markEvent;
        setFreeCoords({ lat, lng });
    };

    return (
        <>
            {type === "multi" && markers?.length !== 0 ? (
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyA-jsLh5KLSTf3n9GU8nLcfkr54vjj8KuU",
                        language: "ja",
                        region: "JP",
                    }}
                    defaultZoom={defaultZoom}
                    defaultCenter={JAPAN_CENTER_COORDS}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                        apiIsLoaded(map, maps, markers)
                    }
                    onChildMouseEnter={_onChildMouseEnter}
                    onChildMouseLeave={_onChildMouseLeave}
                    distanceToMouse={distanceToMouse}
                    onChange={_onChange}
                    zoom={zoom}
                    options={(maps) => ({
                        styles: [
                            {
                                featureType: "administrative",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#d6e2e6",
                                    },
                                ],
                            },
                            {
                                featureType: "administrative",
                                elementType: "geometry.stroke",
                                stylers: [
                                    {
                                        color: "#cfd4d5",
                                    },
                                ],
                            },
                            {
                                featureType: "administrative",
                                elementType: "labels.text.fill",
                                stylers: [
                                    {
                                        color: "#7492a8",
                                    },
                                ],
                            },
                            {
                                featureType: "administrative.neighborhood",
                                elementType: "labels.text.fill",
                                stylers: [
                                    {
                                        lightness: 25,
                                    },
                                ],
                            },
                            {
                                featureType: "landscape.man_made",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#dde2e3",
                                    },
                                ],
                            },
                            {
                                featureType: "landscape.man_made",
                                elementType: "geometry.stroke",
                                stylers: [
                                    {
                                        color: "#cfd4d5",
                                    },
                                ],
                            },
                            {
                                featureType: "landscape.natural",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#dde2e3",
                                    },
                                ],
                            },
                            {
                                featureType: "landscape.natural",
                                elementType: "labels.text.fill",
                                stylers: [
                                    {
                                        color: "#7492a8",
                                    },
                                ],
                            },
                            {
                                featureType: "landscape.natural.terrain",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "poi",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#dde2e3",
                                    },
                                ],
                            },
                            {
                                featureType: "poi",
                                elementType: "labels.icon",
                                stylers: [
                                    {
                                        saturation: -100,
                                    },
                                ],
                            },
                            {
                                featureType: "poi",
                                elementType: "labels.text.fill",
                                stylers: [
                                    {
                                        color: "#588ca4",
                                    },
                                ],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#a9de83",
                                    },
                                ],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "geometry.stroke",
                                stylers: [
                                    {
                                        color: "#bae6a1",
                                    },
                                ],
                            },
                            {
                                featureType: "poi.sports_complex",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#c6e8b3",
                                    },
                                ],
                            },
                            {
                                featureType: "poi.sports_complex",
                                elementType: "geometry.stroke",
                                stylers: [
                                    {
                                        color: "#bae6a1",
                                    },
                                ],
                            },
                            {
                                featureType: "road",
                                elementType: "labels.icon",
                                stylers: [
                                    {
                                        saturation: -45,
                                    },
                                    {
                                        lightness: 10,
                                    },
                                    {
                                        visibility: "on",
                                    },
                                ],
                            },
                            {
                                featureType: "road",
                                elementType: "labels.text.fill",
                                stylers: [
                                    {
                                        color: "#41626b",
                                    },
                                ],
                            },
                            {
                                featureType: "road.arterial",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#ffffff",
                                    },
                                ],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#c1d1d6",
                                    },
                                ],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry.stroke",
                                stylers: [
                                    {
                                        color: "#a6b5bb",
                                    },
                                ],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "labels.icon",
                                stylers: [
                                    {
                                        visibility: "on",
                                    },
                                ],
                            },
                            {
                                featureType: "road.highway.controlled_access",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#9fb6bd",
                                    },
                                ],
                            },
                            {
                                featureType: "road.local",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#ffffff",
                                    },
                                ],
                            },
                            {
                                featureType: "transit",
                                elementType: "labels.icon",
                                stylers: [
                                    {
                                        saturation: -70,
                                    },
                                ],
                            },
                            {
                                featureType: "transit.line",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#b4cbd4",
                                    },
                                ],
                            },
                            {
                                featureType: "transit.line",
                                elementType: "labels.text.fill",
                                stylers: [
                                    {
                                        color: "#588ca4",
                                    },
                                ],
                            },
                            {
                                featureType: "transit.station",
                                elementType: "labels.text.fill",
                                stylers: [
                                    {
                                        color: "#008cb5",
                                    },
                                ],
                            },
                            {
                                featureType: "transit.station.airport",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        saturation: -100,
                                    },
                                    {
                                        lightness: -5,
                                    },
                                ],
                            },
                            {
                                featureType: "water",
                                elementType: "geometry.fill",
                                stylers: [
                                    {
                                        color: "#a6cbe3",
                                    },
                                ],
                            },
                        ],
                    })}
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
                    defaultZoom={defaultZoom}
                    defaultCenter={mark || JAPAN_CENTER_COORDS}
                    zoom={zoom}
                    options={(maps) => ({
                        styles: [
                            {
                                featureType: "administrative.land_parcel",
                                elementType: "labels",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "poi",
                                elementType: "labels.text",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "poi.business",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "labels.text",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "road.arterial",
                                elementType: "labels",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "labels",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "road.local",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                            {
                                featureType: "road.local",
                                elementType: "labels",
                                stylers: [
                                    {
                                        visibility: "off",
                                    },
                                ],
                            },
                        ],
                    })}
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
