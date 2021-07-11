import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect } from 'react';
import { useRef } from 'react';

interface IMarkers {
    coords: google.maps.MapOptions;
    icon?: string | google.maps.Icon | google.maps.Symbol;
    content?: React.ReactNode;
}

interface IMap {
    options: google.maps.MapOptions
    markers: IMarkers[]
}

const Map = ({ options, markers }: IMap) => {
    const mapRef = useRef<HTMLDivElement>(null);

    const loader = new Loader({
        apiKey: "AIzaSyCrDx5Kk6kYplWgaI18NmXwn4FaWthA4uU",
        version: "weekly",
    });

    useEffect(() => {
        loader.load().then((google) => {
            const map = new google.maps.Map(mapRef?.current as HTMLElement, options);

            //marker
            markers.forEach((el: IMarkers) => {
                addMarker(el);
            })


            function addMarker({ coords, icon, content }: { coords: any, icon?: any, content?: any }) {
                const marker = new google.maps.Marker({ position: coords, map });
                if (icon) marker.setIcon(icon);
                if (content) {
                    const infoWindow = new google.maps.InfoWindow({ content })

                    marker.addListener('click', function () {
                        infoWindow.open(map, marker)
                    })
                }
            }
        });
    }, []);

    return (
        <div ref={mapRef} id="map" className="w-full h-full" />
    )
}

export default Map;
