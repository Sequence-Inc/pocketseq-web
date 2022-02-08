// import { useState, useEffect } from "react";

const daysOfWeek: DaysOfWeek[] = ["日", "月", "火", "水", "木", "金", "土"];

const dataCategories = ["workHours", "breakHours", "stock", "prices"];

const pricingCategories: PricingCategories[] = [
    "1日",
    "1時間",
    "5分",
    "10分",
    "15分",
    "30分",
    "45分",
];

type Hours = {
    startTime: number;
    endTime: number;
};

type Stock = number;

type PricingCategories =
    | "1日"
    | "1時間"
    | "5分"
    | "10分"
    | "15分"
    | "30分"
    | "45分";

type Price = {
    pricingCategory: PricingCategories;
    price: number;
};

type DaysOfWeek = "日" | "月" | "火" | "水" | "木" | "金" | "土";

export type Day = {
    day: DaysOfWeek;
    dailyData: {
        workHours: Hours;
        breakHours: Hours;
        stock: Stock;
        prices: Price[];
    };
};

export type DaysOfWeekProps = Day[];

const DaysOfWeekOverride = ({ data }: { data: DaysOfWeekProps }) => {
    const dayViewPropsData = {};
    data.map((_) => {
        dayViewPropsData[_.day] = _.dailyData;
    });
    console.log(dayViewPropsData);
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
                                    dailyData: dayViewPropsData[day],
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default DaysOfWeekOverride;

const DayView = ({ data }: { data: Day }) => {
    const { day, dailyData } = data;
    return (
        <div className="flex w-full">
            <div className="bg-primary text-white text-sm text-bold px-4 py-4">
                {day}
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

type HoursRenderProps = Hours & {
    styles?: string;
};

const HoursRender = ({ data }: { data: HoursRenderProps }) => {
    const { startTime, endTime, styles } = data;
    let compStyles = styles || "";
    return (
        <>
            <span className={`${compStyles}`}>
                {renderHours(startTime)}時〜{renderHours(endTime)}時
            </span>
        </>
    );
};

export const renderHours = (hour: number) => {
    const format = (number) => {
        return number < 10 ? `0${number}` : `${number}`;
    };
    // check if hour has minutes;
    if (hour % 1 > 0) {
        let minutes = format(Math.ceil((hour % 1) * 60));
        return `${format(Math.floor(hour / 1))}:${minutes}`;
    } else {
        return `${format(Math.floor(hour / 1))}:00`;
    }
};
