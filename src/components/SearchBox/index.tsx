import { useRouter } from "next/router";
import { Button, Tag, TextField } from "@element";
import {
    CalendarIcon,
    FlagIcon,
    LocationMarkerIcon,
    SearchIcon,
} from "@heroicons/react/solid";
import React from "react";
import { Popover } from "@element";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_AVAILABLE_SPACE_TYPES } from "src/apollo/queries/space.queries";
import { selectionSetMatchesResult } from "@apollo/client/cache/inmemory/helpers";

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

export const SearchBox = ({ onChange }) => {
    const [area, setArea] = useState<string>("");
    const [purpose, setPurpose] = useState<string>("");
    const [date, setDate] = useState<string>("");
    // console.log(items);

    // const [loading, setLoading] = useState<boolean>(true);
    const [spaceTypes, setSpaceTypes] = useState<string[]>([]);

    const {
        data,
        loading: spaceTypesLoading,
        error,
    } = useQuery(GET_AVAILABLE_SPACE_TYPES);

    if (error) {
        return <h3>Error occurred while fetching space types</h3>;
    }

    if (spaceTypesLoading) {
        return <h3>Loading...</h3>;
    }

    return (
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative z-0 inline-flex rounded-full shadow-sm">
                {/* area search box */}
                <Popover
                    className={`${defaultBtnClass} py-3 pl-10 pr-8 rounded-l-full`}
                    btnText={
                        <Tag
                            Icon={LocationMarkerIcon}
                            iconSize={5}
                            iconStyle="text-gray-300 mr-2"
                            textStyle="text-gray-400 text-sm"
                            numberOfLines={1}
                        >
                            <span className="text-gray-400">
                                {area || "エリアを入力する"}
                            </span>
                        </Tag>
                    }
                >
                    {/* <div className="w-64 p-4 bg-white rounded-3xl">
                        <p className="text-lg text-primary text-semibold">
                            エリア
                        </p>
                        <div className="my-4 border-b border-gray-100">
                            <TextField
                                label=""
                                placeholder="エリアを入力する"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                            />
                            <p className="mt-2 text-xs text-gray-700">
                                ※駅は５つまで選択可能です。都道府県・市区町村を複数入力することはできません。
                            </p>
                        </div>
                        <div>
                            <Button variant="primary" className="mt-4">
                                適用する
                            </Button>
                        </div>
                    </div> */}
                    <div className="relative left-0 z-50 overflow-hidden bg-white shadow-lg w-52 rounded-3xl">
                        <p className="px-4 pt-4 mb-1 text-lg text-semibold">
                            エリア
                        </p>
                        {/* <div className="flex px-4 space-x-3">
                            <button className="text-sm text-gray-800">
                                時間貸し
                            </button>
                            <button className="text-sm text-gray-300">
                                宿泊
                            </button>
                        </div> */}
                        <ul className="overflow-scroll max-h-60">
                            {areaList.map((item: string, index: number) => (
                                <li
                                    key={index.toString()}

                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-600 ${
                                        area === item ? "bg-gray-100" : ""
                                    }`}

                                    onClick={() => setArea(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Popover>

                {/* purpose of use search box */}
                <Popover
                    className={`${defaultBtnClass} px-10 py-3 -ml-px`}
                    btnText={
                        <Tag
                            Icon={FlagIcon}
                            iconSize={5}
                            iconStyle="text-gray-300 mr-2"
                            textStyle="text-gray-400 text-sm"
                            numberOfLines={1}
                        >
                            <span className="text-gray-400">
                                {purpose || "利用目的"}
                            </span>
                        </Tag>
                    }
                    position="center"
                >
                    <div className="relative z-50 overflow-hidden bg-white shadow-lg w-52 -left-1/2 rounded-3xl">
                        <p className="px-4 pt-4 mb-1 text-lg text-semibold">
                            利用目的
                        </p>
                        {/* <div className="flex px-4 space-x-3">
                            <button className="text-sm text-gray-800">
                                時間貸し
                            </button>
                            <button className="text-sm text-gray-300">
                                宿泊
                            </button>
                        </div> */}
                        <ul className="mt-2">
                            {data.availableSpaceTypes.map(
                                (item: any, index: number) => (
                                    <li
                                        key={index.toString()}

                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-600 ${
                                            purpose === item.title
                                                ? "bg-gray-100"
                                                : ""
                                        }`}

                                        onClick={() => setPurpose(item.title)}
                                    >
                                        {item.title}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </Popover>

                {/* date and time search boc */}
                <Popover
                    className={`${defaultBtnClass} py-3 pl-8 pr-12 -ml-px rounded-r-full`}
                    btnText={
                        <Tag
                            Icon={CalendarIcon}
                            iconSize={5}
                            iconStyle="text-gray-300 mr-2"
                            textStyle="text-gray-400 text-sm"
                            numberOfLines={1}
                        >
                            <span className="text-gray-400">
                                {date || "目的日時"}
                            </span>
                        </Tag>
                    }
                >
                    <ul>
                        <li>Suman</li>
                        <li>Suman</li>
                        <li>Suman</li>
                        <li>Suman</li>
                    </ul>
                </Popover>
            </div>
            <div>
                <Button
                    rounded
                    variant="white"
                    className="px-5 py-5"
                    onClick={(event) => {
                        event.preventDefault();
                        onChange({ area, purpose });
                    }}
                >
                    <Tag
                        Icon={SearchIcon}
                        iconSize={5}
                        iconStyle="text-gray-400"
                        textStyle="text-gray-400"
                        numberOfLines={1}
                    >
                        <span className="text-gray-500 inline-block py-1">
                            検索する
                        </span>
                    </Tag>
                </Button>
            </div>
        </div>
    );
}
