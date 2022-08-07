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
    price?: number;
    minPrice?: number;
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
    breakfast?: boolean;
    pet?: boolean;
    buildingType?: string;
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
    const { spaceType, geoloc, city, max, price, minPrice } = filterOptions;

    let filters: string = "";
    if (spaceType)
        filters =
            filters === ""
                ? `spaceTypes:${spaceType}`
                : `${filters} AND spaceTypes:${spaceType}`;

    if (city)
        filters =
            filters === "" ? `city:${city}` : `${filters} AND city:${city}`;
    if (max) {
        if (max === 40) {
            filters =
                filters === ""
                    ? `maximumCapacity >= ${max}`
                    : `${filters} AND maximumCapacity >= ${max}`;
        } else {
            filters =
                filters === ""
                    ? `maximumCapacity <= ${max}`
                    : `${filters} AND maximumCapacity <= ${max}`;
        }
    }

    if (price) {
        if (minPrice) {
            filters =
                filters === ""
                    ? `price.type:HOURLY AND price.duration:1 AND price.amount:${minPrice} TO ${price}`
                    : `${filters} AND price.type:HOURLY AND price.duration:1 AND price.amount:${minPrice} TO ${price}`;
        }
    }

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
    const { geoloc, city, adult, child, breakfast, pet, buildingType } =
        filterOptions;
    let filters: string = "";

    if (city)
        filters =
            filters === "" ? `city:${city}` : `${filters} AND city:${city}`;

    if (breakfast)
        filters =
            filters === ""
                ? `isBreakfastIncluded:${breakfast}`
                : `${filters} AND isBreakfastIncluded:${breakfast}`;
    if (pet)
        filters =
            filters === ""
                ? `isPetAllowed:${pet}`
                : `${filters} AND isPetAllowed:${pet}`;
    if (buildingType)
        filters =
            filters === ""
                ? `buildingType:${buildingType}`
                : `${filters} AND buildingType:${buildingType}`;
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
