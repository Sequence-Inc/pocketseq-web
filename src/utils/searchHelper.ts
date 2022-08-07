import algoliasearch, { SearchClient } from "algoliasearch";

export type AlgoliaClient = SearchClient;

export const algoliaClient: AlgoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export const spaceIndex = algoliaClient.initIndex(`space_dev`);
export const hotelIndex = algoliaClient.initIndex(`hotel_dev`);

type SpaceSearchFilterOptions = {
    spaceType?: string;
    city?: string;
    max?: number;
    geoloc?: {
        latitude: number;
        longitude: number;
        radius: number;
    };
};
type HotelSearchFilterOptions = {
    city?: string;
    adult?: number;
    child?: number;
    geoloc?: {
        latitude: number;
        longitude: number;
        radius: number;
    };
};

export const searchSpace = async (
    searchText: string,
    filterOptions?: SpaceSearchFilterOptions
) => {
    if (!filterOptions) return spaceIndex.search(searchText);
    const { spaceType, geoloc, city, max } = filterOptions;

    let filters: string = "";
    if (spaceType)
        filters =
            filters === ""
                ? `spaceTypes:${spaceType}`
                : `${filters} AND spaceTypes:${spaceType}`;

    if (city)
        filters =
            filters === "" ? `city:${city}` : `${filters} AND city:${city}`;
    if (max)
        filters =
            filters === ""
                ? `maximumCapacity > ${max}`
                : `${filters} AND maximumCapacity > ${max}`;

    let aroundLatLng: string;
    let aroundRadius: number;

    if (geoloc) {
        const { latitude, longitude, radius } = geoloc;
        aroundLatLng = `${latitude}, ${longitude}`;
        aroundRadius = radius;
    }

    return await spaceIndex.search(searchText, {
        filters,
        aroundLatLng,
        aroundRadius,
    });
};

export const searchHotel = async (
    searchText: string,
    filterOptions?: HotelSearchFilterOptions
) => {
    if (!filterOptions) return hotelIndex.search(searchText);
    const { geoloc, city, adult, child } = filterOptions;

    let filters: string = "";

    if (city)
        filters =
            filters === "" ? `city:${city}` : `${filters} AND city:${city}`;

    if (adult)
        filters =
            filters === ""
                ? `maxAdult >= ${adult}`
                : `${filters} AND maxAdult >= ${adult}`;

    if (child)
        filters =
            filters === ""
                ? `maxChild >= ${child}`
                : `${filters} AND maxChild >= ${child}`;

    let aroundLatLng: string;
    let aroundRadius: number;
    if (geoloc) {
        const { latitude, longitude, radius } = geoloc;
        aroundLatLng = `${latitude}, ${longitude}`;
        aroundRadius = radius;
    }

    return await hotelIndex.search(searchText, {
        filters,
        aroundLatLng,
        aroundRadius,
    });
};
