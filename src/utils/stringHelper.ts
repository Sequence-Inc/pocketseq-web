import Link from "next/link";
import { IAddress, ISpaceType, ISpacePricePlan } from "../types/timebookTypes";
import { PriceFormatter } from "./priceFormatter";

export const FormatShortAddress = (address: IAddress): string => {
    if (!address) {
        return null;
    }
    return `${address?.prefecture?.name}${address?.city}`;
};

type TPriceMode = "HOURLY" | "DAILY";
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

const FormatPriceString = (
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
