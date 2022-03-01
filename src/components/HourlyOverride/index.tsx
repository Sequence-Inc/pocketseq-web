import { Hours, Stock } from "../DayOfWeekOverride";

const dataCategories = ["stock", "prices"];

const pricingCategories: PricingCategories[] = [
    "1時間",
    "5分",
    "10分",
    "15分",
    "30分",
    "45分",
];

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

export type Day = {
    workHours: Hours;
    breakHours: Hours;
};

const HourlyOverride = ({ day, data }: { day: Day; data: HoursProps }) => {
    const HoursPropsData = {};
    let hours: number[] = [];

    if (data.length > 0) {
        data.map((_, index) => {
            HoursPropsData[_.hour] = _.dailyData;
            hours.push(_.hour);
        });
    }

    // for (let i = day.workHours.startTime; i <= day.workHours.endTime; i++) {
    //     hours.push(i);
    // }

    return (
        <>
            <div className="bg-white shadow p-4 rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                    {hours.map((hour, index) => {
                        return (
                            <HourView
                                key={index}
                                data={{
                                    hour,
                                    dailyData: HoursPropsData[hour],
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

const HourView = ({ data }: { data: Hour }) => {
    const { hour, dailyData } = data;
    return (
        <div className="flex w-full">
            <div className="bg-primary text-white text-sm text-bold px-4 py-4 w-16">
                {`${hour}時`}
            </div>
            <ul className="flex items-center justify-between w-full px-4 py-4 text-gray-600 text-sm bg-gray-100">
                {dataCategories.map((category, index) => {
                    console.log(category, index);
                    const categoryData = dailyData[category];
                    console.log(categoryData, category);
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
