import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Button } from "@element";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { HeartIcon, ShareIcon } from "@heroicons/react/solid";

import { DatePicker } from "antd";

import moment, { Moment } from "moment";

import { useLazyQuery } from "@apollo/client";
import { Listbox, Transition } from "@headlessui/react";
import { CALCULATE_ROOM_PLAN_PRICE } from "src/apollo/queries/hotel.queries";
import {
    generateAlertModalContent,
    hoursAsCancelPolicyDuration,
    ModalData,
    PriceFormatter,
} from "src/utils";
import AlertModal from "../AlertModal";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export const FloatingPriceThree = ({ plans, currentPlan, reserve }) => {
    const [startDate, setStartDate] = useState<Moment>();
    const [endDate, setEndDate] = useState<Moment>();
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);
    const [selectedRoom, setSelectedRoom] = useState(plans[0]?.roomTypes[0]);
    const [noOfAdults, setNoOfAdults] = useState(1);
    const [noOfChild, setNoOfChild] = useState(0);
    const [guestPanelOpen, setGuestPanelOpen] = useState(false);
    const [price, setPrice] = useState(null);
    const [noOfNight, setNoOfNight] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const modalContent = useMemo(() => {
        return generateAlertModalContent({
            modalData,
            setModalData,
            setIsModalOpen,
        });
    }, [
        modalData?.intent,
        modalData?.text,
        modalData?.title,
        modalData?.onConfirm,
    ]);

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const disabledDateCheckout = (current) => {
        if (startDate) {
            return current < startDate.endOf("day");
        } else {
            return false;
        }
    };

    const [
        calculatePrice,
        { loading: calculatingPrice, error: priceCalculationError },
    ] = useLazyQuery(CALCULATE_ROOM_PLAN_PRICE, {
        onCompleted(data) {
            setPrice(data?.calculateRoomPlanPrice?.totalAmount);
        },
        onError(error) {
            console.log(error);
        },
    });

    useEffect(() => {
        setSelectedRoom(selectedPlan?.roomTypes[0]);
    }, [selectedPlan]);

    useEffect(() => {
        if (currentPlan) {
            setSelectedPlan(currentPlan);
        }
    }, [currentPlan]);

    useEffect(() => {
        if (startDate && endDate) {
            const noOfNights = endDate
                .endOf("day")
                .diff(startDate.startOf("day"), "days");
            setNoOfNight(noOfNights);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        // get price
        if (
            startDate &&
            endDate &&
            selectedPlan &&
            selectedRoom &&
            noOfAdults >= 1 &&
            noOfChild >= 0
        ) {
            calculatePrice({
                variables: {
                    input: {
                        roomPlanId: selectedRoom.id,
                        checkInDate: startDate?.startOf("day").valueOf(),
                        checkOutDate: endDate?.startOf("day").valueOf(),
                        nAdult: noOfAdults,
                        nChild: noOfChild,
                    },
                },
            });
        }
    }, [selectedRoom, startDate, endDate, noOfAdults, noOfChild]);

    const makeReservation = () => {
        if (
            startDate &&
            endDate &&
            noOfAdults &&
            selectedRoom &&
            selectedPlan &&
            price &&
            noOfNight
        ) {
            reserve({
                startDate,
                endDate,
                noOfAdults,
                noOfChild: noOfChild || 0,
                roomPlanId: selectedRoom.id,
                room: selectedRoom,
                plan: selectedPlan,
                price,
                noOfNight,
            });
        }
    };

    return (
        <div className="no-scrollbar w-full max-h-screen overflow-y-scroll md:sticky lg:w-96 md:top-20">
            <div className="relative p-4 pt-0 space-y-4 border border-gray-200 rounded-lg">
                {/* price row */}
                <div className="flex justify-between">
                    {/* <Price amount={price} /> */}
                    {/* <div className="text-sm text-gray-600">¥ 10,392/日</div> */}
                </div>
                <div>
                    <Listbox value={selectedPlan} onChange={setSelectedPlan}>
                        {({ open }) => (
                            <>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
                                        <span className="flex items-center">
                                            {/* <img
                                                src={
                                                    selectedPlan.photos[0]
                                                        .medium.url
                                                }
                                                alt=""
                                                className="flex-shrink-0 h-10 w-10 rounded"
                                            /> */}
                                            <span className="ml-3 block truncate text-lg font-bold">
                                                {selectedPlan?.name}
                                                <br />
                                                <span className="text-gray-500 text-base font-normal">
                                                    {selectedPlan?.description}
                                                </span>
                                            </span>
                                        </span>
                                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <SelectorIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {plans.map((plan) => (
                                                <Listbox.Option
                                                    key={plan.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active
                                                                ? "text-white bg-primary"
                                                                : "text-gray-900",
                                                            "cursor-default select-none relative py-2 pl-3 pr-9"
                                                        )
                                                    }
                                                    value={plan}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <div className="flex items-center">
                                                                {/* <img
                                                                    src={
                                                                        plan
                                                                            .photos[0]
                                                                            .medium
                                                                            .url
                                                                    }
                                                                    alt=""
                                                                    className="flex-shrink-0 h-6 w-6 rounded-full"
                                                                /> */}
                                                                <span
                                                                    className={classNames(
                                                                        selected
                                                                            ? "font-semibold"
                                                                            : "font-normal",
                                                                        "ml-3 block truncate"
                                                                    )}
                                                                >
                                                                    {plan.name}
                                                                </span>
                                                            </div>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active
                                                                            ? "text-white"
                                                                            : "text-primary",
                                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                    )}
                                                                >
                                                                    <CheckIcon
                                                                        className="h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                <div>
                    <Listbox value={selectedRoom} onChange={setSelectedRoom}>
                        {({ open }) => (
                            <>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
                                        <span className="flex items-center">
                                            {/* <img
                                                src={
                                                    selectedRoom.photos[0]
                                                        .medium.url
                                                }
                                                alt=""
                                                className="flex-shrink-0 h-6 w-6 rounded-full"
                                            /> */}
                                            <span className="ml-3 block truncate text-lg font-bold">
                                                {selectedRoom.hotelRoom.name}
                                                <br />
                                                <span className="text-base text-gray-500 font-normal">
                                                    {
                                                        selectedRoom.hotelRoom
                                                            .description
                                                    }
                                                </span>
                                            </span>
                                        </span>
                                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <SelectorIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {selectedPlan.roomTypes.map(
                                                (roomType) => (
                                                    <Listbox.Option
                                                        key={roomType.id}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            classNames(
                                                                active
                                                                    ? "text-white bg-primary"
                                                                    : "text-gray-900",
                                                                "cursor-default select-none relative py-2 pl-3 pr-9"
                                                            )
                                                        }
                                                        value={roomType}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <div className="flex items-center">
                                                                    {/* <img
                                                                        src={
                                                                            roomType
                                                                                .hotelRoom
                                                                                .photos[0]
                                                                                .medium
                                                                                .url
                                                                        }
                                                                        alt=""
                                                                        className="flex-shrink-0 h-6 w-6 rounded-full"
                                                                    /> */}
                                                                    <span
                                                                        className={classNames(
                                                                            selected
                                                                                ? "font-semibold"
                                                                                : "font-normal",
                                                                            "ml-3 block truncate"
                                                                        )}
                                                                    >
                                                                        {
                                                                            roomType
                                                                                .hotelRoom
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </div>

                                                                {selected ? (
                                                                    <span
                                                                        className={classNames(
                                                                            active
                                                                                ? "text-white"
                                                                                : "text-primary",
                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                        )}
                                                                    >
                                                                        <CheckIcon
                                                                            className="h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                )
                                            )}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                {/* date and time row */}
                <div>
                    <fieldset>
                        <div className=" bg-white rounded-md shadow-sm -space-y-px">
                            <div className="flex -space-x-px">
                                <div className="w-1/2 flex-1 min-w-0 border border-gray-300 shadow-sm rounded-none rounded-tl-md py-2 space-y-2">
                                    <label
                                        htmlFor="card-expiration-date"
                                        className="px-3 text-gray-500 font-bold"
                                    >
                                        チェックイン
                                    </label>
                                    <div className="relative block w-full rounded-none rounded-tl-md bg-transparent sm:text-sm border-gray-300">
                                        <DatePicker
                                            onChange={(date) => {
                                                if (date) {
                                                    setStartDate(
                                                        date?.startOf("day")
                                                    );
                                                }
                                            }}
                                            disabledDate={disabledDate}
                                            bordered={false}
                                            className="px-3 w-full rounded-none rounded-tl-md bg-transparent text-gray-600 placeholder-gray-400 border border-gray-200 hover:cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="w-1/2 flex-1 min-w-0 border border-gray-300 shadow-sm rounded-none rounded-tr-md py-2 space-y-2">
                                    <label
                                        htmlFor="card-expiration-date"
                                        className="px-3 text-gray-500 font-bold"
                                    >
                                        チェックアウト
                                    </label>
                                    <div className="relative block w-full rounded-none rounded-tr-md bg-transparent sm:text-sm border-gray-300">
                                        <DatePicker
                                            onChange={(date) => {
                                                if (date) {
                                                    setEndDate(
                                                        date?.endOf("day")
                                                    );
                                                }
                                            }}
                                            disabledDate={disabledDateCheckout}
                                            bordered={false}
                                            className="px-3 w-full rounded-none rounded-tl-md bg-transparent text-gray-600 placeholder-gray-400 border border-gray-200 hover:cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex-1 min-w-0 border border-gray-300 shadow-sm rounded-none rounded-b-md py-2 space-y-2">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setGuestPanelOpen(true)}
                                >
                                    <label
                                        htmlFor="card-number"
                                        className="px-3 text-gray-500 font-bold"
                                    >
                                        人数
                                    </label>
                                    <div className="px-3 text-gray-500">
                                        ゲスト{noOfAdults + noOfChild}人
                                    </div>
                                </div>
                                {guestPanelOpen && (
                                    <div className="space-y-3 px-3 text-gray-600">
                                        <div className="flex flex-row items-center space-x-3">
                                            <span className="inline-block w-20">
                                                大人
                                            </span>
                                            <button
                                                className="text-gray-400 hover:text-gray-500"
                                                onClick={() => {
                                                    if (noOfAdults > 1) {
                                                        setNoOfAdults(
                                                            noOfAdults - 1
                                                        );
                                                    }
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                value={noOfAdults}
                                                min={1}
                                                className="w-16 px-3 h-8 rounded border border-gray-300 shadow-sm"
                                            />
                                            <button
                                                className="text-gray-400 hover:text-gray-500"
                                                onClick={() => {
                                                    if (noOfAdults < 10) {
                                                        setNoOfAdults(
                                                            noOfAdults + 1
                                                        );
                                                    }
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex flex-row items-center space-x-3">
                                            <span className="inline-block w-20">
                                                子供
                                            </span>

                                            <button
                                                className="text-gray-400 hover:text-gray-500"
                                                onClick={() => {
                                                    if (noOfChild > 0) {
                                                        setNoOfChild(
                                                            noOfChild - 1
                                                        );
                                                    }
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                value={noOfChild}
                                                className="w-16 px-3 h-8 rounded border border-gray-300 shadow-sm"
                                            />
                                            <button
                                                className="text-gray-400 hover:text-gray-500"
                                                onClick={() => {
                                                    if (noOfChild < 10) {
                                                        setNoOfChild(
                                                            noOfChild + 1
                                                        );
                                                    }
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setGuestPanelOpen(false)
                                            }
                                            className="font-bold"
                                        >
                                            保存
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </fieldset>
                </div>

                {/* button row */}
                <button
                    className="bg-primary hover:bg-primaryHover text-white font-bold w-full py-2 px-4 rounded"
                    onClick={() => {
                        makeReservation();
                    }}
                >
                    予約可能状況を確認する
                </button>
                {/* policy row */}
                {/* cancel policy */}
                {selectedPlan && selectedPlan.cancelPolicy && (
                    <div className="flex flex-col justify-center space-x-1.5">
                        <div className="w-full my-6 border-t border-gray-300"></div>
                        <h2 className="mb-4 text-base font-bold text-gray-700">
                            キャンセルポリシー
                            {/* {selectedPlan.cancelPolicy.name} */}
                        </h2>
                        <ul>
                            {[...selectedPlan.cancelPolicy.rates]
                                .sort((a, b) => a.beforeHours - b.beforeHours)
                                .map((policy, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-base flex justify-between w-full"
                                        >
                                            <div>
                                                {hoursAsCancelPolicyDuration(
                                                    policy.beforeHours
                                                )}
                                            </div>
                                            <div>{policy.percentage}%</div>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                )}
                {calculatingPrice && (
                    <div className="flex items-center justify-center">
                        <div>読み込み中...</div>
                    </div>
                )}

                {priceCalculationError && (
                    <div className="text-sm text-gray-500">
                        {priceCalculationError?.message ||
                            "Could not load price."}
                    </div>
                )}

                {!calculatingPrice && !priceCalculationError && (
                    <div className="space-y-3 text-lg">
                        {noOfNight && (
                            <>
                                <div className="flex items-center justify-between ">
                                    <div>
                                        大人{noOfAdults}
                                        {noOfChild > 0 && (
                                            <>・子供{noOfChild}</>
                                        )}{" "}
                                        x {noOfNight}泊
                                    </div>
                                    <div>
                                        {price && (
                                            <div>
                                                {PriceFormatter(price / 1.1)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>税金</div>
                                    <div>
                                        {PriceFormatter(price - price / 1.1)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between font-bold border-t border-gray-300 pt-3">
                                    <div>合計（税込）</div>
                                    <div>{PriceFormatter(price)}</div>
                                </div>
                            </>
                        )}
                    </div>
                )}
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
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    setIsModalOpen(false);
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </div>
    );
};
