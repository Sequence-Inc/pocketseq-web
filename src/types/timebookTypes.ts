import { Dispatch, SetStateAction } from "react";

interface IHOST {
    accountId: string;
    name: string;
    updatedAt: Date;
    profilePhoto: IPhoto;
}

export interface ISpace {
    id: string | number;
    description?: string;
    maximumCapacity: number;
    name: string;
    nearestStations?: INearestStation[];
    numberOfSeats: number;
    pricePlans: ISpacePricePlan[];
    spacePricePlans: ISpacePricePlan[];
    spaceSize: number;
    spaceTypes: ISpaceType[];
    address: IAddress;
    photos?: IPhoto[];
    host?: IHOST;
    thumbnail?: string;
    _geoloc?: {
        lat: number;
        lng: number;
    };
}

export interface IAddress {
    id?: string | number;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    latitude: number;
    longitude: number;
    postalCode?: string;
    prefecture: IPrefecture;
}
export interface IPrefecture {
    id: string | number;
    name: string;
}
export interface INearestStation {
    station: IStation;
    time: number;
    via?: string;
    accessType?: string;
}

export interface IStation {
    id: string | number;
    stationName: string;
}

export type TSpacePrice = "HOURLY" | "DAILY";

export interface ISpacePricePlan {
    id?: string | number;
    amount: number;
    cooldownTime?: number;
    duration: number;
    lastMinuteDiscount?: number;
    maintenanceFee?: number;
    title?: string;
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

export interface ILocationMarker {
    id: string | number;
    coords: {
        lat: number;
        lng: number;
    };
    name: string;
    price: number;
    rating: IRating;
    photo: IPhoto;
}

export interface IPaymentMethod {
    id: string | number;
    token: string;
    type: string;
    expMonth: number;
    expYear: number;
    last4: number;
    brand: string;
    country: string;
    customer: string | number;
}

export interface IColumns {
    Header: string;
    accessor: string;
    className?: string;
    childClassName?: string;
    Cell?: any;
}

export type TTableKey = {
    name: string | undefined;
    key: string;
};

export type TStationTypes = {
    stationId: string;
    accessType: string;
    time: number;
};

export type TImageUploadResult = {
    type: string;
    url: string;
    mime: string;
    key: string;
};

export type TAddHotelProps = {
    setActiveTab: Dispatch<SetStateAction<number>>;
    activeTab: number;
    hotelId?: string;
};

export type TImage = {
    width: number;
    height: number;
    url: string;
};

export type Photo = {
    id: string;
    mime: string;
    type: string;
    thumbnail?: TImage;
    small?: TImage;
    medium?: TImage;
    large?: TImage;
};

export type THotelRoom = {
    id: string;
    name: string;
    description: string;
    paymentTerm: string;
    maxCapacityAdult: number;
    maxCapacityChild: number;
    stock: number;
    hotelId: number;
    photos?: Photo[];
    createdAt: Date;
    updatedAt: Date;
};

export type THotelPriceScheme = {
    id?: string;
    name?: string;
    roomCharge?: string;
    oneAdultCharge?: string;
    twoAdultCharge?: string;
    threeAdultCharge?: string;
    fourAdultCharge?: string;
    fiveAdultCharge?: string;
    sixAdultCharge?: string;
    sevenAdultCharge?: string;
    eightAdultCharge?: string;
    nineAdultCharge?: string;
    tenAdultCharge?: string;
    oneChildCharge?: string;
    twoChildCharge?: string;
    threeChildCharge?: string;
    fourChildCharge?: string;
    fiveChildCharge?: string;
    sixChildCharge?: string;
    sevenChildCharge?: string;
    eightChildCharge?: string;
    nineChildCharge?: string;
    tenChildCharge?: string;
    hotelId?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
