import { Button, Price } from '@element'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { HeartIcon, ShareIcon } from '@heroicons/react/solid'
import React from 'react'

export const FloatingPrice = () => {
    return (
        <div className="w-96">
            <div className="p-5 space-y-4 border border-gray-200 rounded-lg">

                {/* price row */}
                <div className="flex justify-between">
                    <Price amount={1386} />
                    <p className="text-sm text-gray-600">¥ 10,392/日</p>
                </div>

                {/* date and time row */}
                <div className="grid grid-cols-2 border border-gray-200 rounded-md shadow-sm">
                    <div className="px-3 py-2 border-r border-gray-200">
                        <p className="text-xs font-bold text-gray-500">チェックイン</p>
                        <p className="text-gray-400">日時を追加</p>
                    </div>
                    <div className="px-3 py-2">
                        <p className="text-xs font-bold text-gray-500">チェックイン</p>
                        <p className="text-gray-400">日時を追加</p>
                    </div>
                </div>

                {/* button row */}
                <Button variant="primary">予約可能状況を確認する</Button>

                {/* policy row */}
                <div className="flex items-center justify-center space-x-1.5">
                    <p className="text-gray-600">48時間キャンセル無料</p>
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                </div>
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
        </div>
    )
}
