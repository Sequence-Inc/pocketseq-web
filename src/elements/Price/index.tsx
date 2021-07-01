import React from "react";
import { PriceFormatter } from "src/utils";

export interface PriceProps {
    amount: number;
    amountSuffix?: string;
    frequency?: string;
    amountStyle?: string;
    frequencyStyle?: string;
}

const Price = ({
    amount,
    amountSuffix,
    frequency,
    amountStyle,
    frequencyStyle,
}: PriceProps) => {
    return (
        <div
            className={`text-700 text-xl font-medium ${
                amountStyle && amountStyle
            }`}
        >
            {PriceFormatter(amount)}
            {amountSuffix}
            <span
                className={`text-gray-400 text-xs font-normal ${
                    frequencyStyle && frequencyStyle
                }`}
            >
                {frequency}
            </span>
        </div>
    );
};

Price.defaultProps = {
    amount: 1234,
    amountSuffix: "〜",
    frequency: "/時間",
    amountStyle: "",
    frequencyStyle: "",
};

export default Price;
