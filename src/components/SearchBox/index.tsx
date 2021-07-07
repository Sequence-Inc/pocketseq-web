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
                    className="relative inline-flex items-center py-3 pl-6 pr-4 text-sm text-gray-400 bg-white border border-transparent rounded-l-full hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                    <Tag
                        Icon={LocationMarkerIcon}
                        iconSize={5}
                        iconStyle="text-gray-300"
                        textStyle="text-gray-400 text-sm"
                        numberOfLines={1}
                    >
                        <span className="text-gray-400">エリアを入力する</span>
                    </Tag>
                </button>
                <button
                    type="button"
                    className="relative inline-flex items-center px-6 py-3 -ml-px text-sm text-gray-400 bg-white border  border-transparent hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                    <Tag
                        Icon={FlagIcon}
                        iconSize={5}
                        iconStyle="text-gray-300"
                        textStyle="text-gray-400 text-sm"
                        numberOfLines={1}
                    >
                        <span className="text-gray-400">利用目的</span>
                    </Tag>
                </button>
                <button
                    type="button"
                    className="relative inline-flex items-center py-3 pl-4 pr-6 -ml-px text-sm text-gray-400 bg-white border border-transparent rounded-r-full hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                    <Tag
                        Icon={CalendarIcon}
                        iconSize={5}
                        iconStyle="text-gray-300"
                        textStyle="text-gray-400 text-sm"
                        numberOfLines={1}
                    >
                        <span className="text-gray-400">目的日時</span>
                    </Tag>
                </button>
            </div>
            <div>
                <Button rounded variant="primary" className="py-3 px-5">
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
