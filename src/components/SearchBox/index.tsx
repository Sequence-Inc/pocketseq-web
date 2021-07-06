import { Button, Tag } from '@element'
import { CalendarIcon, FlagIcon, LocationMarkerIcon, SearchIcon } from '@heroicons/react/solid'
import React from 'react'

export const SearchBox = () => {
    return (
        <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-2.5">
            <span className="relative z-0 inline-flex rounded-md shadow-sm">
                <button
                    type="button"
                    className="relative inline-flex items-center py-2 pl-6 pr-4 text-sm font-medium text-gray-700 bg-white border border-r-0 border-gray-300 rounded-l-full hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <Tag Icon={LocationMarkerIcon} fontSize="sm" numberOfLines={2}>エリアを入力する</Tag>
                </button>
                <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-l-0 border-r-0 border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <Tag Icon={FlagIcon} fontSize="sm" numberOfLines={2}>利用目的</Tag>
                </button>
                <button
                    type="button"
                    className="relative inline-flex items-center py-2 pl-4 pr-6 -ml-px text-sm font-medium text-gray-700 bg-white border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <Tag Icon={CalendarIcon} fontSize="sm" numberOfLines={2}>目的日時</Tag>
                </button>
            </span>
            <div>
                <Button rounded variant="primary"><SearchIcon className="w-4 h-4 mr-1.5" /><span>検索する</span></Button>
            </div>
        </div>
    )
}
