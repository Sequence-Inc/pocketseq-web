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

const defaultBtnClass =
    "relative inline-flex items-center text-sm text-gray-400 bg-white border border-transparent hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";
const purposeList = [
    "パーティー",
    "飲み会",
    "ビジネス",
    "撮影・収録",
    "趣味・遊び",
    "スポーツ・フィットネス",
    "勉強・読書",
    "レッスン・講座",
];

export const SearchBox = () => {
    const [area, setArea] = useState<string>("");
    const [purpose, setPurpose] = useState<string>("");
    const [date, setDate] = useState<string>("");

    const router = useRouter();
    return (
        <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-2.5">
            <div className="relative z-0 inline-flex rounded-full shadow-sm">
                {/* area search box */}
                <Popover
                    className={`${defaultBtnClass} py-3 pl-6 pr-4 rounded-l-full`}
                    btnText={
                        <Tag
                            Icon={LocationMarkerIcon}
                            iconSize={5}
                            iconStyle="text-gray-300"
                            textStyle="text-gray-400 text-sm"
                            numberOfLines={1}
                        >
                            <span className="text-gray-400">
                                {area || "エリアを入力する"}
                            </span>
                        </Tag>
                    }
                >
                    <div className="w-64 p-4 bg-white rounded-3xl">
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
                            <p className="text-xs text-gray-700 mt-2">
                                ※駅は５つまで選択可能です。都道府県・市区町村を複数入力することはできません。
                            </p>
                        </div>
                        <div>
                            <Button variant="primary" className="mt-4">
                                適用する
                            </Button>
                        </div>
                    </div>
                </Popover>

                {/* purpose of use search box */}
                <Popover
                    className={`${defaultBtnClass} px-6 py-3 -ml-px`}
                    btnText={
                        <Tag
                            Icon={FlagIcon}
                            iconSize={5}
                            iconStyle="text-gray-300"
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
                    <div className="relative overflow-hidden bg-white w-52 -left-1/2 rounded-3xl">
                        <p className="px-4 pt-4 mb-1 text-lg text-semibold">
                            利用目的
                        </p>
                        <div className="flex px-4 space-x-3">
                            <button className="text-sm text-gray-800">
                                時間貸し
                            </button>
                            <button className="text-sm text-gray-300">
                                宿泊
                            </button>
                        </div>
                        <ul className="mt-2">
                            {purposeList.map((item: string, index: number) => (
                                <li
                                    key={index.toString()}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-600 ${
                                        purpose === item ? "bg-gray-100" : ""
                                    }`}
                                    onClick={() => setPurpose(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Popover>

                {/* date and time search boc */}
                <Popover
                    className={`${defaultBtnClass} py-3 pl-4 pr-6 -ml-px rounded-r-full`}
                    btnText={
                        <Tag
                            Icon={CalendarIcon}
                            iconSize={5}
                            iconStyle="text-gray-300"
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
                    variant="primary"
                    className="px-5 py-3"
                    onClick={(event) => {
                        event.preventDefault();
                        router.push("/search");
                    }}
                >
                    <Tag
                        Icon={SearchIcon}
                        iconSize={5}
                        iconStyle="text-white"
                        textStyle="text-white"
                        numberOfLines={1}
                    >
                        <span className="text-white">検索する</span>
                    </Tag>
                </Button>
            </div>
        </div>
    );
};
