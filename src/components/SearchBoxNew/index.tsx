import React, { Fragment, useEffect, useState } from "react";
import { Calendar, DatePicker } from "antd";
import { Button, Tag } from "@element";
import moment from "moment";
import { useRouter } from "next/router";
import { Popover, Transition } from "@headlessui/react";
import {
    UsersIcon,
    CalendarIcon,
    FlagIcon,
    LocationMarkerIcon,
    SearchIcon,
    XIcon,
} from "@heroicons/react/outline";

const defaultBtnClass =
    "relative inline-flex items-center text-sm text-gray-400 bg-white border border-transparent hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

const areaList = [
    "千代田区",
    "中央区",
    "港区",
    "新宿区",
    "文京区",
    "台東区",
    "墨田区",
    "江東区",
    "品川区",
    "目黒区",
    "大田区",
    "世田谷区",
    "渋谷区",
    "中野区",
    "杉並区",
    "豊島区",
    "北区",
    "荒川区",
    "板橋区",
    "練馬区",
    "足立区",
    "葛飾区",
    "江戸川区",
];

const maxSpacePeople = 1000;
const maxHotelPeople = 10;

export const SearchBoxNew = ({
    defaultValue,
    onChange,
}: {
    defaultValue?: any;
    onChange?: any;
}) => {
    const [area, setArea] = useState<string>("");
    const [searchType, setSearchType] = useState<"space" | "hotel">("space");
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [noOfAdults, setNoOfAdults] = useState(1);
    const [noOfChild, setNoOfChild] = useState(0);

    const router = useRouter();

    useEffect(() => {
        if (defaultValue) {
            setArea(defaultValue.area || null);
            setSearchType(defaultValue.searchType || "space");
            setCheckInDate(
                defaultValue.checkInDate
                    ? moment(defaultValue.checkInDate)
                    : null
            );
            setCheckOutDate(
                defaultValue.checkOutDate
                    ? moment(defaultValue.checkOutDate)
                    : null
            );
            setNoOfAdults(defaultValue.noOfAdults || 1);
            setNoOfChild(defaultValue.noOfChild || 0);
        }
    }, []);

    useEffect(() => {
        if (searchType === "hotel" && noOfAdults > maxHotelPeople) {
            setNoOfAdults(10);
        }
    }, [searchType]);

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf("day");
    };

    const search = () => {
        // validate
        const errorList = [];
        if (!checkInDate) {
            errorList.push("Please provide check in date");
        } else {
            if (searchType === "hotel" && !checkOutDate) {
                errorList.push(
                    "Please provide check out date for hotel resrvation."
                );
            }
            if (checkOutDate) {
                if (checkInDate.isAfter(checkOutDate)) {
                    errorList.push(
                        "Check out date can not be before check in date."
                    );
                }
            }
        }
        if (noOfAdults < 1) {
            errorList.push("Adult guest can not be less than 1.");
        }
        if (errorList.length === 0) {
            // search
            const searchData = {
                searchType,
                checkInDate: checkInDate.format("YYYY-MM-DD"),
                checkOutDate: checkOutDate
                    ? checkOutDate.format("YYYY-MM-DD")
                    : null,
                noOfAdults,
                noOfChild,
            };
            if (area !== "") {
                searchData["area"] = area;
            }

            router.push({
                pathname: "/search",
                query: searchData,
            });
            if (onChange) {
                onChange(searchData);
            }
        } else {
            alert(errorList.map((error) => `${error}\n`));
        }
    };

    const changeNoOfPax = (
        incrementDecrement: "increment" | "decrement",
        adultChild: "adult" | "child"
    ) => {
        let max = 0;
        let min = 0;
        let currentValue = null;
        let updater = null;
        if (searchType === "space") {
            max = maxSpacePeople;
        } else {
            max = maxHotelPeople;
        }

        if (adultChild === "adult") {
            min = 1;
            currentValue = noOfAdults;
            updater = setNoOfAdults;
        } else {
            min = 0;
            currentValue = noOfChild;
            updater = setNoOfChild;
        }

        if (incrementDecrement === "increment") {
            if (currentValue < max) {
                updater(parseInt(currentValue, 10) + 1);
            }
        } else {
            if (currentValue > min) {
                updater(parseInt(currentValue, 10) - 1);
            }
        }
    };

    const addPax = (adult: number, child: number) => {
        return parseInt(`${adult}`, 10) + parseInt(`${child}`, 10);
    };

    return (
        <>
            <div className="z-20 w-full text-center text-white text-lg space-x-5 mb-6">
                <button
                    className={`px-1 font-bold border-b-4 ${
                        searchType === "space"
                            ? `text-white border-primary`
                            : `border-transparent text-gray-100 hover:text-white hover:border-white`
                    } `}
                    onClick={() => {
                        setSearchType("space");
                    }}
                >
                    スペース
                </button>
                <button
                    className={`px-1 font-bold border-b-4 ${
                        searchType === "hotel"
                            ? `text-white border-primary`
                            : `border-transparent text-gray-100 hover:text-white hover:border-white`
                    } `}
                    onClick={() => {
                        setSearchType("hotel");
                    }}
                >
                    宿泊
                </button>
            </div>
            <div className="flex flex-col w-full sm:items-center sm:justify-center sm:flex-row space-y-0 z-40 relative rounded-lg">
                {searchType === "hotel" && (
                    <>
                        {/* area search box */}
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <Popover.Button
                                        className={`${defaultBtnClass} py-3 px-5 sm:pl-10 rounded-t-lg sm:rounded-l-full w-full sm:w-60`}
                                    >
                                        <Tag
                                            Icon={LocationMarkerIcon}
                                            iconSize={6}
                                            iconStyle="text-gray-500 mr-2"
                                            textStyle="text-gray-600 text-sm text-left"
                                            numberOfLines={2}
                                        >
                                            <div className="text-gray-600">
                                                <p className="font-bold mb-0">
                                                    エリア
                                                </p>
                                                {area || "エリアを選択"}
                                            </div>
                                        </Tag>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel
                                            className={`absolute z-10 max-w-sm mt-3 lg:max-w-3xl left-0`}
                                        >
                                            <div className="relative left-0 z-50 overflow-hidden bg-white shadow-lg w-52 rounded-3xl">
                                                <div className="flex items-center justify-between px-4 pt-4 mb-1 ">
                                                    <p className="text-lg font-bold">
                                                        エリア
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setArea(null);
                                                            close();
                                                        }}
                                                    >
                                                        <XIcon className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <ul className="overflow-scroll max-h-60">
                                                    {areaList.map(
                                                        (
                                                            item: string,
                                                            index: number
                                                        ) => (
                                                            <li
                                                                key={index.toString()}
                                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-600 ${
                                                                    area ===
                                                                    item
                                                                        ? "bg-gray-100"
                                                                        : ""
                                                                }`}
                                                                onClick={() => {
                                                                    setArea(
                                                                        item
                                                                    );
                                                                    close();
                                                                }}
                                                            >
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                        {/* checkin date */}
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <Popover.Button
                                        className={`${defaultBtnClass} py-3 px-5 w-full sm:w-60`}
                                    >
                                        <Tag
                                            Icon={CalendarIcon}
                                            iconSize={6}
                                            iconStyle="text-gray-500 mr-2"
                                            textStyle="text-gray-600 text-sm text-left"
                                            numberOfLines={2}
                                        >
                                            <span className="text-gray-600 ">
                                                <p className="font-bold mb-0">
                                                    チェックイン
                                                </p>
                                                {checkInDate
                                                    ? checkInDate.format(
                                                          "MM月DD日"
                                                      )
                                                    : "日付を入力"}
                                            </span>
                                        </Tag>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel
                                            className={`absolute z-10 max-w-sm mt-3 lg:max-w-3xl left-0`}
                                        >
                                            <div className="relative z-50 overflow-hidden bg-white shadow-lg w-80 px-2 left-0 rounded-3xl">
                                                <div className="px-2 pt-0 mb-1">
                                                    <Calendar
                                                        fullscreen={false}
                                                        defaultValue={
                                                            checkInDate || null
                                                        }
                                                        onSelect={(date) => {
                                                            setCheckInDate(
                                                                date
                                                            );
                                                            close();
                                                        }}
                                                        disabledDate={
                                                            disabledDate
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                        {/* CheckOut Date */}
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <Popover.Button
                                        className={`${defaultBtnClass} py-3 px-5 w-full sm:w-60`}
                                    >
                                        <Tag
                                            Icon={CalendarIcon}
                                            iconSize={6}
                                            iconStyle="text-gray-500 mr-2"
                                            textStyle="text-gray-600 text-sm text-left"
                                            numberOfLines={2}
                                        >
                                            <span className="text-gray-600 ">
                                                <p className="font-bold mb-0">
                                                    チェックアウト
                                                </p>
                                                {checkOutDate
                                                    ? checkOutDate.format(
                                                          "MM月DD日"
                                                      )
                                                    : "日付を入力"}
                                            </span>
                                        </Tag>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel
                                            className={`absolute z-10 max-w-sm mt-3 lg:max-w-3xl left-0`}
                                        >
                                            <div className="relative z-50 overflow-hidden bg-white shadow-lg w-80 px-2 left-0 rounded-3xl">
                                                <div className="px-2 pt-0 mb-1">
                                                    <Calendar
                                                        fullscreen={false}
                                                        defaultValue={
                                                            checkOutDate || null
                                                        }
                                                        onSelect={(date) => {
                                                            setCheckOutDate(
                                                                date
                                                            );
                                                            close();
                                                        }}
                                                        disabledDate={
                                                            disabledDate
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                        {/* No of guests */}
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <Popover.Button
                                        className={`${defaultBtnClass} py-3 px-5 pr-10 rounded-b-lg sm:rounded-r-full w-full sm:w-60`}
                                    >
                                        <Tag
                                            Icon={UsersIcon}
                                            iconSize={6}
                                            iconStyle="text-gray-500 mr-2"
                                            textStyle="text-gray-600 text-sm text-left"
                                            numberOfLines={2}
                                        >
                                            <span className="text-gray-600 ">
                                                <p className="font-bold mb-0">
                                                    旅行者
                                                </p>
                                                ゲスト
                                                {`${addPax(
                                                    noOfAdults,
                                                    noOfChild
                                                )}`}
                                                名
                                            </span>
                                        </Tag>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel
                                            className={`absolute z-10 max-w-sm mt-3 lg:max-w-3xl left-0 sm:right-0`}
                                        >
                                            <div className="relative z-50 overflow-hidden bg-white shadow-lg w-80 px-2 left-0 rounded-3xl">
                                                <div className="flex items-center justify-between px-4 pt-4 mb-1 ">
                                                    <p className="text-lg font-bold">
                                                        ゲスト
                                                    </p>
                                                    <div className="flex"></div>
                                                </div>
                                                <div className="px-2 pb-4 mb-1">
                                                    <div className="space-y-3 px-3 text-gray-600">
                                                        <div className="flex flex-row items-center space-x-3">
                                                            <span className="inline-block w-20">
                                                                大人
                                                            </span>
                                                            <button
                                                                className="text-gray-400 hover:text-gray-500"
                                                                onClick={() => {
                                                                    // if (noOfAdults > 1) {
                                                                    //     setNoOfAdults(noOfAdults - 1);
                                                                    // }
                                                                    changeNoOfPax(
                                                                        "decrement",
                                                                        "adult"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                                                value={
                                                                    noOfAdults
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    const value =
                                                                        parseInt(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        );
                                                                    let max =
                                                                        maxSpacePeople;
                                                                    if (
                                                                        value >=
                                                                            1 &&
                                                                        value <=
                                                                            max
                                                                    ) {
                                                                        setNoOfAdults(
                                                                            value
                                                                        );
                                                                    }
                                                                }}
                                                                className="px-3 w-20 h-8 rounded border border-gray-300 shadow-sm"
                                                            />
                                                            <button
                                                                className="text-gray-400 hover:text-gray-500"
                                                                onClick={() => {
                                                                    // if (noOfAdults < 10) {
                                                                    //     setNoOfAdults(noOfAdults + 1);
                                                                    // }
                                                                    changeNoOfPax(
                                                                        "increment",
                                                                        "adult"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                                                    changeNoOfPax(
                                                                        "decrement",
                                                                        "child"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                                                value={
                                                                    noOfChild
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    const value =
                                                                        parseInt(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        );
                                                                    let max =
                                                                        maxSpacePeople;
                                                                    if (
                                                                        value >=
                                                                            0 &&
                                                                        value <=
                                                                            max
                                                                    ) {
                                                                        setNoOfChild(
                                                                            value
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-20 px-3 h-8 rounded border border-gray-300 shadow-sm"
                                                            />
                                                            <button
                                                                className="text-gray-400 hover:text-gray-500"
                                                                onClick={() => {
                                                                    changeNoOfPax(
                                                                        "increment",
                                                                        "child"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </>
                )}
                {searchType === "space" && (
                    <>
                        {/* area search box */}
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <Popover.Button
                                        className={`${defaultBtnClass} py-3 px-5 sm:pl-10 rounded-t-lg sm:rounded-l-full w-full sm:w-60`}
                                    >
                                        <Tag
                                            Icon={LocationMarkerIcon}
                                            iconSize={6}
                                            iconStyle="text-gray-500 mr-2"
                                            textStyle="text-gray-600 text-sm text-left"
                                            numberOfLines={2}
                                        >
                                            <div className="text-gray-600">
                                                <p className="font-bold mb-0">
                                                    エリア
                                                </p>
                                                {area || "エリアを選択"}
                                            </div>
                                        </Tag>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel
                                            className={`absolute z-10 max-w-sm mt-3 lg:max-w-3xl left-0`}
                                        >
                                            <div className="relative left-0 z-50 overflow-hidden bg-white shadow-lg w-52 rounded-3xl">
                                                <div className="flex items-center justify-between px-4 pt-4 mb-1 ">
                                                    <p className="text-lg font-bold">
                                                        エリア
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setArea(null);
                                                            close();
                                                        }}
                                                    >
                                                        <XIcon className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <ul className="overflow-scroll max-h-60">
                                                    {areaList.map(
                                                        (
                                                            item: string,
                                                            index: number
                                                        ) => (
                                                            <li
                                                                key={index.toString()}
                                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-600 ${
                                                                    area ===
                                                                    item
                                                                        ? "bg-gray-100"
                                                                        : ""
                                                                }`}
                                                                onClick={() => {
                                                                    setArea(
                                                                        item
                                                                    );
                                                                    close();
                                                                }}
                                                            >
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>

                        {/* No of guests */}

                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <Popover.Button
                                        className={`${defaultBtnClass} py-3 px-5 pr-10 w-full sm:w-60`}
                                    >
                                        <Tag
                                            Icon={UsersIcon}
                                            iconSize={6}
                                            iconStyle="text-gray-500 mr-2"
                                            textStyle="text-gray-600 text-sm text-left"
                                            numberOfLines={2}
                                        >
                                            <span className="text-gray-600 ">
                                                <p className="font-bold mb-0">
                                                    旅行者
                                                </p>
                                                ゲスト
                                                {`${addPax(
                                                    noOfAdults,
                                                    noOfChild
                                                )}`}
                                                名
                                            </span>
                                        </Tag>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel
                                            className={`absolute z-10 max-w-sm mt-3 lg:max-w-3xl left-0 sm:right-0`}
                                        >
                                            <div className="relative z-50 overflow-hidden bg-white shadow-lg w-80 px-2 left-0 rounded-3xl">
                                                <div className="flex items-center justify-between px-4 pt-4 mb-1 ">
                                                    <p className="text-lg font-bold">
                                                        ゲスト
                                                    </p>
                                                    <div className="flex"></div>
                                                </div>
                                                <div className="px-2 pb-4 mb-1">
                                                    <div className="space-y-3 px-3 text-gray-600">
                                                        <div className="flex flex-row items-center space-x-3">
                                                            <span className="inline-block w-20">
                                                                大人
                                                            </span>
                                                            <button
                                                                className="text-gray-400 hover:text-gray-500"
                                                                onClick={() => {
                                                                    // if (noOfAdults > 1) {
                                                                    //     setNoOfAdults(noOfAdults - 1);
                                                                    // }
                                                                    changeNoOfPax(
                                                                        "decrement",
                                                                        "adult"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                                                value={
                                                                    noOfAdults
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    const value =
                                                                        parseInt(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        );
                                                                    let max =
                                                                        maxHotelPeople;
                                                                    if (
                                                                        value >=
                                                                            1 &&
                                                                        value <=
                                                                            max
                                                                    ) {
                                                                        setNoOfAdults(
                                                                            value
                                                                        );
                                                                    }
                                                                }}
                                                                className="px-3 w-20 h-8 rounded border border-gray-300 shadow-sm"
                                                            />
                                                            <button
                                                                className="text-gray-400 hover:text-gray-500"
                                                                onClick={() => {
                                                                    // if (noOfAdults < 10) {
                                                                    //     setNoOfAdults(noOfAdults + 1);
                                                                    // }
                                                                    changeNoOfPax(
                                                                        "increment",
                                                                        "adult"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                                                    changeNoOfPax(
                                                                        "decrement",
                                                                        "child"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                                                value={
                                                                    noOfChild
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    const value =
                                                                        parseInt(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        );
                                                                    let max =
                                                                        maxHotelPeople;
                                                                    if (
                                                                        value >=
                                                                            0 &&
                                                                        value <=
                                                                            max
                                                                    ) {
                                                                        setNoOfChild(
                                                                            value
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-20 px-3 h-8 rounded border border-gray-300 shadow-sm"
                                                            />
                                                            <button
                                                                className="text-gray-400 hover:text-gray-500"
                                                                onClick={() => {
                                                                    changeNoOfPax(
                                                                        "increment",
                                                                        "child"
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                        {/* checkin date */}
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <Popover.Button
                                        className={`${defaultBtnClass} py-3 px-5 rounded-b-lg  sm:rounded-r-full  w-full sm:w-60`}
                                    >
                                        <Tag
                                            Icon={CalendarIcon}
                                            iconSize={6}
                                            iconStyle="text-gray-500 mr-2"
                                            textStyle="text-gray-600 text-sm text-left"
                                            numberOfLines={2}
                                        >
                                            <span className="text-gray-600 ">
                                                <p className="font-bold mb-0">
                                                    利用日
                                                </p>
                                                {checkInDate
                                                    ? checkInDate.format(
                                                          "MM月DD日"
                                                      )
                                                    : "日付を入力"}
                                            </span>
                                        </Tag>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel
                                            className={`absolute z-10 max-w-sm mt-3 lg:max-w-3xl left-0`}
                                        >
                                            <div className="relative z-50 overflow-hidden bg-white shadow-lg w-80 px-2 left-0 rounded-3xl">
                                                <div className="px-2 pt-0 mb-1">
                                                    <Calendar
                                                        fullscreen={false}
                                                        defaultValue={
                                                            checkInDate || null
                                                        }
                                                        onSelect={(date) => {
                                                            setCheckInDate(
                                                                date
                                                            );
                                                            close();
                                                        }}
                                                        disabledDate={
                                                            disabledDate
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </>
                )}

                <div className="pt-4 sm:pt-0 sm:pl-2">
                    <Button
                        rounded
                        variant="white"
                        className="px-5 py-5"
                        onClick={(event) => {
                            event.preventDefault();
                            search();
                        }}
                    >
                        <Tag
                            Icon={SearchIcon}
                            iconSize={6}
                            iconStyle="text-primary"
                            textStyle="text-gray-400"
                            numberOfLines={2}
                        >
                            <span className="text-primary text-lg leading-5 inline-block font-bold">
                                検索する
                            </span>
                        </Tag>
                    </Button>
                </div>
            </div>
        </>
    );
};
