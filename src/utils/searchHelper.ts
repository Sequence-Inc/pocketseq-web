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
    minPax?: number;
    price?: number;
    minPrice?: number;
    geoloc?: {
        latitude: number;
        longitude: number;
        radius: number;
    };
    boundingBox?: number[];
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
    boundingBox?: number[];
};

export const searchSpace = async (
    searchText: string,
    filterOptions?: SpaceSearchFilterOptions
) => {
    if (!filterOptions) return spaceIndex.search(searchText);
    const {
        spaceType,
        geoloc,
        city,
        max,
        minPax,
        price,
        minPrice,
        boundingBox,
    } = filterOptions;

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
        if (minPax > 0) {
            filters =
                filters === ""
                    ? `maximumCapacity:${minPax} TO ${max}`
                    : `${filters} AND maximumCapacity:${minPax} TO ${max}`;
        } else {
            filters =
                filters === ""
                    ? `maximumCapacity >= ${max}`
                    : `${filters} AND maximumCapacity >=${max}`;
        }
    }
    if (price) {
        if (minPrice) {
            filters =
                filters === ""
                    ? `AND price.amount:${minPrice - 1} TO ${price}`
                    : `${filters} AND price.amount:${minPrice - 1} TO ${price}`;
        }
    }

    if (boundingBox) {
        return await spaceIndex.search(searchText, {
            filters,
            insideBoundingBox: [boundingBox],
        });
    } else {
        return await spaceIndex.search(searchText, {
            filters,
        });
    }
};

export const searchHotel = async (
    searchText: string,
    filterOptions?: HotelSearchFilterOptions
) => {
    if (!filterOptions) return hotelIndex.search(searchText);
    const {
        geoloc,
        city,
        adult,
        child,
        breakfast,
        pet,
        buildingType,
        boundingBox,
    } = filterOptions;
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

    if (boundingBox) {
        return await hotelIndex.search(searchText, {
            filters,
            insideBoundingBox: [boundingBox],
        });
    } else {
        return await hotelIndex.search(searchText, {
            filters,
        });
    }
};
