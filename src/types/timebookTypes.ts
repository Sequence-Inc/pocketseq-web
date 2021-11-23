import { IncomingMessage } from "http";

export interface ISpace {
    id?: string | number;
    description: string;
    maximumCapacity: number;
    name: string;
    nearestStations: INearestStation[];
    numberOfSeats: number;
    spacePricePlans: ISpacePricePlan[];
    spaceSize: number;
    spaceTypes: ISpaceType[];
    address: IAddress;
    photos: IPhoto[];
}

export interface IAddress {
    id: string | number;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    latitude: number;
    longitude: number;
    postalCode: string;
    prefecture: IPrefecture;
}
export interface IPrefecture {
    id: string | number;
    name: string;
}
export interface INearestStation {
    station: IStation;
    time: number;
    via: string;
}

export interface IStation {
    id: string | number;
    stationName: string;
}

export type TSpacePrice = "HOURLY" | "DAILY";

export interface ISpacePricePlan {
    id: string | number;
    amount: number;
    cooldownTime: number;
    duration: number;
    lastMinuteDiscount: number;
    maintenanceFee: number;
    title: string;
    type: TSpacePrice;
}

export interface ISpaceType {
    id: string | number;
    title: string;
}

export interface IPhoto {
    id: string | number;
    mime: string;
    type: "Profile" | "Cover" | "General";
    thumbnail: IImage;
    small: IImage;
    medium: IImage;
    large: IImage;
}

export interface IImage {
    width: number;
    height: number;
    url: string;
}

export interface IRating {
    points: number;
    reviews: number;
}
