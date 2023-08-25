import Link from "next/link";
import {
    IAddress,
    ISpaceType,
    ISpacePricePlan,
    IPhoto,
    TSpacePrice,
} from "../types/timebookTypes";
import { PriceFormatter } from "./priceFormatter";
import { Moment } from "moment";
import moment from "moment";

export const FormatShortAddress = (address: IAddress): string => {
    if (!address) {
        return null;
    }
    return `${address?.prefecture?.name}${address?.city}`;
};

type TPriceMode = Omit<TSpacePrice, "MINUTES">;
export const FormatPrice = (
    mode: TPriceMode = "HOURLY",
    prices: ISpacePricePlan[],
    returnNumber: boolean = false,
    minimum: boolean = true
): any => {
    if (prices.length === 0) {
        return null;
    }

    const list: ISpacePricePlan[] = prices.filter(
        (pricePlan) => pricePlan.type === mode
    );

    if (list.length > 0 && minimum) {
        const minimumPrice: ISpacePricePlan = list.reduce(
            (previous, current) => {
                if (current.duration < previous.duration) {
                    return current;
                } else {
                    return previous;
                }
            }
        );
        return FormatPriceString(minimumPrice, returnNumber);
    }
    return list.map((pricePlan) => FormatPriceString(pricePlan, returnNumber));
};

export const FormatPriceString = (
    pricePlan: ISpacePricePlan,
    returnNumber: boolean = false
): string | number => {
    if (pricePlan) {
        if (returnNumber) {
            return pricePlan.amount;
        } else {
            return `${PriceFormatter(pricePlan.amount)}/${
                pricePlan.duration > 1 ? pricePlan.duration : ""
            }${pricePlan.type === "HOURLY" ? "時" : "日"}`;
        }
    }
    return null;
};

export const GetTimeStamp = (date: Moment): number => {
    return date.startOf("day").unix();
};

export const DateFromTimeStamp = (
    date: number,
    type: "full-date" | "long-date" | "date" | "date-time" | "time"
): string => {
    const newDate = new Date(date * 1000);
    let options = null;

    if (type === "full-date") {
        options = {
            years: "long" as "long",
            month: "long" as "long",
            day: "2-digit" as "2-digit",
            hour: "2-digit" as "2-digit",
            minute: "2-digit" as "2-digit",
        };
    } else if (type === "long-date") {
        options = {
            years: "long" as "long",
            month: "long" as "long",
            day: "2-digit" as "2-digit",
        };
    } else if (type === "date") {
        options = {
            month: "long" as "long",
            day: "2-digit" as "2-digit",
            timeZone: "Asia/Tokyo",
        };
    } else if (type === "date-time") {
        options = {
            month: "long" as "long",
            day: "2-digit" as "2-digit",
            hour: "2-digit" as "2-digit",
            minute: "2-digit" as "2-digit",
        };
    } else if (type === "time") {
        options = {
            hour: "2-digit" as "2-digit",
            minute: "2-digit" as "2-digit",
        };
        return newDate.toLocaleTimeString("ja-JP", options);
    }
    return newDate.toLocaleDateString("ja-JP", options);
};

export function publicImage(
    photo: IPhoto,
    size: "thumbnail" | "small" | "medium" | "large"
) {
    const { id } = photo;

    return `https://timebook-public-media.s3.ap-northeast-1.amazonaws.com/${size}/${id}.jpeg`;
}

export const getTimeFromFloat = (time) => {
    return {
        hour: parseInt(time.toString()),
        minute: ((time % 1) * 60).toString(),
    };
};

export const getMinuteInFloat = (minute) => {
    return ((parseInt(minute) / 60) * 100) / 100;
};

export const toBase64 = (data: string): string => {
    return Buffer.from(data).toString("base64");
};

export const fromBase64 = (data: string): string => {
    return Buffer.from(data, "base64").toString();
};

export const reservationStatusJapanify = (key: string): string => {
    const map = {
        RESERVED: "予約済み",
        CANCELED: "キャンセル",
        HOLD: "ホールド",
        PENDING: "ペンディング",
        FAILED: "FAILED",
        DISAPPROVED: "DISAPPROVED",
    };
    if (map[key]) {
        return map[key];
    }
    return key;
};

export const hoursAsCancelPolicyDuration = (hours: number): string => {
    const duration = moment.duration(hours, "hours");
    if (hours < 72) {
        return `${duration.asHours()}時間前`;
    }
    const days = duration.asDays();
    const remainingHours = days % 1;
    if (remainingHours === 0) {
        return `${Math.floor(days)}日前`;
    }
    return `${Math.floor(days)}日${Math.floor(
        moment.duration(remainingHours, "day").asHours()
    )}時間前`;
};
