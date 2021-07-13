import { Rating, Tag } from '@element'
import { HomeIcon, LocationMarkerIcon, TagIcon } from '@heroicons/react/outline'
import UserGroupIcon from '@heroicons/react/outline/UserGroupIcon'
import React from 'react'

export const SpaceInfoTitle = () => {
    return (
        <>
            <div className="mb-3">
                <Tag
                    Icon={LocationMarkerIcon}
                    iconStyle="text-gray-300"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    大阪府大阪市天王寺区
                </Tag>
            </div>
            <h2 className="mb-3 text-xl font-medium text-gray-700">いこい【丸々貸切一軒家・毎回清掃】インドア花見/デート/女子会/撮影/パーティー/おしゃれ/かわいい/キッチン</h2>
            <div className="flex items-center space-x-3">
                <Rating />
                <div className="text-sm">
                    <p className="inline-block font-bold text-gray-600">4.52</p>
                    <span className="text-gray-500">(99件)</span>
                </div>
                <Tag
                    Icon={UserGroupIcon}
                    iconStyle="text-gray-400"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    〜15人
                </Tag>


                <Tag
                    Icon={HomeIcon}
                    iconStyle="text-gray-400"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    24m
                </Tag>


                <Tag
                    Icon={TagIcon}
                    iconStyle="text-gray-400"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    貸し会議室
                </Tag>
            </div>
        </>
    )
}
