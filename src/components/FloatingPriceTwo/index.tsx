import React, { useEffect, useState } from "react";
import { Button, Price } from "@element";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { HeartIcon, ShareIcon } from "@heroicons/react/solid";
import { ISpace, ISpacePricePlan } from "src/types/timebookTypes";

import { DatePicker } from "antd";
import Link from "next/link";
import moment, { Moment } from "moment";
import { durationSuffix } from "../Space/PricingPlan";
import { PriceFormatter } from "src/utils/priceFormatter";
import { FormatPrice, toBase64 } from "src/utils/stringHelper";
import { useLazyQuery } from "@apollo/client";
import { GET_PRICE_PLANS } from "src/apollo/queries/space.queries";

const options = {
    DAILY: Array.from({ length: 30 }).map((_, index) => index + 1),
    HOURLY: Array.from({ length: 24 }).map((_, index) => index + 1),
    MINUTES: [5, 10, 15, 30, 45],
};

type DurationType = "DAILY" | "HOURLY" | "MINUTES";

export const FloatingPriceTwo = ({
    pricePlans,
    space,
}: {
    pricePlans: ISpacePricePlan[];
    space: ISpace;
}) => {
    const [start, setStart] = useState<Moment>();

    const [duration, setDuration] = useState(options["DAILY"][0]);
    const [durationType, setDurationType] = useState<DurationType>("DAILY");
    const [durationOptions, setDurationOptions] = useState(options["DAILY"]);

    const [checkInTime, setCheckInTime] = useState<Moment>();
    const [showCheckInTime, setShowCheckInTime] = useState(false);

    const [startDateTime, setStartDateTime] = useState<Moment>();
    const [endDateTime, setEndDateTime] = useState<Moment>();

    const [applicablePricePlans, setApplicablePricePlans] = useState();
    const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(false);

    const [getApplicablePricePlans] = useLazyQuery(GET_PRICE_PLANS);

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

    useEffect(() => {
        if (start) {
            setStartDateTime(
                getStartDateTime(start, durationType, checkInTime)
            );
        }
    }, [start, durationType, checkInTime]);

    useEffect(() => {
        if (startDateTime) {
            const endDateTime = getEndDateTime(
                startDateTime,
                duration,
                durationType
            );
            setEndDateTime(endDateTime);
            const start =
                durationType === "DAILY"
                    ? startDateTime.startOf("day")
                    : startDateTime.startOf("hour");
            fetchPricePlans(start, endDateTime, duration, durationType);
        }
    }, [startDateTime, duration, durationType]);

    const fetchPricePlans = async (start, end, duration, type) => {
        if (type === "DAILY" || (type !== "DAILY" && end)) {
            setIsLoadingPrices(true);
            try {
                const { data: plans } = await getApplicablePricePlans({
                    variables: {
                        input: {
                            fromDateTime: start.unix() * 1000,
                            duration,
                            durationType,
                            spaceId: space.id,
                        },
                    },
                });
                setApplicablePricePlans(plans.getApplicablePricePlans);
            } catch (error) {
                alert(`Error! ${error}`);
            } finally {
                setIsLoadingPrices(false);
            }
        }
    };

    const price = FormatPrice("HOURLY", pricePlans, true, true);

    const initialPricingDetail = () => {
        let content = <div>Not enough infomation!</div>;

        if (isLoadingPrices) {
            content = (
                <div className="text-center text-gray-500 py-4">Loading...</div>
            );
            return content;
        }
        if (applicablePricePlans) {
            const {
                total,
                duration,
                durationType,
                applicablePricePlans: plans,
            } = applicablePricePlans;
            const taxableAmount = total / 1.1;

            const pricePlans = plans as any[];

            content = (
                <div className="text-gray-600 pt-4">
                    <div className="mt-1 text-base">
                        <span className="inline-block w-40 font-bold">
                            チェックイン:
                        </span>
                        {durationType === "DAILY"
                            ? startDateTime?.startOf("day").format("YYYY-MM-DD")
                            : startDateTime
                                  ?.startOf("hour")
                                  .format("YYYY-MM-DD HH:00")}
                    </div>

                    <div className="mt-2 text-base">
                        <span className="inline-block w-40 font-bold">
                            チェックアウト:
                        </span>
                        {durationType === "DAILY"
                            ? endDateTime?.startOf("day").format("YYYY-MM-DD")
                            : endDateTime
                                  ?.startOf("hour")
                                  .format("YYYY-MM-DD HH:00")}
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
                        {pricePlans.map((plan, index) => {
                            const {
                                title,
                                amount,
                                appliedTimes,
                                duration,
                                type,
                                isOverride,
                            } = plan;

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg shadow-sm "
                                >
                                    <div className="flex-grow">
                                        <div className="font-bold">
                                            {title}
                                            {isOverride && (
                                                <span className="text-xs italic text-gray-400 font-normal">
                                                    (Override price)
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-bold">
                                                {PriceFormatter(amount)}
                                            </span>
                                            /{duration}
                                            {durationSuffix(type)}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {appliedTimes}回
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
                                {PriceFormatter(total - taxableAmount)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="inline-block w-12">会計:</span>
                            <span className="inline-block font-bold w-20">
                                {PriceFormatter(total)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return content;
    };

    const params = toBase64(
        JSON.stringify({
            start: startDateTime,
            end: endDateTime,
            duration,
            type: durationType,
        })
    );
    const url = `?data=${params}`;

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
                                setDurationType(
                                    event.target.value as DurationType
                                )
                            }
                        >
                            <option value="DAILY">日</option>
                            <option value="HOURLY">時間</option>
                            <option value="MINUTES">分</option>
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
                {okayToBook() && initialPricingDetail()}
                {/* button row */}
                <Link href={`/space/${space.id}/reserve${url}`}>
                    <Button variant="primary" disabled={!okayToBook()}>
                        予約可能状況を確認する
                    </Button>
                </Link>
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

export const getStartDateTime = (
    start: Moment,
    durationType: DurationType,
    checkInTime: Moment
) => {
    const startDay = moment(start).format("YYYY-MM-DD");

    if (durationType !== "DAILY") {
        const startTime = moment(checkInTime).format("HH:00");
        return moment(startDay + " " + startTime, "YYYY-MM-DD HH:00").startOf(
            "hour"
        );
    } else {
        return moment(startDay, "YYYY-MM-DD").startOf("day");
    }
};

export const getEndDateTime = (
    startDateTime: Moment,
    duration,
    durationType
) => {
    const startDT = moment(startDateTime);
    if (durationType === "DAILY") {
        return startDT.add(duration, "d");
    } else if (durationType === "HOURLY") {
        return startDT.add(duration, "hour");
    } else if (durationType === "MINUTES") {
        return startDT.add(duration, "m");
    }
};

export const timeDifference = (startDateTime, endDateTime, durationType) => {
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