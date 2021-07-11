import { GoogleMap, Tag } from '@element'
import { HomeIcon, MapIcon } from '@heroicons/react/outline'
import React from 'react'

// const mapOptions = { center: { lat: 36.2048, lng: 138.2529 }, zoom: 6 } as google.maps.MapOptions;
const mapOptions = { center: { lat: 34.6619, lng: 135.5205 }, zoom: 12 } as google.maps.MapOptions;
const markers = [
    {
        coords: { lat: 34.6619, lng: 135.5205 } as google.maps.MapOptions,
        icon: "/home.svg",
        content: "<h1 style='font-weight: bold; margin-bottom: 0.5rem'>大阪府大阪市天王寺区</h1><ul><li>laititude: 34.6619N</li><li>longitude: 135.5205E</li></ul>"
    }
]

export const SpaceInfoAccess = () => {
    return (
        <div>
            <p className="mb-4 text-lg font-bold text-gray-700">アクセス</p>
            <div className="flex mb-4">
                <p className="w-32 text-sm font-bold text-gray-800">住所</p>
                <div className="text-sm text-gray-500">大阪府大阪市天王寺区四天王寺1-8-14</div>
            </div>
            <div className="flex mb-4">
                <p className="w-32 text-sm font-bold text-gray-800">最寄駅</p>
                <div className="text-sm text-gray-500">
                    <ul>
                        <li>大阪メトロ谷町線 四天王寺前夕陽ヶ丘駅 徒歩1分</li>
                        <li>大阪メトロ堺筋線 恵美須町駅 徒歩14分</li>
                        <li>大阪メトロ谷町線 天王寺駅 徒歩14分</li>
                        <li>大阪メトロ谷町線 谷町九丁目駅 徒歩16分</li>
                        <li>近鉄大阪線 大阪上本町駅 徒歩20分-8-14</li>
                    </ul>
                </div>
            </div>
            <div className="flex mb-4">
                <p className="w-32 text-sm font-bold text-gray-800">アクセス</p>
                <div className="text-sm text-gray-500">大阪メトロ谷町線四天王寺夕陽ヶ丘駅より徒歩30秒</div>
            </div>
            {/* <div className="w-full mt-6 mb-4 rounded bg-green-50 aspect-w-16 aspect-h-6" /> */}
            <div className="w-full mt-6 mb-4 rounded aspect-w-16 aspect-h-6">
                <GoogleMap options={mapOptions} markers={markers} />
            </div>
            <div className="flex justify-end">
                <Tag
                    Icon={MapIcon}
                    iconSize={5}
                    iconStyle="text-gray-600"
                    textStyle="text-sm text-gray-600"
                    numberOfLines={1}
                >
                    GoogleMapで場所を確認する
                </Tag>
            </div>
        </div>
    )
}
