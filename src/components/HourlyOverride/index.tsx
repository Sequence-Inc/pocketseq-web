// import { useState, useEffect } from "react";
import { Day } from "../DayOfWeekOverride";

const dataCategories = ["stock", "prices"];

const pricingCategories: PricingCategories[] = [
    "1時間",
    "5分",
    "10分",
    "15分",
    "30分",
    "45分",
];

type Stock = number;

type PricingCategories = "1時間" | "5分" | "10分" | "15分" | "30分" | "45分";

type Price = {
    pricingCategory: PricingCategories;
    price: number;
};

type Hour = {
    hour: number;
    dailyData: {
        stock: Stock;
        prices: Price[];
    };
};

export type HoursProps = Hour[];

const HourlyOverride = ({ day, data }: { day: Day; data: HoursProps }) => {
    const HoursPropsData = {};

    // get workHours & breakHours for the day
    const { workHours, breakHours } = day.dailyData;

    if (data.length > 0) {
        data.map((_, index) => {
            HoursPropsData[_.day] = _.dailyData;
        });
    }
    console.log(HoursPropsData);
    return (
        <>
            <div className="bg-white shadow p-4 rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                    {daysOfWeek.map((day, index) => {
                        return (
                            <DayView
                                key={index}
                                data={{
                                    day,
                                    dailyData: HoursPropsData[day],
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default HourlyOverride;

const DayView = ({ data }: { data: Hour }) => {
    const { hour, dailyData } = data;
    return (
        <div className="flex w-full">
            <div className="bg-primary text-white text-sm text-bold px-4 py-4">
                {hour}時
            </div>
            <ul className="flex items-center justify-between w-full px-4 py-4 text-gray-600 text-sm bg-gray-100">
                {dataCategories.map((category, index) => {
                    const categoryData = dailyData[category];
                    if (!categoryData) {
                        return null;
                    }

                    if (category === "prices") {
                        const prices = {};
                        dailyData.prices.map((_) => {
                            prices[_.pricingCategory] = _.price;
                        });

                        return pricingCategories.map(
                            (pricingCategory, index) => {
                                let price = prices[pricingCategory];
                                if (!price) {
                                    price = "-";
                                } else {
                                    price = `￥${price}`;
                                }
                                return (
                                    <li key={`price-${index}`}>
                                        {pricingCategory}: {price}
                                    </li>
                                );
                            }
                        );
                    } else if (category === "workHours") {
                        return (
                            <li key={category}>
                                <HoursRender data={dailyData[category]} />
                            </li>
                        );
                    } else if (category === "breakHours") {
                        return (
                            <li key={category}>
                                <span className="text-xs text-gray-500">
                                    (休憩{" "}
                                    <HoursRender data={dailyData[category]} />)
                                </span>
                            </li>
                        );
                    } else {
                        return (
                            <li key={`category-${index}`}>
                                {category}: ￥{categoryData}
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
};
