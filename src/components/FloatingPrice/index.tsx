import React, { useEffect, useState } from "react";
import { Button, Price } from "@element";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { HeartIcon, ShareIcon } from "@heroicons/react/solid";
import { ISpacePricePlan } from "src/types/timebookTypes";
import { FormatPrice, PriceFormatter } from "src/utils";

import DatePicker from "react-datepicker";
import { GET_PAYMENT_SOURCES } from "src/apollo/queries/user.queries";
import { useQuery } from "@apollo/client";

export const FloatingPrice = ({
    pricePlans,
}: {
    pricePlans: ISpacePricePlan[];
}) => {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [subtotal, setSubtotal] = useState(null);
    const [hours, setHours] = useState(null);
    const [paymentSources, setPaymentSources] = useState(null);
    const [paymentSourcesError, setPaymentSourcesError] = useState(null);
    const [paymentSourcesLoading, setPaymentSourcesLoading] = useState(false);

    useEffect(() => {
        if (start !== null && end !== null) {
            setHours(hoursDifference());
            setSubtotal(priceCalculation());
        }
    }, [start, end]);

    const currentDateTime = new Date();
    const maxDateTime = new Date(currentDateTime);
    maxDateTime.setDate(maxDateTime.getDate() + 90); // added 90 days as max date time
    const minTime = new Date(1995, 1, 1, 10, 0, 0);
    const maxTime = new Date(1995, 1, 1, 20, 0, 0);

    const price = FormatPrice("HOURLY", pricePlans, true, true);

    const hoursDifference = () => {
        if (start === null || end === null || start > end) {
            return -1;
        }
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60));
    };

    const priceCalculation = () => {
        // Todo: Calculate based on price plans
        return hours * price;
    };

    const handleReservation = (selectedPaymentSource: string = null) => {
        if (!selectedPaymentSource && !paymentSources) {
            const {
                data,
                loading: paymentSourcesLoading,
                error,
            } = useQuery(GET_PAYMENT_SOURCES);
            if (error) {
                // setPaymentSources()
                setPaymentSourcesError(error.message);
            }
            if (paymentSourcesLoading) {
                setPaymentSourcesLoading(true);
            }
        }
        // get payment method

        // select payment method
        return null;
    };

    const renderPaymentSource = () => {
        return null;
    };

    const hoursCalculation = () => {
        if (start && end) {
            let content = null;
            if (hours < 0) {
                content = (
                    <div>
                        Error: Start date time cannot be after end date time.
                    </div>
                );
            } else if (hours === 0) {
                content = (
                    <div>
                        Error: Start date time cannot be same as end date time.
                    </div>
                );
            } else {
                // calculate plan

                // calculate price
                const subtotal = priceCalculation();
                content = (
                    <div className="space-y-2 mt-3">
                        <div className="flex justify-between">
                            <span>時間:</span>
                            <span>{hours}時間</span>
                        </div>
                        <div className="flex justify-between">
                            <span>プラン:</span>
                            <span>基本プラン</span>
                        </div>
                        <div className="flex justify-between">
                            <span>小計:</span>
                            <span className="font-bold text-xl">
                                {PriceFormatter(subtotal)}
                            </span>
                        </div>
                    </div>
                );
            }
            return (
                <div className=" border border-gray-100 shadow-sm rounded-lg p-4">
                    <div className="text-right">
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                setStart(null);
                                setEnd(null);
                            }}
                            className="cursor-pointer"
                        >
                            Clear
                        </a>
                    </div>
                    {content}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="sticky w-full lg:w-96 top-20">
            <div className="p-5 space-y-4 border border-gray-200 rounded-lg">
                {/* price row */}
                <div className="flex justify-between">
                    <Price amount={price} />
                    {/* <p className="text-sm text-gray-600">¥ 10,392/日</p> */}
                </div>

                {/* date and time row */}
                <div>
                    <p className="text-sm font-bold text-gray-500 mb-2">
                        チェックイン
                    </p>
                    <DatePicker
                        selected={start}
                        onChange={(date) => setStart(date)}
                        placeholderText="日時を追加"
                        minDate={currentDateTime}
                        maxDate={maxDateTime}
                        minTime={minTime}
                        maxTime={maxTime}
                        showTimeSelect
                        timeIntervals={60}
                        dateFormat="Pp"
                        className="w-full text-sm text-gray-700 placeholder-gray-400 px-3 py-2 border border-gray-200 rounded-md shadow-sm hover:cursor-pointer"
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-500 mb-2">
                        チェックアウト
                    </p>
                    <DatePicker
                        selected={end}
                        onChange={(date) => setEnd(date)}
                        placeholderText="日時を追加"
                        minDate={currentDateTime}
                        maxDate={maxDateTime}
                        minTime={minTime}
                        maxTime={maxTime}
                        timeIntervals={60}
                        showTimeSelect
                        dateFormat="Pp"
                        className="w-full text-sm text-gray-700 placeholder-gray-400 px-3 py-2 border border-gray-200 rounded-md shadow-sm hover:cursor-pointer"
                    />
                </div>

                {hoursCalculation()}

                {/* button row */}
                <Button
                    variant="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        handleReservation();
                    }}
                >
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
            <div>{renderPaymentSource()}</div>
        </div>
    );
};
