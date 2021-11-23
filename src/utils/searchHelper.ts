import algoliasearch, { SearchClient } from "algoliasearch";

export type AlgoliaClient = SearchClient;

export const algoliaClient: AlgoliaClient = algoliasearch(
    "K2PIS0458U",
    "6c2c5bb09c6f0da1002a51d1995969bd"
);

export const spaceIndex = algoliaClient.initIndex(`space_dev`);

type SpaceSearchFilterOptions = {
    spaceType?: string;
    city?: string;
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

    const { spaceType, geoloc, city } = filterOptions;

    let filters: string = "";
    if (spaceType)
        filters =
            filters === ""
                ? `spaceTypes:${spaceType}`
                : `${filters} AND spaceTypes:${spaceType}`;

    if (city)
        filters =
            filters === "" ? `city:${city}` : `${filters} AND city:${city}`;

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
