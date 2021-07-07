import { Button, Tag, TextField } from '@element'
import { CalendarIcon, FlagIcon, LocationMarkerIcon, SearchIcon } from '@heroicons/react/solid'
import React from 'react'
import { Popover } from '@element'
import { useState } from 'react'

const defaultBtnClass = "relative inline-flex items-center text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
const purposeList = ["パーティー", "飲み会", "ビジネス", "撮影・収録", "趣味・遊び", "スポーツ・フィットネス", "勉強・読書", "レッスン・講座"];

export const SearchBox = () => {
    const [area, setArea] = useState<string>("");
    const [purpose, setPurpose] = useState<string>("");
    const [date, setDate] = useState<string>("");

    return (
        <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-2.5">
            <span className="relative z-0 inline-flex rounded-md shadow-sm">

                {/* area search box */}
                <Popover
                    className={`${defaultBtnClass} py-2 pl-6 pr-4 border-r-0 rounded-l-full`}
                    btnText={<Tag Icon={LocationMarkerIcon} fontSize="sm" numberOfLines={2}>{area || "エリアを入力する"}</Tag>}>
                    <div className="w-64 p-4 bg-white rounded-3xl">
                        <p className="text-lg text-semibold">エリア</p>
                        <div className="my-4 border-b border-gray-100">
                            <TextField label="" placeholder="エリアを入力する" value={area} onChange={(e) => setArea(e.target.value)} />
                            <p className="text-xs mt-1.5">※駅は５つまで選択可能です。都道府県・市区町村を複数入力することはできません。</p>
                        </div>
                        <div>
                            <Button variant="primary" className="mt-4">適用する</Button>
                        </div>
                    </div>
                </Popover>

                {/* purpose of use search box */}
                <Popover
                    className={`${defaultBtnClass} px-4 py-2 -ml-px border-l-0 border-r-0`}
                    btnText={<Tag Icon={FlagIcon} fontSize="sm" numberOfLines={2}>{purpose || "利用目的"}</Tag>}
                    position="center"
                >
                    <div className="relative overflow-hidden bg-white w-52 -left-1/2 rounded-3xl">
                        <p className="px-4 pt-4 mb-1 text-lg text-semibold">利用目的</p>
                        <div className="flex px-4 space-x-3">
                            <button className="text-sm text-gray-800">時間貸し</button>
                            <button className="text-sm text-gray-300">宿泊</button>
                        </div>
                        <ul className="mt-2">
                            {purposeList.map((item: string) => (
                                <li
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-600 ${purpose === item ? "bg-gray-100" : ""}`}
                                    onClick={() => setPurpose(item)}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Popover>

                {/* date and time search boc */}
                <Popover
                    className={`${defaultBtnClass} py-2 pl-4 pr-6 -ml-px border-l-0 rounded-r-full`}
                    btnText={<Tag Icon={CalendarIcon} fontSize="sm" numberOfLines={2}>{date || "目的日時"}</Tag>}>
                    <ul>
                        <li>Suman</li>
                        <li>Suman</li>
                        <li>Suman</li>
                        <li>Suman</li>
                    </ul>
                </Popover>
            </span>
            <div>
                <Button rounded variant="primary">
                    <SearchIcon className="w-4 h-4 mr-1.5" />
                    <span>検索する</span>
                </Button>
            </div>
        </div>
    )
}
