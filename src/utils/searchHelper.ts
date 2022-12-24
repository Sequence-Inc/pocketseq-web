import { SearchResult } from "@comp";
import algoliasearch, { SearchClient } from "algoliasearch";
import { SubscriptionCategoryType } from "src/apollo/queries/subscriptions/core.schema";

export type AlgoliaClient = SearchClient;

export const algoliaClient: AlgoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

const isDev = process.env.NEXT_PUBLIC_IS_DEV === "true";

export const spaceIndex = algoliaClient.initIndex(
    isDev ? `space_dev` : `space_prod`
);
export const hotelIndex = algoliaClient.initIndex(
    isDev ? `hotel_dev` : `hotel_prod`
);

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
    subscriptionRank?: SubscriptionCategoryType;
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
    subscriptionRank?: SubscriptionCategoryType;
};

export const getFrontPageData = async () => {
    try {
        const { hits: space } = await spaceIndex.search("", {
            hitsPerPage: 4,
        });
        const { hits: hotel } = await hotelIndex.search("", {
            hitsPerPage: 4,
        });
        return { space, hotel };
    } catch (error) {
        console.log(error.message);
        return { space: null, hotel: null };
    }
};

export const searchSpace = async (
    searchText: string,
    filterOptions?: SpaceSearchFilterOptions,
    hitsPerPage?: number
) => {
    if (!filterOptions) return spaceIndex.search(searchText);
    if (!hitsPerPage) hitsPerPage = 40;
    const {
        spaceType,
        geoloc,
        city,
        max,
        minPax,
        price,
        minPrice,
        boundingBox,
        subscriptionRank,
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
                    ? `price.amount:${minPrice - 1} TO ${price}`
                    : `${filters} AND price.amount:${minPrice - 1} TO ${price}`;
        }
    }

    if (subscriptionRank) {
        let max = "";
        if (subscriptionRank === "A") {
            max = "<301";
        } else if (subscriptionRank === "B") {
            max = "<501";
        } else {
            max = ">500";
        }
        filters =
            filters === ""
                ? `subcriptionPrice${max}`
                : `${filters} AND subcriptinoPrice${max}`;
    }

    if (boundingBox) {
        return await spaceIndex.search(searchText, {
            filters,
            insideBoundingBox: [boundingBox],
            hitsPerPage,
        });
    } else {
        return await spaceIndex.search(searchText, {
            filters,
            hitsPerPage,
        });
    }
};

export const searchHotel = async (
    searchText: string,
    filterOptions?: HotelSearchFilterOptions,
    hitsPerPage?: number
) => {
    if (!filterOptions) return hotelIndex.search(searchText);
    if (!hitsPerPage) hitsPerPage = 40;
    const {
        geoloc,
        city,
        adult,
        child,
        breakfast,
        pet,
        buildingType,
        boundingBox,
        subscriptionRank,
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

    if (subscriptionRank) {
        let max = "";
        if (subscriptionRank === "A") {
            max = "<7001";
        } else if (subscriptionRank === "B") {
            max = "<10001";
        } else {
            max = ">10000";
        }
        filters =
            filters === ""
                ? `subcriptionPrice${max}`
                : `${filters} AND subcriptinoPrice${max}`;
    }

    if (boundingBox) {
        return await hotelIndex.search(searchText, {
            filters,
            insideBoundingBox: [boundingBox],
            hitsPerPage,
        });
    } else {
        return await hotelIndex.search(searchText, {
            filters,
            hitsPerPage,
        });
    }
};

export const recommendationHelper = async (
    type: "HOTEL" | "SPACE",
    logic: any
) => {
    const index = type === "HOTEL" ? hotelIndex : spaceIndex;

    return await index.search("", { ...logic, hitsPerPage: 5 });
};

export const renderPax = (type, maxAdult, maxChild) => {
    if (type === "hotel") {
        return `ゲスト${maxAdult + maxChild}名`;
    } else {
        if (maxChild === 0) {
            return `大人${maxAdult}名`;
        } else {
            return `大人${maxAdult}名・子供${maxChild}名`;
        }
    }
};

export const HOTEL_BUILDING_TYPES = {
    WHOLE_HOUSE: "一棟貸し",
    SIMPLE_ACCOMODATION: "簡易宿泊",
    HOTEL: "ホテル",
    INN: "旅館",
};

export const prepareSearchResult = (
    type: "hotel" | "space",
    results
): SearchResult[] => {
    return results.map((result: any): SearchResult => {
        const address = `${result.prefecture}${result.city}`;
        if (type === "space") {
            let max = 9999999999;
            let min = 0;
            let spaceType = "HOURLY";
            let duration = 1;

            result.price.map((price) => {
                if (max > price.amount && price.amount >= min) {
                    max = price.amount;
                    spaceType = price.type;
                    duration = price.duration;
                }
            });

            let priceUnit: "泊" | "日" | "時間" | "分" | string;

            if (spaceType === "DAILY") {
                priceUnit = "日";
            } else if (spaceType === "HOURLY") {
                priceUnit = "時間";
            } else {
                priceUnit = "分";
            }

            if (duration > 1) {
                priceUnit = duration + priceUnit;
            }

            return {
                id: result.objectID,
                name: result.name,
                maxAdult: result.maximumCapacity,
                maxChild: 0,
                price: max,
                priceUnit,
                lat: result._geoloc?.lat,
                lng: result._geoloc?.lng,
                thumbnail: result.thumbnail,
                category: result.spaceTypes[0],
                address,
                type,
            };
        } else {
            return {
                id: result.objectID,
                name: result.name,
                maxAdult: result.maxAdult,
                maxChild: result.maxChild,
                price: result.lowestPrice,
                priceUnit: "泊",
                lat: result._geoloc?.lat,
                lng: result._geoloc?.lng,
                thumbnail: result.thumbnail,
                category: HOTEL_BUILDING_TYPES[result.buildingType],
                address,
                type,
            };
        }
    });
};
