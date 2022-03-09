import React, { useEffect, useState } from "react";
import { Button, Price } from "@element";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { HeartIcon, ShareIcon } from "@heroicons/react/solid";
import { ISpace, ISpacePricePlan } from "src/types/timebookTypes";
import { FormatPrice, GetTimeStamp, PriceFormatter } from "src/utils";

import { DatePicker } from "antd";
import { GET_PAYMENT_SOURCES } from "src/apollo/queries/user.queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import Link from "next/link";
import moment, { Moment } from "moment";
import { durationSuffix } from "../Space/PricingPlan";
import { runMain } from "module";

const options = {
    DAILY: Array.from({ length: 30 }).map((_, index) => index + 1),
    HOURLY: Array.from({ length: 24 }).map((_, index) => index + 1),
    MINUTES: [5, 10, 15, 30, 45],
};

export const FloatingPriceTwo = ({
    pricePlans,
    space,
}: {
    pricePlans: ISpacePricePlan[];
    space: ISpace;
}) => {
    const [start, setStart] = useState<Moment>(null);
    const [end, setEnd] = useState(null);

    const [duration, setDuration] = useState(options["DAILY"][0]);
    const [durationType, setDurationType] = useState("DAILY");
    const [durationOptions, setDurationOptions] = useState(options["DAILY"]);

    const [checkInTime, setCheckInTime] = useState<Moment>();
    const [showCheckInTime, setShowCheckInTime] = useState(false);

    const [subtotal, setSubtotal] = useState(null);
    const [hours, setHours] = useState(null);

    useEffect(() => {
        if (start !== null && end !== null) {
            // setHours(hoursDifference());
            setSubtotal(priceCalculation());
        }
    }, [start, end]);

    useEffect(() => {
        if (durationType === "HOURLY" || durationType === "MINUTES") {
            setShowCheckInTime(true);
        } else {
            setShowCheckInTime(false);
        }
    });

    useEffect(() => {
        setDurationOptions(options[durationType]);
        if (durationType === "MINUTES") {
            if (
                duration !== 5 &&
                duration !== 10 &&
                duration !== 15 &&
                duration !== 30 &&
                duration !== 45
            ) {
                setDuration(5);
            }
        } else if (durationType === "HOURLY" && duration > 24) {
            setDuration(1);
        } else if (durationType === "DAILY" && duration > 30) {
            setDuration(1);
        }
    }, [durationType]);

    const price = FormatPrice("HOURLY", pricePlans, true, true);

    // const hoursDifference = () => {
    //     if (start === null || end === null || start > end) {
    //         return -1;
    //     }
    //     const diffTime = Math.abs(end - start);
    //     return Math.ceil(diffTime / (1000 * 60 * 60));
    // };

    const priceCalculation = () => {
        // Todo: Calculate based on price plans
        const usablePricePlans = pricePlans.filter(
            (_) => _.type === durationType
        );
        let remainingDuration = duration;
        let accumulatedPrice = [];
        while (remainingDuration > 0) {
            usablePricePlans.map((price) => {
                const { id, duration, title, amount, type } = price;
                while (remainingDuration >= duration) {
                    if (remainingDuration >= duration) {
                        accumulatedPrice.push({
                            id,
                            title,
                            duration,
                            amount,
                            type,
                        });
                        remainingDuration -= duration;
                    }
                }
            });
        }
        return accumulatedPrice;
    };

    const sumOfPrices = (plans) => {
        let sum = 0;
        Object.keys(plans).map((key) => {
            const {
                times,
                detail: { amount },
            } = plans[key];
            sum += amount * times;
        });
        return sum;
    };

    const initialPricingDetail = (accumulatedPrice) => {
        let content = <div>Not enough infomation!</div>;

        if (accumulatedPrice.length > 0) {
            let pricePlans = {};
            accumulatedPrice.map((plan) => {
                if (pricePlans[plan.id]) {
                    const updatedPlan = {
                        ...pricePlans[plan.id],
                        times: pricePlans[plan.id].times + 1,
                    };
                    pricePlans[plan.id] = updatedPlan;
                } else {
                    pricePlans[plan.id] = { times: 1, detail: plan };
                }
            });

            const totalAmount = sumOfPrices(pricePlans);
            const taxableAmount = totalAmount / 1.1;
            content = (
                <div className="text-gray-600 pt-4">
                    <div className="mt-1 text-base">
                        <span className="inline-block w-40 font-bold">
                            チェックイン日:
                        </span>
                        {durationType === "DAILY"
                            ? getStartDateTime().format("YYYY-MM-DD")
                            : getStartDateTime().format("YYYY-MM-DD HH:00")}
                    </div>

                    <div className="mt-2 text-base">
                        <span className="inline-block w-40 font-bold">
                            チェックアウト日:
                        </span>
                        {durationType === "DAILY"
                            ? getEndDateTime().format("YYYY-MM-DD")
                            : getEndDateTime().format("YYYY-MM-DD HH:00")}
                    </div>
                    <div className="mt-2 text-base">
                        <span className="inline-block w-40 font-bold">
                            期間:
                        </span>
                        {duration}
                        {durationSuffix(durationType)}
                    </div>
                    <div className="font-bold mt-4">プライスプラン</div>
                    <div className="space-y-2 mt-2">
                        {Object.keys(pricePlans).map((key) => {
                            const { times, detail } = pricePlans[key];
                            const { id, title, duration, amount, type } =
                                detail;
                            return (
                                <div
                                    key={id}
                                    className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg shadow-sm "
                                >
                                    <div className="flex-grow">
                                        <div className="font-bold">{title}</div>
                                        <div>
                                            {PriceFormatter(amount)}/{duration}
                                            {durationSuffix(type)}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {times}回
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* <div className="font-bold  mt-3">Calculated price</div> */}
                    <div className="space-y-2 mt-5 text-base">
                        <div className="text-right">
                            <span className="inline-block w-12">小計:</span>
                            <span className="inline-block font-bold w-20">
                                {PriceFormatter(taxableAmount)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="inline-block w-12">税金:</span>
                            <span className="inline-block font-bold w-20">
                                {PriceFormatter(totalAmount - taxableAmount)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="inline-block w-12">会計:</span>
                            <span className="inline-block font-bold w-20">
                                {PriceFormatter(totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return content;
    };

    const getStartDateTime = () => {
        const startDay = moment(start).format("YYYY-MM-DD");
        if (durationType !== "DAILY") {
            const startTime = moment(checkInTime).format("HH:00");
            return moment(
                startDay + " " + startTime,
                "YYYY-MM-DD HH:00"
            ).startOf("hour");
        } else {
            return moment(startDay, "YYYY-MM-DD").startOf("day");
        }
    };

    const getEndDateTime = () => {
        const startDateTime = getStartDateTime();
        if (durationType === "DAILY") {
            return startDateTime.add(duration, "d");
        } else if (durationType === "HOURLY") {
            return startDateTime.add(duration, "hour");
        } else if (durationType === "MINUTES") {
            return startDateTime.add(duration, "m");
        }
    };

    const timeDifference = () => {
        const startDateTime = getStartDateTime();
        const endDateTime = getEndDateTime();
        const difference = moment.duration(
            endDateTime.diff(startDateTime),
            "milliseconds"
        );
        if (durationType === "DAILY") {
            return difference.asDays();
        } else if (durationType === "HOURLY") {
            return difference.asHours();
        } else if (durationType === "MINUTES") {
            return difference.asMinutes();
        }
        return difference;
    };

    const fixDateFormat = (date: Moment) => {
        return moment(date, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:00");
    };

    const params = `?spaceId=${
        space?.id
    }&start=${getStartDateTime().unix()}&end=${getEndDateTime().unix()}&duration=${timeDifference()}&durationType=${durationType}&price=${price}&amount=${priceCalculation()}&spaceName=${
        space.name
    }&address=${space.address.prefecture.name}${space.address.city}${
        space.address.addressLine1
    }${space.address.addressLine2}`;

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const okayToBook = () => {
        if (durationType !== "DAILY") {
            return (checkInTime && start) || false;
        } else {
            return start || false;
        }
    };

    return (
        <div className="w-full md:sticky lg:w-96 md:top-20">
            <div className="relative p-5 space-y-4 border border-gray-200 rounded-lg">
                {/* price row */}
                <div className="flex justify-between">
                    <Price amount={price} />
                    {/* <p className="text-sm text-gray-600">¥ 10,392/日</p> */}
                </div>
                {/* date and time row */}
                <div className="">
                    <p className="mb-2 text-sm font-bold text-gray-500">
                        チェックイン
                    </p>
                    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <DatePicker
                            onChange={(date) => setStart(date)}
                            // placeholderText="日時を追加"
                            disabledDate={disabledDate}
                            bordered={false}
                            className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md shadow-sm hover:cursor-pointer"
                        />
                    </div>
                </div>
                <div>
                    <p className="mb-2 text-sm font-bold text-gray-500">期間</p>
                    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <select
                            className="text-sm border-0 outline-none"
                            value={duration}
                            onChange={(event) =>
                                setDuration(parseInt(event.target.value))
                            }
                        >
                            {durationOptions.map((_) => {
                                return (
                                    <option key={_} value={_}>
                                        {_}
                                    </option>
                                );
                            })}
                        </select>
                        <select
                            className="text-sm border-0 outline-none"
                            value={durationType}
                            onChange={(event) =>
                                setDurationType(event.target.value)
                            }
                        >
                            <option value="DAILY">日</option>
                            <option
                                selected={
                                    durationType === "HOURLY" ? true : false
                                }
                                value="HOURLY"
                            >
                                時間
                            </option>
                            <option
                                selected={
                                    durationType === "MINUTES" ? true : false
                                }
                                value="MINUTES"
                            >
                                分
                            </option>
                        </select>
                    </div>
                </div>
                {showCheckInTime && (
                    <div>
                        <p className="mb-2 text-sm font-bold text-gray-500">
                            チェックイン時間
                        </p>
                        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <DatePicker
                                format="HH:00"
                                onChange={(date) =>
                                    setCheckInTime(date.startOf("hour"))
                                }
                                value={checkInTime}
                                bordered={false}
                                picker="time"
                                className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md shadow-sm hover:cursor-pointer"
                            />
                        </div>
                    </div>
                )}
                {okayToBook() && initialPricingDetail(priceCalculation())}
                {/* button row */}
                <Button variant="primary" disabled={!okayToBook()}>
                    予約可能状況を確認する
                </Button>
                {/* policy row */}
                <div className="flex items-center justify-center space-x-1.5">
                    <p className="text-gray-600">48時間キャンセル無料</p>
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                </div>
            </div>
            <div className="flex my-4 space-x-2">
                <Button>
                    <HeartIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                    <span>保存</span>
                </Button>
                <Button>
                    <ShareIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                    <span>シェア</span>
                </Button>
            </div>
        </div>
    );
};
