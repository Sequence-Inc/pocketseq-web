import { Button, Tag } from "@element";
import {
    CalendarIcon,
    FlagIcon,
    LocationMarkerIcon,
    SearchIcon,
} from "@heroicons/react/solid";
import React from "react";

export const SearchBox = () => {
    return (
        <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-2.5">
            <div className="relative z-0 inline-flex rounded-full shadow-sm">
                <button
                    type="button"
                    className="relative inline-flex items-center py-3 pl-6 pr-4 text-sm text-gray-400 bg-white border border-r-0 border-gray-300 rounded-l-full hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <Tag
                        Icon={LocationMarkerIcon}
                        TextStyle="text-gray-400 text-sm"
                        numberOfLines={2}
                    >
                        エリアを入力する
                    </Tag>
                </button>
                <button
                    type="button"
                    className="relative inline-flex items-center px-6 py-3 -ml-px text-sm text-gray-400 bg-white border border-l-0 border-r-0 border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <Tag
                        Icon={FlagIcon}
                        TextStyle="text-gray-400 text-sm"
                        numberOfLines={2}
                    >
                        利用目的
                    </Tag>
                </button>
                <button
                    type="button"
                    className="relative inline-flex items-center py-3 pl-4 pr-6 -ml-px text-sm text-gray-400 bg-white border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <Tag
                        Icon={CalendarIcon}
                        IconStyle="w-5 h-5"
                        TextStyle="text-gray-400 text-sm"
                        numberOfLines={2}
                    >
                        目的日時
                    </Tag>
                </button>
            </div>
            <div>
                <Button rounded variant="primary" className="py-3 px-5">
                    <SearchIcon className="w-4 h-4 mr-1" />
                    <span>検索する</span>
                </Button>
            </div>
        </div>
    );
};
