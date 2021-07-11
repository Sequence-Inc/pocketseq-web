import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect } from 'react';

interface IMap {
    options: google.maps.MapOptions
}

const Map = React.forwardRef<HTMLElement, IMap>(({ options }, ref) => {

    const loader = new Loader({
        apiKey: "AIzaSyCrDx5Kk6kYplWgaI18NmXwn4FaWthA4uU",
        version: "weekly",
    });

    useEffect(() => {
        loader.load().then((google) => {
            new google.maps.Map(document.getElementById("map") as HTMLElement, options);
        });
    }, []);

    return (
        <div id="map" className="w-full h-full" />
    )
})

export default Map;
