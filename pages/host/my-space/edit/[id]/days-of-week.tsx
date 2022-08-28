import React, { useEffect, useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import { Container, Select } from "@element";
import { useRouter } from "next/router";
import Head from "next/head";

import useTranslation from "next-translate/useTranslation";
import DaysOfWeekOverride, {
    daysOfWeek,
    DaysOfWeekProps,
} from "src/components/DayOfWeekOverride";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import useDeepCompareEffect from "use-deep-compare-effect";
import { getMinuteInFloat, getTimeFromFloat } from "src/utils";

const testData: DaysOfWeekProps = [
    {
        day: "日",
        dailyData: {
            workHours: { startTime: 9.25, endTime: 18 },
            breakHours: { startTime: 13.5, endTime: 14.5 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        day: "月",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        day: "火",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        day: "水",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        day: "木",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        day: "金",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        day: "土",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
];

const DayOfWeekOverride = ({ userSession }) => {
    const router = useRouter();

    const { t } = useTranslation("adminhost");

    const { id } = router.query;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Day of week override</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                <h2 className="text-2xl mb-4 text-primary font-semibold">
                    Days of week override
                </h2>
                {/* <div className="space-y-5">
                    <DaysOfWeekOverride data={testData} />
                    <HolidayManager
                        defaultValue={false}
                        onSave={(value) => console.log(value)}
                    />
                    <BusinessHourManager
                        defaultValue={{ startTime: 9, endTime: 18 }}
                        onSave={(value) => {
                            console.log(value);
                            return;
                        }}
                    />
                    <StockManager
                        defaultValue={5}
                        onSave={(value) => {
                            console.log(value);
                        }}
                    />
                </div> */}
            </Container>
        </HostLayout>
    );
};

export default DayOfWeekOverride;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        return {
            props: {
                userSession,
            },
        };
    }
};

export type BusinessHour = {
    openingHr: number;
    closingHr: number;
    breakFromHr?: number;
    breakToHr?: number;
};

export const BusinessHourManager = ({
    defaultValue,
    onSave,
}: {
    defaultValue: BusinessHour;
    onSave: any;
}) => {
    const { openingHr, closingHr, breakFromHr, breakToHr } = defaultValue;

    const isBreakAvailable = breakFromHr && breakToHr ? true : false;
    const openingTime = getTimeFromFloat(openingHr);
    const closingTime = getTimeFromFloat(closingHr);
    const breakStartTime = getTimeFromFloat(
        isBreakAvailable ? breakFromHr : 13
    );
    const breakEndTime = getTimeFromFloat(isBreakAvailable ? breakToHr : 14);

    const [hour, setHour] = useState(openingTime.hour);
    const [minute, setMinute] = useState(openingTime.minute);
    const [endHour, setEndHour] = useState(closingTime.hour);
    const [endMinute, setEndMinute] = useState(closingTime.minute);
    const [breakAvailable, setBreakAvailable] = useState(isBreakAvailable);
    const [breakHour, setBreakHour] = useState(breakStartTime.hour);
    const [breakMinute, setBreakMinute] = useState(breakStartTime.minute);
    const [breakEndHour, setBreakEndHour] = useState(breakEndTime.hour);
    const [breakEndMinute, setBreakEndMinute] = useState(breakEndTime.minute);

    useEffect(() => {
        let businessHours = {
            openingHr: hour + getMinuteInFloat(minute),
            closingHr: endHour + getMinuteInFloat(endMinute),
        };

        if (breakAvailable) {
            businessHours["breakFromHr"] =
                breakHour + getMinuteInFloat(breakMinute);
            businessHours["breakToHr"] =
                breakEndHour + getMinuteInFloat(breakEndMinute);
        }
        if (!breakAvailable) {
            businessHours["breakFromHr"] = null;
            businessHours["breakToHr"] = null;
        }
        onSave(businessHours);
    }, [
        hour,
        minute,
        endHour,
        endMinute,
        breakAvailable,
        breakHour,
        breakMinute,
        breakEndHour,
        breakEndMinute,
    ]);

    useDeepCompareEffect(() => {
        const { openingHr, closingHr, breakFromHr, breakToHr } = defaultValue;
        const isBreakAvailable = breakFromHr && breakToHr ? true : false;
        const openingTime = getTimeFromFloat(openingHr);
        const closingTime = getTimeFromFloat(closingHr);
        const breakStartTime = getTimeFromFloat(
            isBreakAvailable ? breakFromHr : 13
        );
        const breakEndTime = getTimeFromFloat(
            isBreakAvailable ? breakToHr : 14
        );

        setHour(openingTime.hour);
        setMinute(openingTime.minute);
        setEndHour(closingTime.hour);
        setEndMinute(closingTime.minute);
        setBreakAvailable(isBreakAvailable);
        setBreakHour(breakStartTime.hour);
        setBreakMinute(breakStartTime.minute);
        setBreakEndHour(breakEndTime.hour);
        setBreakEndMinute(breakEndTime.minute);
    }, [defaultValue]);

    return (
        <div>
            <FormCard title="営業時間">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-20">
                            <Select
                                options={[
                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                                    24, 25, 26, 27, 28,
                                ]}
                                value={hour}
                                onChange={(value) => {
                                    setHour(value as number);
                                }}
                            />
                        </div>
                        <span>:</span>
                        <div className="w-20">
                            <Select
                                options={["00", "15", "30", "45"]}
                                value={minute}
                                onChange={(value) => {
                                    setMinute(value as string);
                                }}
                            />
                        </div>
                        <span>から</span>
                        <div className="w-20">
                            <Select
                                options={[
                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                                    24, 25, 26, 27, 28,
                                ]}
                                value={endHour}
                                onChange={(value) => {
                                    setEndHour(value as number);
                                }}
                            />
                        </div>
                        <span>:</span>
                        <div className="w-20">
                            <Select
                                options={["00", "15", "30", "45"]}
                                value={endMinute}
                                onChange={(value) => {
                                    setEndMinute(value as string);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </FormCard>
            <FormCard title="休憩 (有・無)">
                <div className="flex items-center space-x-2 h-10">
                    <input
                        type="checkbox"
                        checked={breakAvailable ? true : false}
                        onChange={() => {
                            setBreakAvailable(!breakAvailable);
                        }}
                    />
                    {breakAvailable && (
                        <>
                            <div className="flex items-center space-x-2 pl-5">
                                <div className="w-20">
                                    <Select
                                        options={[
                                            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                            11, 12, 13, 14, 15, 16, 17, 18, 19,
                                            20, 21, 22, 23, 24, 25, 26, 27, 28,
                                        ]}
                                        value={breakHour}
                                        onChange={(value) => {
                                            setBreakHour(value as number);
                                        }}
                                    />
                                </div>
                                <span>:</span>
                                <div className="w-20">
                                    <Select
                                        options={["00", "15", "30", "45"]}
                                        value={breakMinute}
                                        onChange={(value) => {
                                            setBreakMinute(value as string);
                                        }}
                                    />
                                </div>
                                <span>から</span>
                                <div className="w-20">
                                    <Select
                                        options={[
                                            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                            11, 12, 13, 14, 15, 16, 17, 18, 19,
                                            20, 21, 22, 23, 24, 25, 26, 27, 28,
                                        ]}
                                        value={breakEndHour}
                                        onChange={(value) => {
                                            setBreakEndHour(value as number);
                                        }}
                                    />
                                </div>
                                <span>:</span>
                                <div className="w-20">
                                    <Select
                                        options={["00", "15", "30", "45"]}
                                        value={breakEndMinute}
                                        onChange={(value) => {
                                            setBreakEndMinute(value as string);
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </FormCard>
        </div>
    );
};

export const PricingPlanManager = ({ defaultValue, onSave }) => {
    const {
        dailyAmount,
        hourlyAmount,
        fiveMinuteAmount,
        tenMinuteAmount,
        fifteenMinuteAmount,
        thirtyMinuteAmount,
        fortyFiveMinuteAmount,
    } = defaultValue;

    const getActiveStatus = (price) => {
        return price > 0 ? true : false;
    };

    const [dailyActive, setDailyActive] = useState(
        getActiveStatus(dailyAmount)
    );

    const [hourlyActive, setHourlyActive] = useState(
        getActiveStatus(hourlyAmount)
    );
    const [fiveMinutesActive, setFiveMinutesActive] = useState(
        getActiveStatus(fiveMinuteAmount)
    );
    const [tenMinutesActive, setTenMinutesActive] = useState(
        getActiveStatus(tenMinuteAmount)
    );
    const [fifteenMinutesActive, setFifteenMinutesActive] = useState(
        getActiveStatus(fifteenMinuteAmount)
    );
    const [thirtyMinutesActive, setThirtyMinutesActive] = useState(
        getActiveStatus(thirtyMinuteAmount)
    );
    const [fortyFiveMinutesActive, setFortyFiveMinutesActive] = useState(
        getActiveStatus(fortyFiveMinuteAmount)
    );

    const [dailyPrice, setDailyPrice] = useState(dailyAmount);
    const [hourlyPrice, setHourlyPrice] = useState(hourlyAmount);
    const [fiveMinutesPrice, setFiveMinutesPrice] = useState(fiveMinuteAmount);
    const [tenMinutesPrice, setTenMinutesPrice] = useState(tenMinuteAmount);
    const [fifteenMinutesPrice, setFifteenMinutesPrice] =
        useState(fifteenMinuteAmount);
    const [thirtyMinutesPrice, setThirtyMinutesPrice] =
        useState(thirtyMinuteAmount);
    const [fortyFiveMinutesPrice, setFortyFiveMinutesPrice] = useState(
        fortyFiveMinuteAmount
    );

    useEffect(() => {
        onSave({
            dailyAmount: dailyActive ? dailyPrice : 0,
            hourlyAmount: hourlyActive ? hourlyPrice : 0,
            fiveMinuteAmount: fiveMinutesActive ? fiveMinutesPrice : 0,
            tenMinuteAmount: tenMinutesActive ? tenMinutesPrice : 0,
            fifteenMinuteAmount: fifteenMinutesActive ? fifteenMinutesPrice : 0,
            thirtyMinuteAmount: thirtyMinutesActive ? thirtyMinutesPrice : 0,
            fortyFiveMinuteAmount: fortyFiveMinutesActive
                ? fortyFiveMinutesPrice
                : 0,
        });
    }, [
        dailyPrice,
        hourlyPrice,
        fiveMinutesPrice,
        tenMinutesPrice,
        fifteenMinutesPrice,
        thirtyMinutesPrice,
        fortyFiveMinutesPrice,
        dailyActive,
        hourlyActive,
        fiveMinutesActive,
        tenMinutesActive,
        fifteenMinutesActive,
        thirtyMinutesActive,
        fortyFiveMinutesActive,
    ]);

    useDeepCompareEffect(() => {
        const {
            dailyAmount,
            hourlyAmount,
            fiveMinuteAmount,
            tenMinuteAmount,
            fifteenMinuteAmount,
            thirtyMinuteAmount,
            fortyFiveMinuteAmount,
        } = defaultValue;
        setDailyActive(getActiveStatus(dailyAmount));
        setHourlyActive(getActiveStatus(hourlyAmount));
        setFiveMinutesActive(getActiveStatus(fiveMinuteAmount));
        setTenMinutesActive(getActiveStatus(tenMinuteAmount));
        setFifteenMinutesActive(getActiveStatus(fifteenMinuteAmount));
        setThirtyMinutesActive(getActiveStatus(thirtyMinuteAmount));
        setFortyFiveMinutesActive(getActiveStatus(fortyFiveMinuteAmount));

        setDailyPrice(dailyAmount);
        setHourlyPrice(hourlyAmount);
        setFiveMinutesPrice(fiveMinuteAmount);
        setTenMinutesPrice(tenMinuteAmount);
        setFifteenMinutesPrice(fifteenMinuteAmount);
        setThirtyMinutesPrice(thirtyMinuteAmount);
        setFortyFiveMinutesPrice(fortyFiveMinuteAmount);
    }, [defaultValue]);

    return (
        <FormCard title="料金設定（税込）">
            <div className="flex flex-col">
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg shadow">
                    <div className="flex items-center space-x-2 py-3 px-5 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={dailyActive ? true : false}
                            onChange={() => {
                                setDailyActive(!dailyActive);
                            }}
                            id="dailyActive"
                        />
                        <label
                            htmlFor="dailyActive"
                            className="inline-block w-20 text-gray-600"
                        >
                            1日
                        </label>
                        <input
                            type="number"
                            value={dailyPrice}
                            onChange={(e) => {
                                setDailyPrice(parseInt(e.target.value, 10));
                            }}
                            min={1}
                            disabled={!dailyActive}
                            className={`${
                                dailyActive ? "opacity-100" : "opacity-30"
                            } w-28 appearance-none block px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary`}
                        />
                        <span className="text-gray-500">円</span>
                    </div>
                    <div className="flex items-center space-x-2 py-3 px-5 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={hourlyActive ? true : false}
                            onChange={() => {
                                setHourlyActive(!hourlyActive);
                            }}
                            id="hourlyActive"
                        />
                        <label
                            htmlFor="hourlyActive"
                            className="inline-block w-20 text-gray-600"
                        >
                            1時間
                        </label>
                        <input
                            type="number"
                            value={hourlyPrice}
                            min={1}
                            onChange={(e) => {
                                setHourlyPrice(parseInt(e.target.value, 10));
                            }}
                            disabled={!hourlyActive}
                            className={`${
                                hourlyActive ? "opacity-100" : "opacity-30"
                            } w-28 appearance-none block px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary`}
                        />
                        <span className="text-gray-500">円</span>
                    </div>
                    <div className="space-x-2 flex items-center py-3 px-5 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={fiveMinutesActive}
                            onChange={() => {
                                setFiveMinutesActive(!fiveMinutesActive);
                            }}
                            id="fiveMinutesActive"
                        />
                        <label
                            htmlFor="fiveMinutesActive"
                            className="inline-block w-20 text-gray-600"
                        >
                            5分
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={fiveMinutesPrice}
                            onChange={(e) => {
                                setFiveMinutesPrice(
                                    parseInt(e.target.value, 10)
                                );
                            }}
                            disabled={!fiveMinutesActive}
                            className={`${
                                fiveMinutesActive ? "opacity-100" : "opacity-30"
                            } w-28 appearance-none block px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary`}
                        />
                        <span className="text-gray-500">円</span>
                    </div>

                    <div className="space-x-2 flex items-center py-3 px-5 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={tenMinutesActive}
                            onChange={() => {
                                setTenMinutesActive(!tenMinutesActive);
                            }}
                            id="tenMinutesActive"
                        />
                        <label
                            htmlFor="tenMinutesActive"
                            className="inline-block w-20 text-gray-600"
                        >
                            10分
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={tenMinutesPrice}
                            onChange={(e) => {
                                setTenMinutesPrice(
                                    parseInt(e.target.value, 10)
                                );
                            }}
                            disabled={!tenMinutesActive}
                            className={`${
                                tenMinutesActive ? "opacity-100" : "opacity-30"
                            } w-28 appearance-none block px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary`}
                        />
                        <span className="text-gray-500">円</span>
                    </div>

                    <div className="space-x-2 flex items-center py-3 px-5 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={fifteenMinutesActive}
                            onChange={() => {
                                setFifteenMinutesActive(!fifteenMinutesActive);
                            }}
                            id="fifteenMinutesActive"
                        />
                        <label
                            htmlFor="fifteenMinutesActive"
                            className="inline-block w-20 text-gray-600"
                        >
                            15分
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={fifteenMinutesPrice}
                            onChange={(e) => {
                                setFifteenMinutesPrice(
                                    parseInt(e.target.value, 10)
                                );
                            }}
                            disabled={!fifteenMinutesActive}
                            className={`${
                                fifteenMinutesActive
                                    ? "opacity-100"
                                    : "opacity-30"
                            } w-28 appearance-none block px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary`}
                        />
                        <span className="text-gray-500">円</span>
                    </div>

                    <div className="space-x-2 flex items-center py-3 px-5 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={thirtyMinutesActive}
                            onChange={() => {
                                setThirtyMinutesActive(!thirtyMinutesActive);
                            }}
                            id="thirtyMinutesActive"
                        />
                        <label
                            htmlFor="thirtyMinutesActive"
                            className="inline-block w-20 text-gray-600"
                        >
                            30分
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={thirtyMinutesPrice}
                            onChange={(e) => {
                                setThirtyMinutesPrice(
                                    parseInt(e.target.value, 10)
                                );
                            }}
                            disabled={!thirtyMinutesActive}
                            className={`${
                                thirtyMinutesActive
                                    ? "opacity-100"
                                    : "opacity-30"
                            } w-28 appearance-none block px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary`}
                        />
                        <span className="text-gray-500">円</span>
                    </div>

                    <div className="space-x-2 flex items-center py-3 px-5 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={fortyFiveMinutesActive}
                            onChange={() => {
                                setFortyFiveMinutesActive(
                                    !fortyFiveMinutesActive
                                );
                            }}
                            id="fortyFiveMinutesActive"
                        />
                        <label
                            htmlFor="fortyFiveMinutesActive"
                            className="inline-block w-20 text-gray-600"
                        >
                            45分
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={fortyFiveMinutesPrice}
                            onChange={(e) => {
                                setFortyFiveMinutesPrice(
                                    parseInt(e.target.value, 10)
                                );
                            }}
                            disabled={!fortyFiveMinutesActive}
                            className={`${
                                fortyFiveMinutesActive
                                    ? "opacity-100"
                                    : "opacity-30"
                            } w-28 appearance-none block px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary`}
                        />
                        <span className="text-gray-500">円</span>
                    </div>
                </div>
            </div>
        </FormCard>
    );
};

export const StockManager = ({ defaultValue, onSave }) => {
    const [stock, setStock] = useState(defaultValue || 1);
    useEffect(() => {
        setStock(defaultValue);
    }, [defaultValue]);
    return (
        <FormCard title="在庫">
            <div className="flex items-center space-x-2">
                <div className="w-20">
                    <input
                        type="number"
                        min={1}
                        value={stock}
                        onChange={(e) => {
                            setStock(parseInt(e.target.value, 10));
                            onSave(parseInt(e.target.value, 10));
                        }}
                        className="appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
        </FormCard>
    );
};

export const HolidayManager = ({ defaultValue, onSave }) => {
    const [holiday, setHoliday] = useState(defaultValue || false);
    useEffect(() => {
        onSave(holiday);
    }, [holiday]);
    return (
        <FormCard title="休業設定">
            <input
                type="checkbox"
                checked={holiday ? true : false}
                onChange={() => {
                    setHoliday(!holiday);
                }}
            />
        </FormCard>
    );
};

export const BusinessDaysManager = ({ defaultValue, onSave, ...rest }) => {
    const [businessDays, setBusinessDays] = useState(defaultValue || []);
    const addOrRemove = (day) => {
        const indexOfItem = businessDays.indexOf(day);
        let newBusinessDays;
        if (indexOfItem === -1) {
            newBusinessDays = [...businessDays, day];
        } else {
            newBusinessDays = [
                ...businessDays.slice(0, indexOfItem),
                ...businessDays.slice(indexOfItem + 1),
            ];
        }
        setBusinessDays(newBusinessDays);
        onSave(newBusinessDays);
    };

    useDeepCompareEffect(() => {
        setBusinessDays(defaultValue);
    }, [defaultValue]);

    return (
        <FormCard title="営業日">
            <div className="flex items-center space-x-6">
                {daysOfWeek.map((day, index) => {
                    return (
                        <div
                            key={index}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={
                                    businessDays.indexOf(index) !== -1
                                        ? true
                                        : false
                                }
                                onChange={() => {
                                    addOrRemove(index);
                                }}
                            />
                            <span>{day}</span>
                        </div>
                    );
                })}
            </div>
        </FormCard>
    );
};

export const FormItem = ({ title, children }) => {
    return (
        <div className="flex items-center space-x-3">
            <div className="inline-block w-20">
                <div className="text-sm">{title}</div>
            </div>
            <div className="w-full">{children}</div>
        </div>
    );
};

export const FormCard = ({ title, children }) => {
    return (
        <div className="items-start flex-none px-4 py-2 sm:space-x-8 sm:flex sm:px-10">
            <label
                htmlFor="Map"
                className={
                    "block text-sm font-bold text-gray-700 sm:text-right w-60 pt-1"
                }
            >
                {title}
            </label>
            <div className="w-full rounded-md">{children}</div>
        </div>
    );
};
